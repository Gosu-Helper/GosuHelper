const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
    
module.exports = {
    address: ['495716062097309697/1203156522603913237/1203156603667488888'],
    actionRow: {
        name: "Agree",
        position: "0"
    },
    position: 0,
    buttonData: new ButtonBuilder().setLabel('Agree To Rules').setEmoji({name: '✅'}).setStyle(3).setCustomId('agree-to-rules')
}