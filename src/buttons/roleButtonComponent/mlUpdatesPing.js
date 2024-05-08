//0*(57+37+41+32+43+56+39+37),8,3,4,6,2,(7&1),5
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
    
module.exports = {
    address: ['495716062097309697/1201714240126468116/1203147150385741844'],
    actionRow: {
        name: "Server",
    },
    position: 3,
    buttonData: new ButtonBuilder()/*.setLabel('ML Updates Ping')*/.setEmoji({name: '🔔'}).setStyle(2).setCustomId('ml-updates-ping')
}