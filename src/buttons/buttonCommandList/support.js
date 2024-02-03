const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['support'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        p.interaction.reply({content:`Go to <#500079487610912791> and say what you need help with!`, ephemeral: true})
    }
})