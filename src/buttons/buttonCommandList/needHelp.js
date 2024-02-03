const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['i-need-help'],
    permissions: [],
    permLevel: 'User',
    cd: 900000,
    group: [],
    execute: async function(p){
        p.interaction.reply(`<@!${p.interaction.user.id}> needs help! <@&495727371140202506>`)
    }
})