const {DateTime} = require('luxon')
const CommandInterface = require('../../commandInterface')
require('dotenv').config()

module.exports = new CommandInterface({
    alias: ['info'],
    args: '',
    desc: "Get bot info.",
    related:["hns help"],
    permissions:[],
    permLevel: 'User',
    group:["Info"],
    execute: async function(p){
        let guilds = await p.client.guilds.fetch() //Fetch all guilds of client
        let ownerGuild = await p.client.guilds.fetch(process.env.OWNER_GUILD) //Fetch bot owner guild
        let owner = (await ownerGuild.members.fetch(process.env.OWNER_ID)).user //Fetch owner from owner guild
        let ownerName = `${owner.username}` || 'Flaming' //Set owner name to owner username else Flaming
        let userCount = p.client.users.cache.size || 0 //Fetch client user count cache size or 0
        let clientJoinedAt = new Date((await p.msg.guild.members.fetch(p.client.user.id)).joinedTimestamp).toISOString()
        //Put all into info Embed
        let info = new p.embed()
        .setAuthor({name: p.client.user.username, iconURL: p.client.user.displayAvatarURL({dynamic: true})})
        .addFields(
            {name: 'Dedicated For', value: 'Gosu General', inline: true},
            {name: 'Version', value: '1.0.0', inline: true},
            {name: 'Library', value: 'Discord.js', inline: true}
        )
        .addFields(
            {name: 'Creator', value: ownerName, inline: true},
            {name: 'Created', value: `${DateTime.fromISO(p.client.user.createdAt.toISOString()).toLocaleString(DateTime.DATETIME_SHORT)}`, inline: true},
            {name: 'Server', value: '[Link](https://discord.gg/gosugeneral)', inline: true}
        )
        .addFields(
            {name: 'Servers', value: `${guilds.size}`, inline: true},
            {name: 'Users', value: `${userCount}`, inline: true},
            {name: `Joined`, value: `${DateTime.fromISO(clientJoinedAt).toLocaleString(DateTime.DATETIME_SHORT)}`, inline: true}
        ).setColor("820300")//.check(p.msg, true)

        p.send(info)
    }
})

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'info',
    aliases: [],
    module: "Info",
    description: "Get bot info.",
    usage: "info"
}