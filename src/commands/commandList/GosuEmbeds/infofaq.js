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
            .setTitle("Gosu Server FAQ")
            .setDescription("Check out the FAQs by clicking the button.")
            .setColor("#FFFEFE")
        p.send(socials)
    }
})