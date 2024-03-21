const CommandInterface = require('../../commandInterface')
const {Font, RankCardBuilder} = require('canvacord')
const levelSchema = require('../../../../Schema/levelSchema')

module.exports = new CommandInterface({
    alias: ['level'],
    args: '(user)',
    desc: "Check your current level.",
    related:["gh leaderboard", "gh rank"],
    permissions:[],
    permLevel: 'User',
    group:["Leveling"],
    execute: async function(p){
        let member = (await p.fetchUser(p.args[0]))?.user

        let data = await p.mongo.queryOne("level", member?.id??p.msg.author.id)
        if(!data) data = await p.mongo.createOne("level", { _id: member?.id??p.msg.author.id, level: 0, exp: 0, lastSent: 0})

        let rank = await levelSchema.find({}).sort({level: -1, exp: -1}).then((sorted) => sorted.findIndex((user) => user._id == `${member?.id??p.msg.author.id}`))
        let currentLevelExp = await (new p.leveling()).currentLevelExp(p, member||p.msg.author)

        Font.loadDefault()
        let card = new RankCardBuilder()
            .setAvatar(member?.displayAvatarURL({forceStatic: true})??p.msg.author.displayAvatarURL({forceStatic: true}))
            .setDisplayName(member?.username??p.msg.author.username)
            .setStatus(member?.presence?.status??(await p.fetchUser(p.msg.author.id))?.presence?.status)
            .setRank((rank+1)||"?")
            .setLevel(data?.level||0)
            .setCurrentXP(data?.exp||0)
            .setRequiredXP(currentLevelExp)
            //.setBackground("https://cdn.discordapp.com/attachments/495719121686626323/1204194906764222575/banner.jpg?ex=65d3d8e6&is=65c163e6&hm=63389df4efc7e073afc655f097fd1af826faf8a4f1e178f5afd1a307d7249b6f&")
            .setBackground("https://cdn.discordapp.com/attachments/495719121686626323/1204219510350155787/360_F_266356338_5sHTI2256ndaVN4Nkrd90Kx87gJ8EV3A.jpg?ex=65d3efd0&is=65c17ad0&hm=8c2d14373f75c34ae425620c63a367a98cb6228e111dbff9240465d79df621f0&")
            .setTextStyles({xp: " "})
            .setStyles({//9799f9 | 73100f | 541f1e
                overlay: {
                    style: {
                        backgroundColor: "rgba(0,0,0,0)",
                      },
                },
                statistics:{
                    level: {
                        text: { className: 'text-[#ffffff] text-3xl'},
                        value: { className: 'text-[#ffffff] text-3xl'}
                    },
                    rank: {
                        text: { className: 'text-[#ffffff] text-3xl'},
                        value: { className: 'text-[#ffffff] text-3xl'}
                    },
                    xp: {
                        text: { className: 'text-[#ffffff] text-3xl'},
                        value: { className: 'text-[#ffffff] text-3xl'}
                    },
                },
                username: {
                    name: { className: 'text-[#ffffff] text-5xl' },
                    handle: { className: 'text-[#ffffff] shadow-lg' },
                    container: { className: 'italic' }
                },
                progressbar: {
                    container: { className: 'bg-[#000000]' },
                    track: { className: 'bg-[#000000]' },
                    thumb: { className: 'bg-[#ff59c7]' }
                }

            })
            /*.setStyles({
                username: {
                    name: { className: 'text-[#000000] text-5xl font-[Times-Bold]' },
                    handle: { className: 'text-[#aaffaa] shadow-lg' },
                    container: { className: 'italic' }
                },
                statistics: {
                    level: {
                        text: { className: 'text-[#D3D3D3] text-4xl shadow-lg' },
                        value: { className: 'text-[#ddf4dd] text-4xl shadow-lg' }
                    },
                    rank: {
                        text: { className: 'text-[#D3D3D3] text-4xl shadow-lg' },
                        value: { className: 'text-[#ddf4dd] text-4xl shadow-lg' }
                    },
                    xp: {
                        text: { className: 'text-[#D3D3D3] text-4xl shadow-lg' },
                        value: { className: 'text-[#ddf4dd] text-4xl shadow-lg' }
                    }
                },
                overlay: {
                    style: {
                        backgroundColor: "rgba(61, 39, 245, 0.2)" || "rgba(39, 52, 245, 0.1)",
                      },
                },
                progressbar: {
                    container: { className: 'bg-[#455a64]' },
                    track: { className: 'bg-[#2e7d32]' },
                    thumb: { className: 'bg-[#c8e6c9]' }
                }
            })
            //.setStyle()*/
            //.setProgressCalculator(() => {return Math.floor((data?.exp/currentLevelExp)*100)})
        let image = await card.build({
            format: 'png'
        })

        p.msg.channel.send({files: [image]})

        /*let level = new p.embed()
            .setAuthor({name: member?.username??p.msg.author.username, iconURL: member?.displayAvatarURL({dynamic: true})??p.msg.author.displayAvatarURL({dynamic: true})})
            .setColor('SUCCESS')
            .setDescription(`Level ${data?.level??0} [${data?.exp??0}/${await (new p.leveling()).currentLevelExp(p, member||p.msg.author)}]`)
        p.send(level)*/
    }
})