const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['disapprove'],
    permisions: [],
    permLevel: 'Server Moderator',
    group: [],
    execute: async function(p){
        let support = await p.fetchChannel("500079487610912791")

        if(p.interaction.customId=='pending-youtube'||p.interaction.customId=='pending-twitch'||p.interaction.customId=='pending-tiktok'){
            let application = p.interaction.message.embeds[0]
            let embed = (await p.interaction.fetchReply()).embeds[0]
            let id = application.footer.text.slice(4, application.footer.text.length)
            let user = await p.fetchUser(id)
            
            if(!user){
                let length = application.fields.length/3
                for(let i = 0; i<length; i++){
                    application.fields[i*3+2].value = "User Left"
                }
                
                await deleteApplication(p, {id}, "promotion", "", "", true)

                embed.fields[2].value = "User Left"

                p.interaction.editReply({embeds: [embed], components: [], ephemeral: true})

                return p.interaction.message.edit({embeds: [application], components: [], ephemeral: true})
            }

            let data = await p.mongo.queryOne("application", user?.user?.id)
        
            if(!data){
                let length = application.fields.length/3
                for(let i = 0; i<length; i++){
                    application.fields[i*3+2].value = "Application Not Found"
                }

                p.client.users.send(user.id, `Your Self Promotion application in ${p.interaction.guild.name} for all platforms was denied, due to an error in finding your application. \nIf you want to self promote in <#534423531358781441>, please reapply again in <#1220221275927089194>.`)
                .catch(() => {
                    support.send(`<@!${user.id}>, your Self Promotion application for all platforms was denied, due to an error in finding your application. \nIf you want to self promote in <#534423531358781441>, please reapply again in <#1220221275927089194>.`)
                })

                embed.fields[2].value = "Application Not Found"

                p.interaction.editReply({embeds: [embed], components: [], ephemeral: true})

                return p.interaction.message.edit({embeds: [application], components: [], ephemeral: true})
            }

            let platform = p.interaction.customId.slice(8, p.interaction.customId.length)

            if(data?.promotion?.[platform]?.status === "In Progress"){
                embed.fields[2].value = `Application In Progress`
                embed.fields.push({name: `${p.zws}`, value: "Unable to approve/deny until user finishes application."})
                return p.interaction.editReply({embeds: [embed], components: [], ephemeral: true})
            }

            await deleteApplication(p, {id}, "promotion", data, `${platform}`)

            let platformField = application.fields.indexOf(application.fields.filter(field => field.name.toLowerCase() == platform)[0])
            application.fields[platformField+2].value = `Denied by <@!${p.interaction.user.id}>`
            
            let platformButton = p.interaction.message.components[0].components.filter(button => button.data.label.toLowerCase() == platform)
            let buttonIndex = p.interaction.message.components[0].components.indexOf(platformButton[0])            
            
            p.interaction.message.components[0].components.splice(buttonIndex, 1)
            let component = p.interaction.message.components[0].components.length > 0 ? [p.interaction.message.components[0]] : []

            p.interaction.message.edit({embeds: [application], components: component})

            embed.fields[2].value = `Denied by <@!${p.interaction.user.id}>`

            p.interaction.editReply({embeds: [embed], components: []})

            p.client.users.send(user.id, `Your Self Promotion application in ${p.interaction.guild.name} for the ${platformButton[0].data.label} platform has been denied. \nIf you want to self promote in <#534423531358781441>, please reapply again in <#1220221275927089194>.`)
            .catch(() => {
                support.send(`Your Self Promotion application for the ${platformButton[0].data.label} platform has been denied. \nIf you want to self promote in <#534423531358781441>, please reapply again in <#1220221275927089194>.`)
            })
        }else{
            let error = new p.embed().setDescription("I wasn't able to find the users application.").setColor("ERROR")
            let apply = await p.fetchChannel("717770672125902860")
            
            let embed = p.interaction.message.embeds[0]

            let data = await p.mongo.queryOne("application", embed.footer.text.slice(4, embed.footer.text.length))
            if(!data) return p.interaction.reply({embeds: [error], ephemeral: true})
            
            let user = await p.fetchUser(data._id)
            let message = await apply.messages.fetch(data.nickname._id)
            
            let denied = new p.embed().setDescription("The user did not confirm their application.").setColor("ERROR")
            
            if(!user){
                await deleteApplication(p, {id: data._id}, "nickname", data, "", true)
                denied.setDescription("The user is no longer in the server.")
                return p.interaction.reply({embeds: [denied]})
            }

            if(!data.nickname.confirmed){
                await deleteApplication(p, user, "nickname", data)
                p.client.users.send(user.id, "Your application was denied since you did not confirm your application. \nIf you want to change your nickname, please reapply again in <#1220221275927089194>.")
                .catch(() => {
                    support.send(`<@!${user.id}>, your application was denied since you did not confirm your application. \nIf you want to change your nickname, please reapply again in <#1220221275927089194>.`)
                })
                embed.fields[2].value = `User did not confirm their application.`
                message.edit({embeds: [embed], components: []})
                return p.interaction.reply({embeds: [denied], ephemeral: true})
            }
            
            await deleteApplication(p, user, "nickname", data)

            p.client.users.send(user.id, `Your application for nickname change in ${p.interaction.guild.name} has been denied. \nPlease reapply again with a different nickname if needed in <#1220221275927089194>.`)
            .catch(() => {
                support.send(`<@!${user.id}>, your application for nickname change has been denied. \nPlease reapply again with a different nickname if needed in <#1220221275927089194>.`)
            })

            embed.fields[2].value = `Denied by <@!${p.interaction.user.id}>`
            p.interaction.update({embeds: [embed], components: []})
        }
    }
})

async function deleteApplication(p, user, type, data, platform, force=false){
    let applicationSchema = require('../../../Schema/applicationSchema')

    if(data) await data.save()

    if(type=="nickname"){
        if(!data?.promotion?.youtube&&!data?.promotion?.twitch&&!data?.promotion?.tiktok||force){
            await applicationSchema.deleteOne({_id: user.id})
        }else{
            await applicationSchema.updateOne({_id: user.id}, { $unset: { nickname: {} } })
        }
    }else if(type=="promotion"){
        if(platform=="youtube") await applicationSchema.updateOne({_id: user.id}, { $unset: { "promotion.youtube": {} } })
        else if(platform=="twitch") await applicationSchema.updateOne({_id: user.id}, { $unset: { "promotion.twitch": {} } })
        else if(platform=="tiktok") await applicationSchema.updateOne({_id: user.id}, { $unset: { "promotion.tiktok": {} } })

        data = await p.mongo.queryOne("application", user.id)

        if(force) await applicationSchema.deleteOne({_id: user.id})
        else if(!data?.promotion?.youtube&&!data?.promotion?.twitch&&!data?.promotion?.tiktok&&!data?.nickname){
            await applicationSchema.deleteOne({_id: user.id})
        }
    }
}