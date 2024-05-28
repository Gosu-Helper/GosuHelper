const {ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType} = require('discord.js')
const debug = require('../utils/debug')

module.exports.handle = async (main, message) => {

    if(message.author.bot) return
    //await main.testing.execute(message)

    /*let data = await main.mongo.queryOne("bal", message.author.id, { _id: message.author.id, balance: 0 })
    if(!cdCache[message.author.id]){
        let random = Math.floor((Math.random() * 15)+1)
            data.balance += random
            cdCache[message.author.id] = Date.now()
            setTimeout(() => {delete cdCache[message.author.id]}, 60000)
    }

    await data.save()*/
    /*const first = (new main.button).setLabel('First').setStyle(1).setCustomId('first').setEmoji({name: '😂'})
    const second = (new main.button).setLabel('Second').setStyle('first').setCustomId('second')
    const first_djs = new ButtonBuilder().setLabel('First_Djs').setStyle(ButtonStyle.Primary).setCustomId('first-button').setEmoji({ name: '😂'})
    const second_djs = new ButtonBuilder().setLabel('Second_Djs').setStyle(ButtonStyle.Primary).setCustomId('second-button')
    const buttonRow = (new main.actionrow).addComponents(first)
    const buttonRow_djs = new ActionRowBuilder().addComponents(first_djs, second_djs)*/
    //console.log(buttonRow.components[0])
    //console.log(buttonRow_djs.components[0])
    //console.log(first)
    //let reply_djs = await message.channel.send({content: "hi", components: [buttonRow_djs]}).then(ButtonBuilder.from(first).setDisabled(true))
    //console.log(buttonRow.toJSON())
    //console.log(buttonRow_djs.toJSON())
    //let reply = await message.channel.send({content: "hi", components: [buttonRow]}).then(ButtonBuilder.from(first).setDisabled(true))
    /*let filter = (i) => i.user.id === message.author.id
    const collect = reply.createMessageComponentCollector({
        ComponentType: ComponentType.Button,
        filter
    })
    collect.on('collect', (interaction)=>{
        console.log(interaction.user.id)
        console.log(message.author.id)
    })*/
    
    let force = message.author.id == "274909438366973953" && message.content.includes("ghdebug") && message.content.includes("force") ? true : false

    let member = await message.guild.members.fetch(message.author.id)
    
    let flag = await debug(main, member)

    if(flag && force == false) return
    else if(force == true){
        message.content = "ghdebug all -servers $all off -users $all off"
        return await main.commands.execute(message)
    }

    await main.commands.execute(message)
    message.content = `${message.author.id}-ChatExp`
    await main.commands.execute(message)
}