class Base{
    constructor(Discord){
        const {Client, IntentsBitField} = require('discord.js')
        const client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent
            ]
        })
        this.discord = Discord
        this.client = client
    }
    login(){
        require('dotenv').config()
        this.client.login(process.env.TOKEN)
    }
}

module.exports = Base