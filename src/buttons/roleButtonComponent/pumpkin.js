//0*(57+37+41+32+43+56+39+37),8,3,4,6,2,(7&1),5
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')

module.exports = {
    address: ['495716062097309697/1201714240126468116/1203146978733719563'],
    actionRow: {
        name: "Color5",
    },
    position: 0,
    buttonData: new ButtonBuilder()/*.setLabel('pumpkin')*/.setEmoji({name: '🥧'}).setStyle(2).setCustomId('pumpkin')
}