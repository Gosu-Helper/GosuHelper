const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['fetch', 'hi'],
    permisions: [],
    permLevel: 'Administrator',
    group: [],
    execute: async function(p){
        p.interaction.reply({content: 'Hi', ephemeral: true})
    }
})