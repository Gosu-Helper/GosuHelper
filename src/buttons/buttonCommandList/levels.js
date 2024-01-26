const ButtonInterface = require('../buttonInterface')
const scholar = require('../levelButtonComponent/scholar')
const lvl5 = ['worker', 'noble']
const lvl15 = ['farmer', 'peddler', 'soldier', 'scholar']
const lvl30 = ['head-farmer', 'head-merchant', 'colonel', 'head-scholar']
const lvl50 = ['landowner', 'business-owner', 'commander', 'philosopher']

module.exports = new ButtonInterface({
    alias: ['worker', 'noble', 'farmer', 'peddler', 'soldier', 'scholar', 'head-farmer', 'head-merchant', 'colonel', 'head-scholar', 'landowner', 'business-owner', 'commander', 'philosopher'],
    permisions: ['MANAGE_ROLES'],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let embed = new p.embed()
        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild

        let user = await p.fetchUser(p.interaction.user.id)

        if(lvl5.includes(p.interaction.customId)) await level5(p, Target, user, embed)
        else if(lvl15.includes(p.interaction.customId)) await level15(p, Target, user, embed)
        else if(lvl30.includes(p.interaction.customId)) await level30(p, Target, user, embed)
        else if(lvl50.includes(p.interaction.customId)) await level50(p, Target, user, embed)
        else console.log("Invalid Level")
    }
})

async function level5(p, Target, user, embed){
    if(await check(p, "497843968151781378", Target, user)){
        let worker = await p.fetchRole("497912748357713962")
        let noble = await p.fetchRole("497910079849496588")
        if(user.roles.cache.has("497910079849496588") && p.interaction.customId == "worker"){
            let nobleRoles = ["497910079849496588", "497497794622390272", "497579388917776404", "497590234435813377", "497582147511517204", "497593990498222080", "497594302818418689"]
            nobleRoles.forEach(async (role) => {
                role = await check(p, role, Target, user, true)
                if(role) user.roles.remove(role)
            })
            user.roles.add(worker)
            embed.setDescription("Removed all the roles pertaining to the Noble class. \nWelcome to the Worker class!").setColor("SUCCESS")
            p.interaction.reply({embeds: [embed], ephemeral: true})
        }
        else if(user.roles.cache.has("497912748357713962") && p.interaction.customId == "noble"){
            let workerRoles = ["497912748357713962", "497491973742133258", "497491650159968259", "497580312486871040", "497582122924507166", "497591253144436736", "497582173612670976"]
            workerRoles.forEach(async (role) => {
                role = await check(p, role, Target, user, true)
                if(role) user.roles.remove(role)
            })
            user.roles.add(noble)
            embed.setDescription("Removed all the roles pertaining to the Worker class. \nWelcome to the Noble class!").setColor("SUCCESS")
            p.interaction.reply({embeds: [embed], ephemeral: true})
        }
        else if(p.interaction.customId == "worker" && !user.roles.cache.has(worker.id)){
            user.roles.add(worker)
            p.interaction.reply({embeds: [embed.setDescription("Welcome to the Worker class!").setColor("SUCCESS")], ephemeral: true})
        } else if(p.interaction.customId == "noble" && !user.roles.cache.has(noble.id)){
            user.roles.add(noble)
            p.interaction.reply({embeds: [embed.setDescription("Welcome to the Noble class!").setColor("SUCCESS")], ephemeral: true})
        } else {
            let role = user.roles.cache.has("497912748357713962") ? "Worker" : user.roles.cache.has("497910079849496588") ? "Noble" : "???"
            p.interaction.reply({embeds: [embed.setDescription(`You are already in the ${role} class!`).setColor("ERROR")], ephemeral: true})
        }
    } else return p.interaction.reply({content: "Requires Level 5 role. Chat more to gain experience!", ephemeral: true})
}

