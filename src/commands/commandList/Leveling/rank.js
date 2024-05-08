const CommandInterface = require('../../commandInterface')
const {Font, LeaderboardBuilder} = require('canvacord')
const levelSchema = require('../../../../Schema/levelSchema')

module.exports = new CommandInterface({
    alias: ['rank'],
    args: '(user)',
    desc: "Checks your rank leaderboard.",
    related:["gh leaderboard", "gh level"],
    permissions:[],
    permLevel: 'User',
    group:["Leveling"],
    execute: async function(p){
        let member = (await p.fetchUser(p.args[0]))?.user
        let guild = await p.client.guilds.fetch("495716062097309697")

        let data = await p.mongo.queryOne("level", member?.id??p.msg.author.id)
        if(!data) data = await p.mongo.createOne("level", { _id: member?.id??p.msg.author.id, level: 0, exp: 0, lastSent: 0})

        let sortedRank = await levelSchema.find({}).sort({level: -1, exp: -1})
        let userRank = await levelSchema.find({}).sort({level: -1, exp: -1}).then((sorted) => sorted.findIndex((user) => user._id == `${member?.id??p.msg.author.id}`))

        let lbRank = []
        let count = 0
        let min = userRank-4
        let max = userRank+5
        if(min<0){
            min = 0
            max = 9
        }else if(max+1>=sortedRank.length){
            max = sortedRank.length-1
            min = max-9
        }

        for(let rank = min; rank<max+1; rank++){
            let rankObj = {}
            let user = (await p.fetchUser(sortedRank[rank]._id))?.user
            rankObj.avatar = user ? `${user?.displayAvatarURL({forceStatic: true})}` : p.msg.guild.iconURL({forceStatic: true})
            rankObj.username = user ? `${user?.username}` : sortedRank[rank]._id + ' • User Left'
            rankObj.level = sortedRank[rank].level 
            rankObj.xp = sortedRank[rank].exp
            rankObj.rank = rank-count+1
            lbRank.push(rankObj)
        }

        Font.loadDefault();
        const lb = new LeaderboardBuilder()
            .setHeader({
                title: "Gosu",
                image: `${guild.iconURL({forceStatic: true})}`,
                subtitle: `Your rank #${userRank+1}`
            })
            .setPlayers(lbRank)

        lb.setVariant('horizontal')
        lb.width = '1000px'
        lb.height = '2000px'

        const image = await lb.build({ format: "png" });

        p.msg.channel.send({files: [image]})
    }
})