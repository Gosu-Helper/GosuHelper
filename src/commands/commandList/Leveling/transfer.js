const CommandInterface = require('../../commandInterface')
const levelClass = require('../../../utils/level')

module.exports = new CommandInterface({
    alias: ['transfer'],
    args: '[user] [level] (experience)',
    desc: "Transfers users level.",
    related:["gh transfer"],
    permissions:[],
    permLevel: 'Server Moderator',
    group:["Leveling"],
    execute: async function(p){
        let member = await p.fetchUser(p.args[0])
        let success = new p.embed()
            .setAuthor({name: member?.user?.username, iconURL: member?.displayAvatarURL({dynamic: true})})
            .setColor('SUCCESS')
        let unfound = new p.embed()
            .setDescription("I couldn't find that user.")
            .setColor("UNFOUND")
        let unable = new p.embed()
            .setAuthor({name: member?.user?.username, iconURL: member?.displayAvatarURL({dynamic: true})})
            .setColor('FAILURE')
        
        let guild = await p.client.guilds.fetch("495716062097309697")
        let channel = await guild.channels.fetch("687075634064916501")
        
        if(!member) return p.send(unfound)

        let roles = []
        member.roles.cache.forEach((role) => roles.push(role.name))

        let data = await p.mongo.queryOne("level", `${member.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: member.id, level: 0, exp: 0, lastSent: 0})

        let level = parseInt(p.args[1], 10)
        let exp = parseInt((p.args[2]?.split(",")?.join("") ?? 0), 10)

        if(Number.isNaN(level) || !(level == p.args[1])) return p.send(unable.setDescription(`Unable to set the Level for <@!${member.id}>\nPlease enter a valid number`))
        else if(Number.isNaN(exp)) return p.send(unable.setDescription(`Unable to set the Experience for <@!${member.id}>\nPlease enter a valid number.`))

        data.level = level
        data.exp = exp

        await data.save()

        new levelClass(p, p.msg).rewards(p, member, level)

        success.setDescription(`Updated <@!${member.id}> to Level ${level} with ${exp} experience.`)
        p.send(success)
        channel.send({embeds: [success.addField("Roles", roles.join(", "))]})
    }
})