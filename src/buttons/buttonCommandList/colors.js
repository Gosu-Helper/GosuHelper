//0*(57,37,41,32,43,56,39,37)->8,7,6,5,4,3,2,1
//0*(57,56,43,41,39,37,37,32)->8,3,4,6,2,(7&1),5
/*
(5,6)->32+41=73
(1,4)->37+43=80
(7,3)->37+56=93
(2,8)->39+56=95
*/
const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['grapefruit', 'carnation', 'peachy', 'green-tea', 'sea-breeze', 'droplet', 'icey-azure', 'candy', 'lilac', 'royal', 'strawberry', 'marigold', 'pumpkin', 'tart', 'leaf', 'sky', 'plum', 'grape', 'blush', 'bubblegum', 'chocolate', 'coffee', 'maltese', 'oreo', 'red', 'orange', 'yellow', 'green', 'blue', 'purple'],
    permisions: [],
    permLevel: 'User',
    group: ['Colors'],
    cd: 3500,
    execute: async function(p){
        let embed = new p.embed()
        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild
        let user = await p.fetchUser(p.interaction.user.id)

        if(['pumpkin', 'tart', 'leaf', 'sky', 'plum', 'grape'].includes(p.interaction.customId)) await color1(p, Target, user, embed)
        else if(['grapefruit', 'carnation', 'peachy', 'royal', 'strawberry', 'marigold'].includes(p.interaction.customId)) await color2(p, Target, user, embed)
        else if(['icey-azure', 'candy', 'lilac', 'blush', 'bubblegum', 'chocolate'].includes(p.interaction.customId)) await color3(p, Target, user, embed)
        else if(['green-tea', 'sea-breeze', 'droplet', 'coffee', 'maltese', 'oreo'].includes(p.interaction.customId)) await color4(p, Target, user, embed)
        else if(['red', 'orange', 'yellow', 'green', 'blue', 'purple'].includes(p.interaction.customId)) await freeColor(p, Target, user, embed)
        else console.log('Invalid Color')
    }
})

