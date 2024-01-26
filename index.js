/*require('dotenv').config();
const {Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ButtonInteraction, ComponentType} = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
})

client.on('messageCreate', async (msg) => {
    if (msg.author.bot) return

    const firstButton = new ButtonBuilder()
    .setLabel('I agree')
    .setStyle(ButtonStyle.Secondary)
    .setCustomId('first-button')

    const buttonRow = new ActionRowBuilder().addComponents(firstButton)
    
    msg.channel.send({content: "Gosu", components: [buttonRow]})
})

client.on('interactionCreate', (interaction)=>{
    if(interaction.isButton() && interaction.customId === "first-button"){
        interaction.reply("Yay")
    }
})

client.on('ready', (c) => {
    console.log('Ready')
})

client.login(process.env.TOKEN)*/
const ButtonBuilder = require('./src/buttonUtils/ButtonBuilder')
const ActionRowBuilder = require('./src/buttonUtils/ActionRowBuilder')
const Discord = require('discord.js')
const Base = require('./src/Base')
class GosuHelper extends Base{
    constructor(client){
        super(client)
        this.config = require('./src/data/config.json')
        this.prefix = this.config.prefix
        this.mongo = require('./src/utils/mongo')
        this.sender = require('./src/utils/sender')
        this.button = ButtonBuilder
        this.actionrow = ActionRowBuilder
        //console.log(require('./src/buttons/Buttons/ping'))
        //this.data = require('./data')
        //findChannel(this.client)
        //this.testing = new (require('./src/commands/testAsync'))(this)
    }
    launch(){
        this.eventhandler = new (require('./src/eventHandlers/EventHandler'))(this)
        super.login()
        return this
    }
    init(){
        this.commands = new (require('./src/commands/command'))(this)
        this.buttons = new (require('./src/buttons/button'))(this)
        require('./mongoindex')()
    }
}

(new GosuHelper(Discord)).launch().init()