async function level15(p, Target, user, embed){
    if(await check(p, "497491254838427674", Target, user)){
        let worker = await p.fetchRole("497912748357713962")
        let noble = await p.fetchRole("497910079849496588")
        let farmer = await p.fetchRole("497491973742133258")
        let peddler = await p.fetchRole("497491650159968259")
        let soldier = await p.fetchRole("497497794622390272")
        let scholar = await p.fetchRole("497579388917776404")
        let farmerClass = ["497580312486871040", "497591253144436736"]
        let merchantClass = ["497582122924507166", "497582173612670976"]
        let soldierClass = ["497590234435813377", "497593990498222080"]
        let scholarClass = ["497582147511517204", "497594302818418689"]
        let farmerFilter = farmerClass.filter((job) => user.roles.cache.has(job))
        let merchantFilter = merchantClass.filter((job) => user.roles.cache.has(job))
        let soldierFilter = soldierClass.filter((job) => user.roles.cache.has(job))
        let scholarFilter = scholarClass.filter((job) => user.roles.cache.has(job))

        if(['farmer', 'peddler'].includes(p.interaction.customId)){
            if(user.roles.cache.has(noble.id)) return p.interaction.reply({embeds: [embed.setDescription("Please become part of the Worker class first!").setColor("ERROR")], ephemeral: true})
            else{
                if(p.interaction.customId == 'farmer'){
                    if(farmerFilter.length > 0) embed.setDescription(`To retire from being a Farmer, please quit your ${(await p.fetchRole(farmerFilter[farmerFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(merchantFilter.length > 0) embed.setDescription(`To become a Farmer, you need to quit your ${(await p.fetchRole(merchantFilter[merchantFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(user.roles.cache.has(farmer.id)){
                        user.roles.remove(farmer)
                        embed.setDescription("You quit your job as a Farmer.").setColor("SUCCESS")
                    }else {
                        [peddler.id].forEach(async (peddler) => {
                            peddler = await check(p, peddler, Target, user, true)
                            if(peddler) user.roles.remove(peddler)
                        })
                        user.roles.add(farmer)
                        embed.setDescription("Congratulations you got hired as a Farmer!").setColor("SUCCESS")
                    }
                }else if(p.interaction.customId == 'peddler'){
                    if(merchantFilter.length > 0) embed.setDescription(`To retire from being a Peddler, please quit your ${(await p.fetchRole(merchantFilter[merchantFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(farmerFilter.length > 0) embed.setDescription(`To become a Peddler, you need to quit your ${(await p.fetchRole(farmerFilter[farmerFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(user.roles.cache.has(peddler.id)){
                        user.roles.remove(peddler)
                        embed.setDescription("You quit your job as a Peddler.").setColor("SUCCESS")
                    }else {
                        [farmer.id].forEach(async (farmer) => {
                            farmer = await check(p, farmer, Target, user, true)
                            if(farmer) user.roles.remove(farmer)
                        })
                        user.roles.add(peddler)
                        embed.setDescription("Congratulations you got hired as a Peddler!").setColor("SUCCESS")
                    }
                }
            }
        } else if(['soldier', 'scholar'].includes(p.interaction.customId)){
            if(user.roles.cache.has(worker.id)) return p.interaction.reply({embeds: [embed.setDescription("Please become part of the Noble class first!").setColor("ERROR")], ephemeral: true})
            else{
                if(p.interaction.customId == 'soldier'){
                    if(soldierFilter.length > 0) embed.setDescription(`To retire from being a Soldier, please quit your ${(await p.fetchRole(soldierFilter[soldierFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(scholarFilter.length > 0) embed.setDescription(`To become a Soldier, you need to quit your ${(await p.fetchRole(scholarFilter[scholarFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(user.roles.cache.has(soldier.id)){
                        user.roles.remove(soldier)
                        embed.setDescription("You quit your job as a Soldier.").setColor("SUCCESS")
                    }else {
                        [scholar.id].forEach(async (scholar) => {
                            scholar = await check(p, scholar, Target, user, true)
                            if(scholar) user.roles.remove(scholar)
                        })
                        user.roles.add(soldier)
                        embed.setDescription("Congratulations you got hired as a Soldier!").setColor("SUCCESS")
                    }
                }else if(p.interaction.customId == 'scholar'){
                    if(scholarFilter.length > 0) embed.setDescription(`To retire from being a Scholar, please quit your ${(await p.fetchRole(scholarFilter[scholarFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(soldierFilter.length > 0) embed.setDescription(`To become a Scholar, you need to quit your ${(await p.fetchRole(soldierFilter[soldierFilter.length - 1])).name} job first!`).setColor("ERROR")
                    else if(user.roles.cache.has(scholar.id)){
                        user.roles.remove(scholar)
                        embed.setDescription("You quit your job as a Scholar.").setColor("SUCCESS")
                    }else {
                        [soldier.id].forEach(async (soldier) => {
                            soldier = await check(p, soldier, Target, user, true)
                            if(soldier) user.roles.remove(soldier)
                        })
                        user.roles.add(scholar)
                        embed.setDescription("Congratulations you got hired as a Scholar!").setColor("SUCCESS")
                    }
                }
            }
        } else p.interaction.reply({content: "I couldn't find that job!", ephemeral: true})
        return p.interaction.reply({embeds: [embed], ephemeral: true})
    } else return p.interaction.reply({content: "Requires Level 15 role. Chat more to gain experience!", ephemeral: true})
}

async function level30(p, Target, user, embed){
    if(await check(p, "497578834376392724", Target, user)){
        let worker = await p.fetchRole("497912748357713962")
        let noble = await p.fetchRole("497910079849496588")
        let farmer = await p.fetchRole("497491973742133258")
        let peddler = await p.fetchRole("497491650159968259")
        let soldier = await p.fetchRole("497497794622390272")
        let scholar = await p.fetchRole("497579388917776404")
        let headFarmer = await p.fetchRole("497580312486871040")
        let headMerchant = await p.fetchRole("497582122924507166")
        let colonel = await p.fetchRole("497590234435813377")
        let headScholar = await p.fetchRole("497582147511517204")
        let landowner = await p.fetchRole("497591253144436736")
        let businessOwner = await p.fetchRole("497582173612670976")
        let commander = await p.fetchRole("497593990498222080")
        let philosopher = await p.fetchRole("497594302818418689")
        if(['head-farmer', 'head-merchant'].includes(p.interaction.customId)){
            if(user.roles.cache.has(noble.id)) embed.setDescription(`To become a ${p.interaction.customId=='head-farmer' ? 'Head Farmer' : 'Head Merchant'}` + `${user.roles.cache.has(commander.id) ? ', please quit your Commander job first ' : user.roles.cache.has(philosopher.id) ? ', please quit your Philosopher job first ' : `${p.interaction.customId=='head-farmer'?', please become a Farmer first ':', please become a Peddler '}`}` + "and be part of the Worker class!").setColor("ERROR")
            else if(p.interaction.customId=='head-farmer'){
                if(user.roles.cache.has(landowner.id) && user.roles.cache.has(headFarmer.id)) embed.setDescription("To retire from being a Head Farmer, please quit your Landowner job first!").setColor("ERROR")
                else if(user.roles.cache.has(businessOwner.id) && user.roles.cache.has(headFarmer.id)) embed.setDescription("To become a Head Farmer, please quit your Business Owner job first!").setColor("ERROR")
                else if(user.roles.cache.has(headFarmer.id)){
                    user.roles.remove(headFarmer)
                    embed.setDescription("You quit your job as a Head Farmer").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(farmer.id)){
                        user.roles.add(headFarmer)
                        embed.setDescription("Congratulations you got hired as a Head Farmer!").setColor("SUCCESS")
                    }else embed.setDescription("You need to be hired as a Farmer first.").setColor("ERROR")
                }
            }else if(p.interaction.customId=='head-merchant'){
                if(user.roles.cache.has(businessOwner.id) && user.roles.cache.has(headMerchant.id)) embed.setDescription("To retire from being a Head Merchant, please quit your Business Owner job first!").setColor("ERROR")
                else if(user.roles.cache.has(landowner.id) && user.roles.cache.has(headMerchant.id)) embed.setDescription("To become a Head Merchant, please quit your Landowner job first!").setColor("ERROR")
                else if(user.roles.cache.has(headMerchant.id)){
                    user.roles.remove(headMerchant)
                    embed.setDescription("You quit your job as a Head Merchant").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(peddler.id)){
                        user.roles.add(headMerchant)
                        embed.setDescription("Congratulations you got hired as a Head Merchant!").setColor("SUCCESS")
                    } else embed.setDescription("You need to be hired as a Peddler first.").setColor("ERROR")
                }
            }else embed.setDescription("Couldn't find that job!").setColor("ERROR")
        } else if(['colonel', 'head-scholar'].includes(p.interaction.customId)){
            if(user.roles.cache.has(worker.id)) embed.setDescription(`To become a ${p.interaction.customId=='colonel' ? 'Colonel' : 'Head Scholar'}` + `${user.roles.cache.has(landowner.id) ? ', please quit your Landowner job first ' : user.roles.cache.has(businessOwner.id) ? ', please quit your Business Owner job first ' : `${p.interaction.customId=='colonel'?', please become a Soldier first ':', please become a Scholar '}`}` + "and be part of the Noble class!").setColor("ERROR")
            else if(p.interaction.customId=='colonel'){
                if(user.roles.cache.has(commander.id) && user.roles.cache.has(colonel.id)) embed.setDescription("To retire from being a Colonel, please quit your Commander job first!").setColor("ERROR")
                else if(user.roles.cache.has(philosopher.id) && user.roles.cache.has(colonel.id)) embed.setDescription("To become a Colonel, please quit your Philosopher job first!").setColor("ERROR")
                else if(user.roles.cache.has(colonel.id)){
                    user.roles.remove(colonel)
                    embed.setDescription("You quit your job as a Colonel").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(soldier.id)){
                        user.roles.add(colonel)
                        embed.setDescription("Congratulations you got hired as a Colonel!").setColor("SUCCESS")
                    } else embed.setDescription("You need to be hired as a Soldier first.").setColor("ERROR")
                }
            }else if(p.interaction.customId=='head-scholar'){
                if(user.roles.cache.has(philosopher.id) && user.roles.cache.has(philosopher.id)) embed.setDescription("To retire from being a Head Scholar, please quit your Philosopher job first!").setColor("ERROR")
                else if(user.roles.cache.has(commander.id) && user.roles.cache.has(headScholar.id)) embed.setDescription("To become a Head Scholar, please quit your Commander job first!").setColor("ERROR")
                else if(user.roles.cache.has(headScholar.id)){
                    user.roles.remove(headScholar)
                    embed.setDescription("You quit your job as a Head Scholar").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(scholar.id)){
                        user.roles.add(headScholar)
                        embed.setDescription("Congratulations you got hired as a Head Scholar!").setColor("SUCCESS")
                    }else embed.setDescription("You need to be hired as a Scholar first.").setColor("ERROR")
                }
            }else embed.setDescription("Couldn't find that job!").setColor("ERROR")
        }
    } else return p.interaction.reply({content: "Requires Level 30 role. Chat more to gain experience!", ephemeral: true})
    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function level50(p,Target, user, embed){
    if(await check(p, "523184440491638795", Target, user)){
        let worker = await p.fetchRole("497912748357713962")
        let noble = await p.fetchRole("497910079849496588")
        let headFarmer = await p.fetchRole("497580312486871040")
        let headMerchant = await p.fetchRole("497582122924507166")
        let colonel = await p.fetchRole("497590234435813377")
        let headScholar = await p.fetchRole("497582147511517204")
        let landowner = await p.fetchRole("497591253144436736")
        let businessOwner = await p.fetchRole("497582173612670976")
        let commander = await p.fetchRole("497593990498222080")
        let philosopher = await p.fetchRole("497594302818418689")
        if(['landowner', 'business-owner'].includes(p.interaction.customId)){
            if(user.roles.cache.has(noble.id)) embed.setDescription(`To become a ${p.interaction.customId=='landowner' ? 'Landowner' : 'Business Owner'}` + `${p.interaction.customId=='landowner'?', please become a Head Farmer first ':', please become a Head Merchant first '}` + "and be part of the Worker class!").setColor("ERROR")
            else if(p.interaction.customId=='landowner'){
                if(user.roles.cache.has(businessOwner.id)) embed.setDescription("To become a Landowner, please quit your Business Owner job and become a Head Farmer first!").setColor("ERROR")
                else if(user.roles.cache.has(landowner.id)){
                    user.roles.remove(landowner)
                    embed.setDescription("You quit your job as a Landowner.").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(headFarmer.id)){
                        user.roles.add(landowner)
                        embed.setDescription("Congratulations you became a Landowner!").setColor("SUCCESS")
                    }else embed.setDescription("You need to be hired as a Head Farmer first.").setColor("ERROR")
                }
            }
            else if(p.interaction.customId=='business-owner'){
                if(user.roles.cache.has(landowner.id)) embed.setDescription("To become a Business Owner, please quit your Landowner job and become a Head Merchant first!").setColor("ERROR")
                else if(user.roles.cache.has(businessOwner.id)){
                    user.roles.remove(businessOwner)
                    embed.setDescription("You quit your job as a Business Owner.").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(headMerchant.id)){
                        user.roles.add(businessOwner)
                        embed.setDescription("Congratulations you became a Business Owner!").setColor("SUCCESS")
                    }else embed.setDescription("You need to be hired as a Head Merchant first.").setColor("ERROR")
                }
            }
        }else if(['commander', 'philosopher'].includes(p.interaction.customId)){
            if(user.roles.cache.has(worker.id)) embed.setDescription(`To become a ${p.interaction.customId=='commander' ? 'Commander' : 'Philosopher'}` + `${p.interaction.customId=='commander'?', please become a Colonel first ':', please become a Head Scholar first '}` + "and be part of the Noble class!").setColor("ERROR")
            else if(p.interaction.customId=='commander'){
                if(user.roles.cache.has(philosopher.id)) embed.setDescription("To become a Commander, please quit your Philosopher job and become a Colonel first!").setColor("ERROR")
                else if(user.roles.cache.has(commander.id)){
                    user.roles.remove(commander)
                    embed.setDescription("You quit your job as a Commander.").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(colonel.id)){
                        user.roles.add(commander)
                        embed.setDescription("Congratulations you became a Commander!").setColor("SUCCESS")
                    }else embed.setDescription("You need to be hired as a Colonel first.").setColor("ERROR")
                }
            }
            else if(p.interaction.customId=='philosopher'){
                if(user.roles.cache.has(philosopher.id)) embed.setDescription("To become a Philosopher, please quit your Commander job and become a Head Scholar first!").setColor("ERROR")
                else if(user.roles.cache.has(philosopher.id)){
                    user.roles.remove(philosopher)
                    embed.setDescription("You quit your job as a Philosopher.").setColor("SUCCESS")
                }else {
                    if(user.roles.cache.has(headScholar.id)){
                        user.roles.add(philosopher)
                        embed.setDescription("Congratulations you became a Philosopher!").setColor("SUCCESS")
                    }else embed.setDescription("You need to be hired as a Head Scholar first.").setColor("ERROR")
                }
            }
        }
    } else return p.interaction.reply({content: "Requires Level 50 role. Chat more to gain experience!", ephemeral: true})
    return p.interaction.reply({embeds: [embed], ephemeral: true})
}

async function check(p, id, Target, user, remove=false){

    let role = await p.fetchRole(id)

    if(Target.roles.highest.position < role.position && !remove) return p.interaction.reply({ content: "Unable to give verify you.", ephemeral: true })
    else if(remove){
        if(Target.roles.highest.position < role.position) return false
        else{
            if(user.roles.cache.has(id)) return role
            else return false
        }
    }

    if(user.roles.cache.has(role.id)) return true
    else return false
}