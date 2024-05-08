//0*(57+37+41+32+43+56+39+37),8,3,4,6,2,(7&1),5
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
    
module.exports = {
    address: ['495716062097309697/1201714240126468116/1203147149580173462'],
    actionRow: {
        name: "Region",
    },
    position: 0,
    buttonData: new ButtonBuilder()/*.setLabel('NA')*/.setEmoji({name: '🇺🇸'}).setStyle(2).setCustomId('na')
}