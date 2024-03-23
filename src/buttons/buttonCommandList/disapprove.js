const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['disapprove'],
    permisions: [],
    permLevel: 'Server Moderator',
    group: [],
    execute: async function(p){
        let error = new p.embed().setDescription("I wasn't able to find the users application.").setColor("ERROR")
        let apply = await p.fetchChannel("717770672125902860")
        let support = await p.fetchChannel("500079487610912791")
        
        let embed = p.interaction.message.embeds[0]
        
        let applicationSchema = require('../../../Schema/applicationSchema')
        let data = await p.mongo.queryOne("application", embed.footer.text)
        if(!data) return p.interaction.reply({embeds: [error], ephemeral: true})
        
        let user = await p.fetchUser(data._id)
        let message = await apply.messages.fetch(data.nickname._id)
        
        let denied = new p.embed().setDescription("The user did not confirm their application.").setColor("ERROR")
        
        if(!user){
            await applicationSchema.deleteOne({_id: data._id})
            denied.setDescription("The user is no longer in the server.")
            return p.interaction.reply({embeds: [denied]})
        }

        if(!data.nickname.confirmed){
            await applicationSchema.deleteOne({_id: user.id})
            p.client.users.send(user.id, "Your application was denied since you did not confirm your application. \nIf you want to change your nickname, please reapply again in <#1220221275927089194>.")
            .catch(() => {
                support.send(`<@!${user.id}>, your application was denied since you did not confirm your application. \nIf you want to change your nickname, please reapply again in <#1220221275927089194>.`)
            })
            embed.fields[2].value = `User did not confirm their application.`
            message.edit({embeds: [embed], components: []})
            return p.interaction.reply({embeds: [denied], ephemeral: true})
        }
        
        await applicationSchema.deleteOne({_id: user.id})

        p.client.users.send(user.id, `Your application for nickname change in ${p.interaction.guild.name} has been denied. \nPlease reapply again with a different nickname if needed in <#1220221275927089194>.`)
        .catch(() => {
            support.send(`<@!${user.id}>, your application for nickname change has been denied. \nPlease reapply again with a different nickname if needed in <#1220221275927089194>.`)
        })

        embed.fields[2].value = `Denied by <@!${p.interaction.user.id}>`
        p.interaction.update({embeds: [embed], components: []})
    }
})