const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['elite', 'na', 'eu', 'asia', 'server-ping', 'giveaway-pings', 'subscriber', 'ml-updates-ping'],
    permisions: [],
    permLevel: 'User',
    group: ['Colors'],
    cd: 3500,
    execute: async function(p){
        let embed = new p.embed()
        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild
        let user = await p.fetchUser(p.interaction.user.id)
        let elite = await p.fetchRole("659628122756349982")

        if(p.interaction.customId == 'elite'){
            if(user.roles.cache.has("820334912690192435")){
                if(await check(p, elite.id, Target)){
                    if(user.roles.cache.has(elite.id)){
                        user.roles.remove(elite)
                        embed.setDescription(`Removed the <@&${elite.id}> role.`).setColor("SUCCESS")
                    } else {
                        user.roles.add(elite.id)
                        embed.setDescription(`Gave you the <@&${elite.id}> role!`).setColor("SUCCESS")
                    }
                }
                else return p.interaction.reply({embeds: [embed.setDescription(`Unable to give you the <@&${elite.id}> role.`).setColor("ERROR")], ephemeral: true})
            }
            else return p.interaction.reply({embeds: [embed.setDescription(`Unable to give you the <@&${elite.id}> role.`).setColor("ERROR")], ephemeral: true})
        } else if(['na', 'eu', 'asia'].includes(p.interaction.customId)){
            let regions = {
                na: await p.fetchRole("851237222090932235"),
                eu: await p.fetchRole("851237285697159178"),
                asia: await p.fetchRole("851237339610742824")
            }

            if(await check(p, regions[p.interaction.customId].id, Target)){
                if(user.roles.cache.has(regions[p.interaction.customId].id)){
                    user.roles.remove(regions[p.interaction.customId])
                    embed.setDescription(`Removed the <@&${regions[p.interaction.customId].id}> role.`).setColor("SUCCESS")
                } else {
                    for(let region in regions){
                        if(await check(p, regions[region].id, Target)) user.roles.remove(regions[region])
                    }
                    user.roles.add(regions[p.interaction.customId].id)
                    embed.setDescription(`Gave you the <@&${regions[p.interaction.customId].id}> role!`).setColor("SUCCESS")
                }
            } else return p.interaction.reply({embeds: [embed.setDescription(`Unable to give you the <@&${regions[p.interaction.customId].id}> role.`).setColor("ERROR")], ephemeral: true})
        } else if(['server-ping', 'giveaway-pings', 'subscriber', 'ml-updates-ping'].includes(p.interaction.customId)){
            let server = {
                "server-ping": await p.fetchRole("851248038207029300"),
                "giveaway-pings": await p.fetchRole("706932223181324340"),
                "subscriber": await p.fetchRole("497654614729031681"),
                "ml-updates-ping": await p.fetchRole("1073686758052614204")
            }

            if(await check(p, server[p.interaction.customId].id, Target)){
                if(user.roles.cache.has(server[p.interaction.customId].id)){
                    user.roles.remove(server[p.interaction.customId])
                    embed.setDescription(`Removed the <@&${server[p.interaction.customId].id}> role.`).setColor("SUCCESS")
                } else {
                    user.roles.add(server[p.interaction.customId].id)
                    embed.setDescription(`Gave you the <@&${server[p.interaction.customId].id}> role!`).setColor("SUCCESS")
                }
            } else return p.interaction.reply({embeds: [embed.setDescription(`Unable to give you the <@&${server[p.interaction.customId].id}> role.`).setColor("ERROR")], ephemeral: true})
        }
        return p.interaction.reply({embeds: [embed], ephemeral: true})
    }
})


async function check(p, id, Target){

    let role = await p.fetchRole(id)

    if(Target.roles.highest.position < role.position) return false
    else return true

}