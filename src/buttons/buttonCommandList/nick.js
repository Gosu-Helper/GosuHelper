const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['nick'],
    permissions: [],
    permLevel: 'User',
    cd: 0,//120000,
    group: [],
    execute: async function(p){
        let Target = await p.fetchUser(p.client.user.id)
        
        let user = await p.fetchUser(p.interaction.user.id)
        
        let apply = await p.fetchChannel("717770672125902860")

        let role = await p.fetchRole("717765731139452988")
        
        let error = new p.embed().setDescription(`Uh oh it seems like I am unable to assign the <@&${role.id}> to you.`).setColor("ERROR")
        let deleted = new p.embed().setDescription("Your application for nickname change has been deleted. You may continue to reapply.").setColor("ERROR")
        let instructions = new p.embed().setDescription("**You will have 1 minute to type in your nickname. Please type what you want your new nickname to be. \n__It can only be 32 characters long.__ \n\nFor example:**  John Doe").setColor("OBTAIN")
        let timeUp = new p.embed().setDescription("I did not receive a nickname. Please try again in 1-2 minutes.").setColor("ERROR")
        let nickname = new p.embed().setColor("OBTAINED")
        
        if(Target.roles.highest.position < role.position){
            p.interaction.reply({embeds: [error]})
            return end(p, user, role)
        }

        if(user.roles.cache.has(role.id)) return
        
        user.roles.add(role)

        let data = await p.mongo.queryOne("application", p.interaction.user.id)
        
        if(data){
            let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
            let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
            let actionRow = new ActionRowBuilder().setComponents([confirm, deny])
            
            nickname.setDescription("It seems like we have received your application already. Would you like to change it?")
            .addFields(
                {
                    name: "Old", value: `${user.nickname??"None"}`
                },
                {
                    name: "New", value: `${data.nickname.name}`
                }
            )
            if(!data.nickname.confirmed){
                nickname.setDescription("It seems like we have received your application already but not confirmed.\nPlease press `Confirm` to confirm this is correct. If not please press `Deny`.")
                end(p, user, role, 99)
                return p.interaction.reply({embeds: [nickname], components: [actionRow], ephemeral: true})
            }

            p.interaction.reply({embeds: [nickname], ephemeral: true})

            if(!(await proceed(p, apply, data))&&data.nickname.confirmed){
                deleted.setDescription("Your current application has not been deleted.").setColor("ERROR")
                end(p, user, role, 99)
                return p.interaction.editReply({embeds: [deleted], ephemeral: true})
            }

            try{
                const seconds = 10
                const filter = (m) => m.author.id == p.interaction.user.id
    
                p.interaction.editReply({ embeds: [instructions], fetchReply: true, ephemeral: true }).then(() => {
                    p.interaction.channel.awaitMessages({ filter, max: 1, time: seconds*1000, errors: ['time'] }).then(async collected => {
                        data.nickname.name = `${collected.first().content.substring(0, 32)}`
                        await data.save()
                        
                        nickname.fields[1].value = `${data.nickname.name}`
                        nickname.setDescription("Please press `Confirm` to confirm this is correct. If not please press `Deny`.")
                        p.interaction.followUp({embeds: [nickname], components: [actionRow], ephemeral: true})
                        
                        return end(p, user, role, 99)
                    }).catch(collected => {
                        p.interaction.followUp({embeds: [timeUp], ephemeral: true});
                        end(p, user, role, 99)
                    });
                });
            }catch(err){
                end(p, user, role, 99)
                return p.interaction.editReply("Seems like I couldn't proccess your application.")
            }
        }else{
            data = await p.mongo.queryOne("application", p.interaction.user.id, { _id: p.interaction.user.id, nickname: { _id: p.interaction.user.id, name: `${user.username??user.displayName??p.interaction.user.username??"None"}`, confirmed: false } })
            try{
                const seconds = 10
                const filter = (m) => m.author.id == p.interaction.user.id
                
                p.interaction.reply({ embeds: [instructions], fetchReply: true, ephemeral: true }).then(() => {
                    p.interaction.channel.awaitMessages({ filter, max: 1, time: seconds*1000, errors: ['time'] }).then(async collected => {
                        let confirm = new ButtonBuilder().setLabel("Confirm").setStyle(3).setCustomId('confirm')
                        let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('deny')
                        let actionRow = new ActionRowBuilder().setComponents([confirm, deny])
                        
                        nickname.setDescription("Please press `Confirm` to confirm this is correct. If not please press `Deny`.")
                        .addFields(
                            {
                                name: "Old", value: `${user.nickname??"None"}`
                            },
                            {
                                name: "New", value: `${collected.first().content.substring(0,32)}`
                            }
                        )
                        
                        data.nickname.name = `${collected.first().content.substring(0,32)}`
                        await data.save()
    
                        p.interaction.followUp({embeds: [nickname], components: [actionRow], ephemeral: true})
                        return end(p, user, role, 99)
                    }).catch(collected => {
                        p.interaction.followUp({embeds: [timeUp], ephemeral: true});
                        end(p, user, role, 99)
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

function proceed(p, apply, data){
    return new Promise(async (resolve) => {
            try{
                const collectorFilter = (m) => m.author.id == p.interaction.user.id
            
                const collector = p.interaction.channel.createMessageCollector({filter: collectorFilter, max: 1, time: 10000})
            
                collector.on('end', collected => {
                    if(collected.first()?.content?.toLowerCase() == 'yes' || collected.first()?.content?.toLowerCase() == 'y' || collected.first()?.content?.toLowerCase() == 'confirm' || collected.first()?.content?.toLowerCase() == 'confirmed'){
                        data.nickname.confirmed = false
                        apply.messages.fetch(data.nickname._id).then(fetched => {
                            fetched.delete()
                        }).catch(err => {
                            return
                        })
                        resolve(1)
                    }else resolve(0);
                })
                setTimeout(()=>{
                    resolve(0)
                }, 11000)
            }catch(err){
                console.log(err)
            }
        }
    )
}