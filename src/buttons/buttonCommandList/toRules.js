const ButtonInterface = require('../buttonInterface')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')

module.exports = new ButtonInterface({
    alias: ['to-rules'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let extendedRules = new ButtonBuilder().setLabel('Extended Rules').setEmoji({name: '📔'}).setStyle(2).setCustomId('extended-rules')
        let actionRow = new ActionRowBuilder().addComponents(extendedRules)
        let join = new p.embed()
            .setAuthor(p.interaction.member.guild.name, p.interaction.member.guild.iconURL())
            .setTitle("Welcome to Gosu(고수) Server")
            .setDescription("\n\n**Click Extended Rules button to view full details.**\n\nThis server abides by the following ToS.\n[Discord's Community Guidelines](https://discordapp.com/guidelines)\n[Discord's Term of Service](https://discordapp.com/terms)\n[MLBB's Terms of Service](https://m.mobilelegends.com/en/newsdetail/473)\n")
            .setFooter({iconURL: p.interaction.member.guild.iconURL()})
            .setColor("#FFFEFE")
        p.interaction.reply({embeds: [join], components: [actionRow], ephemeral: true})
    }
})