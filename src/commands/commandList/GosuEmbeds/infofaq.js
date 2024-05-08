const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['infofaq'],
    args: '',
    desc: 'Gosu General Social Links',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let socials = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setTitle("Gosu Server Guides")
            .setDescription("**Check out the guides by clicking the button.** \n\nFor info on getting support click the `Support` button. \nFor info on available music bots click the `Music Bots` button. \nFor info on available fun bots click the `Fun Bots` button. \nFor info on leveling click on the `Leveling` button.")
            .setColor("#FFFEFE")
        p.send(socials)
    }
})