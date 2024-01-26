/*const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['collect'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){

        const seconds = 10
        const filter = (m) => m.author.id == p.interaction.user.id

        p.interaction.reply("Collecting")
        const collector = p.interaction.channel.createMessageCollector({filter, time: seconds*1000})

        collector.on('end', collected => {
            console.log(collected)
        })
    }
})*/