const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')

module.exports = {
    address: ['495716062097309697/1203156522603913237/1203156603667488888/Agree/2'],
    position: 6,
    buttonData: new ButtonBuilder().setLabel('HELP').setEmoji({name: '❔'}).setStyle(4).setCustomId('i-need-help')
}