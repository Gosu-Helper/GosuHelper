const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['confirm'],
    permisions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let error = new p.embed().setDescription("I wasn't able to send your application at this time, please try again later.").setColor("ERROR")
        let user = await p.fetchUser(p.interaction.user.id)
        let apply = await p.fetchChannel("717770672125902860")

        let data = await p.mongo.queryOne("application", p.interaction.user.id)
        if(!data) return p.interaction.reply({embeds: [error], ephemeral: true})

        let application = new p.embed().setTitle("Nickname Change Request").setDescription(`<@!${user.user.id}>`).setColor("OBTAINED")
        .addFields(
            {
                name: "Old", value: `${user.nickname}`
            },
            {
                name: "New", value: `${data.nickname.name}`
            },
            {
                name: "Status", value: "Waiting approval"
            }
        )
        .setFooter(`${user.user.id} `)
        .setTimestamp()

        let confirmed = new p.embed().setDescription("Your application has been sent. Please be patient and wait for a moderator to approve your request.").setColor("SUCCESS")

        if(data.nickname.confirmed == true){
            confirmed.setDescription("Your application was already received. Please be patient and wait for a moderator to approve your request.")
            return p.interaction.reply({embeds: [confirmed], ephemeral: true})
        }
        
        let approve = new ButtonBuilder().setLabel("Approve").setStyle(3).setCustomId('approve')
        let disapprove = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('disapprove')
        let actionRow = new ActionRowBuilder().setComponents([approve, disapprove])
        
        apply.send({embeds: [application], components: [actionRow]}).then( async m => {            
            data.nickname.confirmed = true
            data.nickname._id = `${m.id}`
            await data.save()
        })
        
        p.interaction.reply({embeds: [confirmed], ephemeral: true})
    }
})