const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['ping', 'hi'],
    permisions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        p.interaction.reply({content: 'Hello World!', ephemeral: true})
    }
})