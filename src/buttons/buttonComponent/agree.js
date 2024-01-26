const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')

module.exports = {
    address: ['493164609591574528/1196628188403597495/1199402944127320186'],
    actionRow: {
        name: "Agree",
        position: "0"
    },
    position: 0,
    buttonData: new ButtonBuilder().setLabel('Agree To Rules').setEmoji({name: '✅'}).setStyle(3).setCustomId('agree-to-rules')
}