const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['confirmed'],
    permisions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let error = new p.embed().setDescription("I wasn't able to send your application at this time, please try again later.").setColor("ERROR")
        let confirmed = new p.embed().setDescription("Your application has been sent. Please be patient and wait for a moderator to approve your request.").setColor("SUCCESS")

        let user = await p.fetchUser(p.interaction.user.id)
        let apply = await p.fetchChannel("717770672125902860")

        let data = await p.mongo.queryOne("application", p.interaction.user.id)
        if(!data) return p.interaction.reply({embeds: [error], ephemeral: true})

        if(p.command == 'nick'){
            let application = new p.embed().setTitle("Nickname Change Request").setDescription(`<@!${user.user.id}> | ${user.displayName||user.username||"None"}`).setFooter({text: `ID: ${user.id}`}).setTimestamp().setColor("OBTAINED")
            .addFields(
                {
                    name: "Old", value: `${user.nickname}`
                },
                {
                    name: "New", value: `${data.nickname.name}`
                },
                {
                    name: "Status", value: "Waiting Approval"
                }
            )
            .setFooter(`ID: ${user.user.id} `)
            .setTimestamp()

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
        }else{
            let buttons = {
                "youtube": new ButtonBuilder().setLabel("YouTube").setStyle(2).setCustomId('pending-youtube'),
                "twitch": new ButtonBuilder().setLabel("Twitch").setStyle(2).setCustomId('pending-twitch'),
                "tiktok": new ButtonBuilder().setLabel("TikTok").setStyle(2).setCustomId('pending-tiktok')
            }

            let application = new p.embed().setTitle("Self Promotion Application").setDescription(`<@!${user.user.id}> | ${user.displayName||user.username||"None"}`).setFooter({text: `ID: ${user.id}`}).setTimestamp().setColor("OBTAINED")

            let msg = data.promotion.youtube?.status == "Waiting Approval" ? data.promotion.youtube._id : data.promotion.twitch?.status == "Waiting Approval" ? data.promotion.twitch._id : data.promotion.tiktok?.status == "Waiting Approval" ? data.promotion.tiktok._id : "Sending"

            if(data.promotion.youtube?.status == "Waiting Approval" || data.promotion.twitch?.status == "Waiting Approval" || data.promotion.tiktok?.status == "Waiting Approval"){
                try{
                    msg = await apply.messages.fetch(msg)
                }catch(err){
                    msg = null
                }
            }

            if(!msg||msg=="Sending"){
                data.promotion[p.command].status = "Waiting Approval"

                application.addFields(
                    {
                        name: `${p.command[0].toUpperCase()+p.command.substr(1,p.command.length)}`, value: `${data.promotion[p.command].link}`, inline: true
                    },
                    {
                        name:'', value: `${p.zws}`, inline: true
                    },
                    {
                        name: "Status", value: `${data.promotion[p.command].status}`, inline: true
                    }
                )
                apply.send({embeds: [application], components: [new ActionRowBuilder().setComponents(buttons[p.command])]}).then( async m => {
                    data.promotion[p.command]._id = m.id
                    data.promotion[p.command].confirmed = true
                    await data.save()
                })
            }else{
                data.promotion[p.command].status = "Waiting Approval"
                
                application = msg.embeds[0]

                let field = application.fields.indexOf(application.fields.filter((field => field.name.toLowerCase()==p.command))[0])

                if(field<0){
                    application.fields.push(
                        {
                            name: `${p.command[0].toUpperCase()+p.command.substr(1,p.command.length)}`, value: `${data.promotion[p.command].link}`, inline: true
                        },
                        {
                            name:'', value: `${p.zws}`, inline: true
                        },
                        {
                            name: "Status", value: `${data.promotion[p.command].status}`, inline: true
                        }
                    )
                    msg.components[0].components.push(buttons[p.command])
                }else{
                    application.fields[field].value = `${data.promotion[p.command].link}`
                    application.fields[field+2].value = `${data.promotion[p.command].status}`
                }
                
                let actionRow = msg.components[0]

                msg.edit({embeds: [application], components: [actionRow]}).then( async m => {
                    data.promotion[p.command]._id = m.id
                    data.promotion[p.command].confirmed = true
                    await data.save()
                })
            }
        }

        if(p.interaction.replied) p.interaction.editReply({embeds: [confirmed], components: [], ephemeral: true})
        else p.interaction.reply({embeds: [confirmed], ephemeral: true})
    }
})