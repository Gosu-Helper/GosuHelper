const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
    
module.exports = {
    address: ['495716062097309697/1203156522603913237/1203156603667488888/Agree'],
    position: 1,
    buttonData: new ButtonBuilder().setLabel('To Rules').setEmoji({name: '📔'}).setStyle(2).setCustomId('to-rules')
}