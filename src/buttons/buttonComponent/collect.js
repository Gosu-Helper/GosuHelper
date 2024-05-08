const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
    
module.exports = {
    address: ['493164609591574528/1196628188403597495/1199436785525194772'],
    actionRow: {
        name: "Collect",
        position: "0"
    },
    position: 0,
    buttonData: new ButtonBuilder().setLabel('Collect').setEmoji({name: '🗑️'}).setStyle(2).setCustomId('collect')
}