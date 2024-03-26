const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const ButtonInterface = require('../buttonInterface')
const {ComponentType} = require('discord.js')

module.exports = new ButtonInterface({
    alias: ['nick'],
    permissions: [],
    permLevel: 'User',
    cd: 0,//120000,
    group: [],
    execute: async function(p){
        let Target = await p.fetchUser(p.client.user.id)

        let user = await p.fetchUser(p.interaction.user.id)

        let role = await p.fetchRole("717765731139452988")

        let nickRole = await p.fetchRole("874995842111668244")

        let error = new p.embed().setDescription(`Uh oh it seems like I am unable to assign the <@&${role.id}> to you.`).setColor("ERROR")
        let notConfirmed = new p.embed().setDescription("Your current application was not confirmed and was not sent.").setColor("ERROR")
        let notDeleted = new p.embed().setDescription("Your current application has not been deleted.").setColor("ERROR")
        //let deleted = new p.embed().setDescription("Your application for nickname change has been deleted. You may continue to reapply.").setColor("SUCCESS")
        let instructions = new p.embed().setDescription("**You will have 1 minute to type in your nickname. Please type what you want your new nickname to be. \n__It can only be 32 characters long.__ \n\nFor example:**  John Doe").setColor("OBTAIN")
        let timeUp = new p.embed().setDescription("I did not receive a nickname. Please try again in 1-2 minutes.").setColor("ERROR")
        let nickname = new p.embed().setColor("OBTAINED")

        if(Target.roles.highest.position < role.position){
            p.interaction.reply({embeds: [error]})
            return end(p, user, role)
        }

        if(user.roles.cache.has(role.id)) return
        if(user.roles.cache.has(nickRole.id)) return

        user.roles.add(role)

        let data = await p.mongo.queryOne("application", p.interaction.user.id)

        if(data){
            nickname.addFields(
                {
                    name: "Old", value: `${user.nickname||"None"}`
                },
                {
                    name: "New", value: `${data?.nickname?.name||"None"}`
                }
            )

            if(!data.nickname.confirmed){
                let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
                let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
                let actionRow = new ActionRowBuilder().setComponents(confirm, deny)

                nickname.setDescription("It seems like we have received your application already but not confirmed.\nPlease press `Confirm` to confirm this is correct. If not please press `Deny`.")
                let reply = await p.interaction.reply({embeds: [nickname], components: [actionRow], fetchReply: true, ephemeral: true})

                end(p, user, role, 99)

                let proceed = await toProceed(reply)

                if(!proceed) return p.commands["denied"].execute(p)
                else if(proceed == 1) return p.commands["confirmed"].execute(p)
                else if(proceed == 2) return p.interaction.editReply({embeds: [notConfirmed], components: [], ephemeral: true})
                // return p.interaction.reply({embeds: [nickname], components: [actionRow], ephemeral: true})
            }else if(data.nickname.confirmed){
                let confirm = new ButtonBuilder().setLabel("Yes").setStyle(3).setCustomId('confirm')
                let deny = new ButtonBuilder().setLabel("No").setStyle(4).setCustomId('deny')
                let actionRow = new ActionRowBuilder().setComponents(confirm, deny)
                let apply = await p.fetchChannel("717770672125902860")

                nickname.setDescription("It seems like we have received your application already. Would you like to change it? \nPress `Yes` to change the application, or press `No` to not change.")
                let reply = await p.interaction.reply({embeds: [nickname], components: [actionRow], fetchReply: true, ephemeral: true})

                let proceed = await toProceed(reply)
                if(proceed == 1){
                    data.nickname.confirmed = false
                    try{
                        apply.messages.fetch({ limit: 1 }).then(fetched => {
                            const message = fetched.filter((m) => m.id == data.nickname._id)
                            if(message.length) message[0].delete()
                        })
                    }catch(err){
                        console.log(err)
                        end(p, user, role, 99)
                        return p.interaction.editReply({embeds: [notDeleted], components: [], ephemeral: true})
                    }
                }else{
                    end(p, user, role, 99)
                    return p.interaction.editReply({embeds: [notDeleted], components: [], ephemeral: true})
                }
            }
            try{
                const seconds = 60
                const filter = (m) => m.author.id == p.interaction.user.id

                p.interaction.editReply({ embeds: [instructions], components: [], fetchReply: true, ephemeral: true }).then(() => {
                    p.interaction.channel.awaitMessages({ filter, max: 1, time: seconds*1000, errors: ['time'] }).then(async collected => {
                        let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
                        let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
                        let actionRow = new ActionRowBuilder().setComponents([confirm, deny])

                        nickname.setDescription("Please press `Confirm` to confirm this is correct. If not please press `Deny`.")
                        nickname.fields[1].value = `${collected.first().content.substring(0, 32)}`||user.username||user.displayName||p.interaction.user.username||"None"

                        data.nickname.name = `${collected.first().content.substring(0,32)}`||user.username||user.displayName||p.interaction.user.username||"None"
                        await data.save()

                        end(p, user, role, 99)

                        let reply = await p.interaction.editReply({embeds: [nickname], components: [actionRow], ephemeral: true})

                        let proceed = await toProceed(reply)
                        if(!proceed) return p.commands["denied"].execute(p)
                        else if(proceed == 1) return p.commands["confirmed"].execute(p)
                        else if(proceed == 2) return p.interaction.editReply({embeds: [notConfirmed], components: [], ephemeral: true})
                    }).catch(collected => {
                        end(p, user, role, 99)
                        return p.interaction.editReply({embeds: [timeUp], components: [], ephemeral: true});
                    });
                });
            }catch(err){
                end(p, user, role, 99)
                return p.interaction.reply("Seems like I couldn't proccess your application.")
            }
        }else{
            data = await p.mongo.queryOne("application", p.interaction.user.id, { _id: p.interaction.user.id, nickname: { _id: p.interaction.user.id, name: `${user.username||user.displayName||p.interaction.user.username||"None"}`, confirmed: false } })
            try{
                const seconds = 60
                const filter = (m) => m.author.id == p.interaction.user.id

                p.interaction.reply({ embeds: [instructions], fetchReply: true, ephemeral: true }).then(() => {
                    p.interaction.channel.awaitMessages({ filter, max: 1, time: seconds*1000, errors: ['time'] }).then(async collected => {
                        let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
                        let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
                        let actionRow = new ActionRowBuilder().setComponents([confirm, deny])

                        nickname.setDescription("Please press `Confirm` to confirm this is correct. If not please press `Deny`.")
                        .addFields(
                            {
                                name: "Old", value: `${user.nickname||"None"}`
                            },
                            {
                                name: "New", value: `${collected.first().content.substring(0,32)}`||user.username||user.displayName||p.interaction.user.username||"None"
                            }
                        )

                        data.nickname.name = `${collected.first().content.substring(0,32)}`||user.username||user.displayName||p.interaction.user.username||"None"
                        await data.save()

                        end(p, user, role, 99)

                        let reply = await p.interaction.editReply({embeds: [nickname], components: [actionRow], ephemeral: true})

                        let proceed = await toProceed(reply)
                        if(!proceed) return p.commands["denied"].execute(p)
                        else if(proceed == 1) return p.commands["confirmed"].execute(p)
                        else if(proceed == 2) return p.interaction.editReply({embeds: [notConfirmed], components: [], ephemeral: true})
                    }).catch(collected => {
                        end(p, user, role, 99)
                        return p.interaction.editReply({embeds: [timeUp], components: [], ephemeral: true});
                    });
                });
            }catch(err){
                end(p, user, role, 99)
                return p.interaction.reply("Seems like I couldn't proccess your application.")
            }
        }
    }
})

function end(p, user, role, amount=1){
    //Fetch amount messages and then filter where messages aren't pinned and bulk delete
    user.roles.remove(role)
    p.interaction.channel.messages.fetch({ limit: amount }).then(fetched => {
        const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
        if(notPinned.size) p.interaction.channel.bulkDelete(notPinned, true);
    })
}

async function toProceed(reply){
    return new Promise(async (resolve) => {
            try{
                const collector = await reply.createMessageComponentCollector({  ComponentType: ComponentType.Button, max: 1, time: 20000 })

                collector.on('end', async i => {
                    if(i.first()?.customId == 'deny') resolve(0)
                    else if(i.first()?.customId == 'confirm') resolve(1)
                    else if(i.size < 1) resolve(2)
                })
            }catch(e){
                resolve(2)
                console.log(e)
            }
        }
    )
}