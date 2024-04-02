const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonInterface = require('../buttonInterface')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const {ComponentType} = require('discord.js')

module.exports = new ButtonInterface({
    alias: ['youtube'],
    permissions: [],
    permLevel: 'User',
    cd: 15000,
    group: [],
    execute: async function(p){
        let Target = await p.fetchUser(p.client.user.id)

        let user = await p.fetchUser(p.interaction.user.id)

        let role = await p.fetchRole("717765731139452988")

        let error = new p.embed().setDescription(`Uh oh it seems like I am unable to assign the <@&${role.id}> to you.`).setColor("ERROR")
        let notConfirmed = new p.embed().setDescription("Your current application was not confirmed and was not sent.").setColor("ERROR")
        let notResended = new p.embed().setDescription("Your new application was not confirmed and was not sent.").setColor("ERROR")
        let instructions = new p.embed().setTitle("Try Not To Delete This Message").setDescription("**Please select the platform that you are promoting yourself on and provide a link to your channel/profile.** \n\nExamples of valid YouTube links: \nhttps://youtube.com/TeamGosu\nhttps://youtube.com/@TeamGosu\nhttps://www.youtube.com/TeamGosu\nhttps://www.youtube.com/@TeamGosu\n__Only links are accepted no files.__ \n\nType `exit` or `quit` or `q` to quit the current application for YouTube.").setColor("OBTAIN")
        let inProgress = new p.embed().setDescription("You currently have an application in progress. Please finish your current application or wait for it to time out before continuing a new one.").setColor("ERROR")
        let timeUp = new p.embed().setDescription("To continue filling out your application, click promotion button after cooldown to continue.").setColor("ERROR")
        let empty = new p.embed().setDescription("No valid link was received.").setColor("ERROR")
        let exited = new p.embed().setDescription("You exited the application for YouTube.").setColor("SUCCESS")
        let application = new p.embed().setColor("OBTAIN")
                
        let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
        let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
        let actionRow = new ActionRowBuilder().setComponents(confirm, deny)

        if(!user.roles.cache.has(role.id)){
            return p.interaction.update({embeds: [timeUp], components: [], ephemeral: true})
        }

        if(Target.roles.highest.position < role.position){
            p.interaction.reply({embeds: [error]})
            return clear(p, 99)
        }

        let data = await p.mongo.queryOne("application", p.interaction.user.id)

        if(data?.promotion?.youtube?.status == "In Progress"||data?.promotion?.twitch?.status == "In Progress"||data?.promotion?.tiktok?.status == "In Progress") return p.interaction.reply({embeds: [inProgress], ephemeral:true})

        if(data?.promotion?.youtube){            
            if(!data.promotion.youtube.confirmed){
                data.promotion.youtube.status = "In Progress"
                await data.save()

                let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
                let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
                let actionRow = new ActionRowBuilder().setComponents(confirm, deny)

                application.setDescription("It seems like we have received your application already but not confirmed.\nPlease press `Confirm` to confirm this is correct. If not please press `Deny`.")
                .addFields(
                    {
                        name: "Link", value: `${data.promotion.youtube.link||"None"}`
                    },
                    {
                        name: "Status", value: `${data.promotion.youtube.status||"None"}`
                    }
                )
                .setColor("OBTAINED")

                let reply = await p.interaction.reply({embeds: [application], components: [actionRow], fetchReply: true, ephemeral: true})

                let proceed = await toProceed(reply)

                clear(p, 99)

                data.promotion.youtube.status = "Sending"
                await data.save()

                if(!proceed||proceed == 2) return p.interaction.editReply({embeds: [notConfirmed], components: [], ephemeral: true})
                else if(proceed == 1) return p.commands["confirmed"].execute(p)
            }else if(data.promotion.youtube.confirmed){
                let confirm = new ButtonBuilder().setLabel("Yes").setStyle(3).setCustomId('confirm')
                let deny = new ButtonBuilder().setLabel("No").setStyle(4).setCustomId('deny')
                let actionRow = new ActionRowBuilder().setComponents(confirm, deny)

                if(data.promotion.youtube.status == "Waiting Approval"){
                    application.setDescription("It seems like we have received your application already and is waiting approval. Would you like to change it? \nPress `Yes` to change the application, or press `No` to not change.")
                    .addFields(
                        {
                            name: "Link", value: `${data.promotion.youtube.link||"None"}`
                        },
                        {
                            name: "Status", value: `${data.promotion.youtube.status||"None"}`
                        }
                    ).setColor("OBTAINED")
                }else if(data.promotion.youtube.status == "Approved"){
                    application.setDescription("It seems like we have received your application already and is already approved. Would you like to reapply for a new application? \nPress `Yes` to reapply for a new application, or press `No` to not reapply.")
                    .addFields(
                        {
                            name: "Link", value: `${data.promotion.youtube.link||"None"}`
                        },
                        {
                            name: "Status", value: `${data.promotion.youtube.status||"None"}`
                        }
                    ).setColor("OBTAINED")
                }

                data.promotion.youtube.status = data.promotion.youtube.status == "Approved" ? "Approved" : "In Progress"
                await data.save()

                let reply = await p.interaction.reply({embeds: [application], components: [actionRow], fetchReply: true, ephemeral: true})

                let proceed = await toProceed(reply)
                if(!proceed||proceed == 2){
                    data.promotion.youtube.status = data.promotion.youtube.status == "Approved" ? "Approved" : "Waiting Approval"
                    await data.save()
                    clear(p, 99)
                    return p.interaction.editReply({embeds: [exited], components: [], ephemeral: true})
                }
            }

            try{
                p.interaction.editReply({ embeds: [instructions], components: [], fetchReply: true, ephemeral: true })
                let link = await collectLink(p)
                
                clear(p, 99)

                if(link===null||link==0){
                    data.promotion.youtube.status = data.promotion.youtube.status == "Approved" ? "Approved" : "Waiting Approval"
                    await data.save()
                    if(link===null) return p.interaction.editReply({embeds: [empty], ephemeral: true})
                    else if(link==0) return p.interaction.editReply({embeds: [exited], ephemeral: true})
                }

                application.setDescription("Please press `Confirm` to confirm this is correct. If not please press `Deny`.")
                application.setColor("OBTAINED")
                application.fields[0].value = `${link}`
                application.fields[1].value = `Unconfirmed`

                let reply = await p.interaction.editReply({embeds: [application], components: [actionRow], ephemeral: true})

                let proceed = await toProceed(reply)
                
                clear(p, 99)

                data.promotion.youtube.status = data.promotion.youtube.status == "Approved" ? "Approved" : "Waiting Approval"
                await data.save()
                
                if(!proceed||proceed == 2) return p.interaction.editReply({embeds: [notResended], components: [], ephemeral: true})
                else if(proceed == 1){
                    data.promotion.youtube.link = link
                    await data.save()
                    return p.commands["confirmed"].execute(p)
                }
            }catch(err){
                data.promotion.youtube.status = data.promotion.youtube.status == "Approved" ? "Approved" : "Waiting Approval"
                await data.save()
                console.log(err)
                clear(p, 99)
                return p.interaction.editReply("Seems like I couldn't proccess your application.")
            }
        }else{
            data = await p.mongo.queryOne("application", p.interaction.user.id, { _id: p.interaction.user.id, promotion: { _id: p.interaction.user.id, youtube: { link: "", status: "In Progress", confirmed: false } } })
            try{
                if(!data?.promotion) data.promotion = { youtube: { link: "", status: "In Progress", confirmed: false } }
                else if(!data.promotion.youtube) data.promotion.youtube = { link: "", status: "In Progress", confirmed: false }

                await data.save()

                p.interaction.reply({ embeds: [instructions], fetchReply: true, ephemeral: true })
                let link = await collectLink(p)

                clear(p, 99)

                if(link===null){
                    await deleteApplication(p, data)

                    clear(p, 99)

                    return p.interaction.editReply({embeds: [empty], ephemeral: true})
                }
                else if(link==0){
                    await deleteApplication(p, data)

                    clear(p, 99)

                    return p.interaction.editReply({embeds: [exited], ephemeral: true})
                }

                data.promotion.youtube.link = link
                data.promotion.youtube.status = "Unconfirmed"

                application.setDescription("Please press `Confirm` to confirm this is correct. If not please press `Deny`.")
                .addFields(
                    {
                        name: "Link", value: `${data.promotion.youtube.link}`
                    },
                    {
                        name: "Status", value: `${data.promotion.youtube.status}`
                    }
                )
                .setColor("OBTAINED")

                let reply = await p.interaction.editReply({embeds: [application], components: [actionRow], ephemeral: true})

                let proceed = await toProceed(reply)    

                clear(p, 99)

                if(!proceed){
                    await deleteApplication(p, data)
                    return p.interaction.editReply({embeds: [notConfirmed], components: [], ephemeral: true})
                }
                else if(proceed == 1){
                    data.promotion.youtube.status = "Sending"
                    await data.save()
                    return p.commands["confirmed"].execute(p)
                }
                else if(proceed == 2){
                    await deleteApplication(p, data)
                    return p.interaction.editReply({embeds: [notConfirmed], components: [], ephemeral: true})
                }
            }catch(err){
                console.log(err)
                await deleteApplication(p, data)
                clear(p, 99)
                return p.interaction.editReply("Seems like I couldn't proccess your application.")
            }
        }

        clear(p, 99)
    }
})

