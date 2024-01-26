const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')

module.exports = {
    address: [/*'493164609591574528/1196628188403597495/1199872661799575552',*/ '495716062097309697/1199891939642851378/1199893521088401480'],
    actionRow: {
        name: "Lv50-2",
        position: 1
    },
    position: 1,
    buttonData: new ButtonBuilder().setLabel('Philosopher').setStyle(1).setCustomId('philosopher')
}