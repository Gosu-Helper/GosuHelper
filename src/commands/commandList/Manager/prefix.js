const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['prefix','pref'],
    args: '[prefix]',
    desc: "Changes server prefix.",
    related:["hns info"],
    permissions:[],
    permLevel: 'User',
    group:["Manager"],
    execute: async function(p){
        let success = new p.embed().setColor('SUCCESS')
        let length = new p.embed().setDescription('Prefix must be less than 5 characters.').setColor('LENGTH')
        let current = new p.embed().setColor('HEART')

        let data = await p.mongo.queryOne("prefix", p.msg.guildId)
        let prefix = data?.newPrefix || p.main.prefix
        //No args or args equal to current send guild prefix
        if(p.args.length < 1 || p.args[0] == 'current') return p.send(current.setDescription(`The prefix for this server is \`${prefix}\``))

        if(p.level < 3) return//If the user permission level is lower than of Administrator(Lv3) on the server return
        //If prefix is greater than 5 characters
        if(p.args[0] && p.args[0].length > 5 && p.args[0] != 'current') return p.send(length)

        if(!data){//No data
            data = await p.mongo.createOne("prefix", { _id: p.msg.guildId, newPrefix: p.args[0] })
            p.send(success.setDescription(`Changed the prefix for this server to \`${data.newPrefix}\``))
        } else if(data){//Data
            data.newPrefix = p.args[0]
            await data.save()
            p.send(success.setDescription(`Changed the prefix for this server to \`${data.newPrefix}\``))
        }
    }
})