function clear(p, amount=1){
    //Fetch amount messages and then filter where messages aren't pinned and bulk delete
    p.interaction.channel.messages.fetch({ limit: amount }).then(fetched => {
        if(fetched.size>0){
            const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
            if(notPinned.size) p.interaction.channel.bulkDelete(notPinned, true).catch(err => {return})
        }
    }).catch(err => {return})
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

function collectLink(p){
    return new Promise((resolve) => {
        const seconds = 30
        const filter = (m) => m.author.id == p.interaction.user.id
        const collector = p.interaction.channel.createMessageCollector({ filter, time: seconds*1000, errors: ['time'] })
        collector.on('collect', (collected) => {
                let regexId = /(https?:\/\/)(www\.)?youtube\.com((\/channel|\/user|\/c)\/([\w-]+))/g
                let match = collected.content.match(regexId)

                let regexPrefix = /(https?:\/\/)(www\.)?youtube\.com\/(channel|user|c)/g
                let match2 = collected.content.match(regexPrefix)

                let regexHandler = /(https?:\/\/)(www\.)?youtube\.com\/(@)?([\w-]+)/g
                let match3 = collected.content.match(regexHandler)

                if(match?.length > 0||(!match2?.length>0&&match3?.length>0)){
                    if(match?.length>0) resolve(match[0])
                    else resolve(match3[0])
                }else if(collected.content.toLowerCase() == 'exit' || collected.content.toLowerCase() == 'quit' || collected.content.toLowerCase() == 'q'){
                    resolve(0)
                }
            }
        )
        collector.on('end', collected => {
            resolve(null)
        })
    })
}

async function deleteApplication(p, data){
    let applicationSchema = require('../../../Schema/applicationSchema')

    await data.save()

    if(!data?.promotion?.twitch&&!data?.promotion?.tiktok){
        if(!data.nickname){
            await applicationSchema.deleteOne({_id: p.interaction.user.id})
        }else{
            await applicationSchema.updateOne({_id: p.interaction.user.id}, { $unset: { promotion: {} } })
        }
    }else{
        await applicationSchema.updateOne({_id: p.interaction.user.id}, { $unset: { "promotion.youtube": {} } })
        await data.save()
    }
}