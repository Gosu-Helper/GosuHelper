const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['leveling'],
    desc: '',
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let embed = new p.embed()
        .setTitle("Leveling")
        .setDescription("Based upon <@!1194078943888810144> | Prefix is `gh`\n\nYou can gain experience by sending messages in any of the channels. You will gain between 10-20 experience per message with a cooldown of 30 seconds.")
        .addFields(
            {
                name: "Commands", value: "Commands include: `ghlevel` to check your level, `ghleaderboard` to check the top 10, `ghrank` to check your position on the leaderboard"
            },
            {
                name: "Rewards", value: "For leveling rewards check [this message](https://discord.com/channels/495716062097309697/1227276632956342332/1227280959221792799) for more info by clicking on the `Level Roles` button."
            }
        )
        .setColor("HEART")
        p.interaction.reply({embeds: [embed], ephemeral: true})
    }
})