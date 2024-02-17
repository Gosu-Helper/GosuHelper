const CommandInterface = require("../../commandInterface");
const {DateTime} = require('luxon')

module.exports = new CommandInterface({
    alias: ['serverinfo', 'guildinfo'],
    args: '',
    desc: "Get server info/stats.",
    related: ["gh roleinfo", "gh membercount"],
    permissions: [],
    permLevel: 'User',
    group: ['Miscellaneous'],
    execute: async function(p){
        let owner = (await p.msg.guild.fetchOwner()).user//Guild owner
        let categorySize = (await p.msg.guild.channels.fetch()).filter(c => c?.type == 'GUILD_CATEGORY').size//Category count
        let textSize = (await p.msg.guild.channels.fetch()).filter(c => c?.type == 'GUILD_TEXT').size//Text channel count
        let voiceSize = (await p.msg.guild.channels.fetch()).filter(c => c?.type == 'GUILD_VOICE').size//Voice channel count
        let roleSize = (await p.msg.guild.roles.fetch()).size//Role count
        let memberSize = p.msg.guild.memberCount//Member count
        let boostCount = p.msg.guild.premiumSubscriptionCount//Boost count
        let boostTier = p.msg.guild.premiumTier==="NONE"?"None":p.msg.guild.premiumTier//Boost tier
        let vanity = p.msg.guild.vanityURLCode?`[${p.msg.guild.vanityURLCode}](https://discord.gg/${p.msg.guild.vanityURLCode})`:"None"//Vanity URL
        let serverIcon = p.msg.guild.iconURL({dynamic: true})//Server icon
        //Server info embed
        let serverinfo = new p.embed()
        .setAuthor({name: p.msg.guild.name})
        .addFields(
            {name: `Categories`, value: `${categorySize}`, inline: true},
            {name: `Text Channels`, value: `${textSize}`, inline: true},
            {name: `Voice Channels`, value: `${voiceSize}`, inline: true}
        )
        .addFields(
            {name: `Owner`, value: `${owner.username}#${owner.discriminator}`, inline: true},
            {name: `Members`, value: `${memberSize}`, inline: true},
            {name: `Roles`, value: `${roleSize}`, inline: true}
        )
        .addFields(
            {name: `Boosters`, value: `${boostCount}`, inline: true},
            {name: `Boost Tier`, value: `${boostTier}`, inline: true},
            {name: `Vanity URL`, value: `${vanity}`, inline: true}
        )
        .setThumbnail(serverIcon)
        .setColor('HEART')
        .setFooter({text: `ID: ${p.msg.guild.id} | Server Created • ${DateTime.fromISO(p.msg.guild.createdAt.toISOString()).toLocaleString(DateTime.DATETIME_SHORT)}`})
    
        p.send(serverinfo)
    }
})