async function color1(p, target, user, embed){
    let colors = {
        pumpkin: await p.fetchRole("820025241405227012"),
        tart: await p.fetchRole("820025457914675231"),
        leaf: await p.fetchRole("820025603373400084"),
        sky: await p.fetchRole("820025765608554526"),
        plum: await p.fetchRole("820025901836009474"),
        grape: await p.fetchRole("820026074788134963")
    }

    if(await check(p, "813473502312398918", target, user)){
        if(await check(p, colors[p.interaction.customId].id, target, user, true)){
            if(user.roles.cache.has(colors[p.interaction.customId].id)){
                user.roles.remove(colors[p.interaction.customId])
                embed.setDescription(`Took away the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            } else {
                user.roles.add(colors[p.interaction.customId])
                embed.setDescription(`Gave you the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            }
        } else return p.interaction.reply({embeds: [embed.setDescription("Unable to give you the role").setColor("ERROR")], ephemeral: true})
    } else return p.interaction.reply({content: "Requires Color 1 role!", ephemeral: true})

    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function color2(p, target, user, embed){
    let colors = {
        grapefruit: await p.fetchRole("820021275685552128"),
        carnation: await p.fetchRole("820021548198527042"),
        peachy: await p.fetchRole("820021805359300629"),
        royal: await p.fetchRole("820024024083333131"),
        strawberry: await p.fetchRole("820024750838644746"),
        marigold: await p.fetchRole("820036044475990087")
    }

    if(await check(p, "813473535145934908", target, user)){
        if(await check(p, colors[p.interaction.customId].id, target, user, true)){
            if(user.roles.cache.has(colors[p.interaction.customId].id)){
                user.roles.remove(colors[p.interaction.customId])
                embed.setDescription(`Took away the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            } else {
                user.roles.add(colors[p.interaction.customId])
                embed.setDescription(`Gave you the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            }
        } else return p.interaction.reply({embeds: [embed.setDescription("Unable to give you the role").setColor("ERROR")], ephemeral: true})
    } else return p.interaction.reply({content: "Requires Color 2 role!", ephemeral: true})

    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function color3(p, target, user, embed){
    let colors = {
        "icey-azure": await p.fetchRole("820022963687653417"),
        candy: await p.fetchRole("820023274587029544"),
        lilac: await p.fetchRole("820023727433318431"),
        blush: await p.fetchRole("820026375259684934"),
        bubblegum: await p.fetchRole("820026636455378996"),
        chocolate: await p.fetchRole("820026796748832770")
    }

    if(await check(p, "813473575440220181", target, user)){
        if(await check(p, colors[p.interaction.customId].id, target, user, true)){
            if(user.roles.cache.has(colors[p.interaction.customId].id)){
                user.roles.remove(colors[p.interaction.customId])
                embed.setDescription(`Took away the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            } else {
                user.roles.add(colors[p.interaction.customId])
                embed.setDescription(`Gave you the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            }
        } else return p.interaction.reply({embeds: [embed.setDescription("Unable to give you the role").setColor("ERROR")], ephemeral: true})
    } else return p.interaction.reply({content: "Requires Color 3 role!", ephemeral: true})

    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function color4(p, target, user, embed){
    let colors = {
        "green-tea": await p.fetchRole("820022069974532129"),
        "sea-breeze": await p.fetchRole("820022340594434099"),
        droplet: await p.fetchRole("820022551228710963"),
        coffee: await p.fetchRole("820026984431616051"),
        maltese: await p.fetchRole("820027152912089158"),
        oreo: await p.fetchRole("813767512352358470")
    }

    if(await check(p, "813473599226511360", target, user)){
        if(await check(p, colors[p.interaction.customId].id, target, user, true)){
            if(user.roles.cache.has(colors[p.interaction.customId].id)){
                user.roles.remove(colors[p.interaction.customId])
                embed.setDescription(`Took away the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            } else {
                user.roles.add(colors[p.interaction.customId])
                embed.setDescription(`Gave you the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            }
        } else return p.interaction.reply({embeds: [embed.setDescription("Unable to give you the role").setColor("ERROR")], ephemeral: true})
    } else return p.interaction.reply({content: "Requires Color 4 role!", ephemeral: true})

    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function freeColor(p, target, user, embed){
    let colors = {
        red: await p.fetchRole("820327239467270144"),
        orange: await p.fetchRole("820328618822598657"),
        yellow: await p.fetchRole("820328716571770920"),
        green: await p.fetchRole("820328896820936744"),
        blue: await p.fetchRole("820329131438243911"),
        purple: await p.fetchRole("820329311353176074")
    }

    if(await check(p, "496717793388134410", target, user)){
        if(await check(p, colors[p.interaction.customId].id, target, user, true)){
            if(user.roles.cache.has(colors[p.interaction.customId].id)){
                user.roles.remove(colors[p.interaction.customId])
                embed.setDescription(`Took away the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            } else {
                for(let color in colors){
                    if(await check(p, colors[color].id, target, user)) user.roles.remove(colors[color])
                }
                user.roles.add(colors[p.interaction.customId])
                embed.setDescription(`Gave you the ${colors[p.interaction.customId]} role.`).setColor("SUCCESS")
            }
        } else {
            return p.interaction.reply({embeds: [embed.setDescription("Unable to give you the role").setColor("ERROR")], ephemeral: true})
        }
    } else return p.interaction.reply({content: "Requires the Friend role!", ephemeral: true})

    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function check(p, id, Target, user, remove=false){

    let role = await p.fetchRole(id)

    if(Target.roles.highest.position < role.position && !remove) return false
    else if(remove){
        if(Target.roles.highest.position < role.position) return false
        else return true
    }

    if(user.roles.cache.has(role.id)) return true
    else return false
}