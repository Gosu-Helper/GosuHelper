module.exports = class Level{
    constructor(p, msg){
        this.p = p
        this.msg = msg
        this.user = msg?.author || p?.msg?.author
    }

    async currentUserLevel(p, user){
        let data = await p.mongo.queryOne("level", `${user.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: user.id, level: 0, exp: 0, lastSent: 0/*msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp*/})
        return data.level
    }

    async currentUserExp(p, user){
        let data = await p.mongo.queryOne("level", `${user.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: user.id, level: 0, exp: 0, lastSent: 0})
        return data.exp
    }

    async nextLevel(p, user){
        let data = await p.mongo.queryOne("level", `${user.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: user.id, level: 0, exp: 0, lastSent: 0})
        return data.level+1
    }

    async currentLevelExp(p, user){
        let data = await p.mongo.queryOne("level", `${user.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: user.id, level: 0, exp: 0, lastSent: 0})
        return ( (5*(data.level*data.level)) + (50*data.level) + 100 )
    }

    async nextLevelExp(p, user){
        let data = await p.mongo.queryOne("level", `${user.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: user.id, level: 0, exp: 0, lastSent: 0})
        return ( (5*((data.level+1)*(data.level+1))) + (50*(data.level+1)) + 100 )
    }

    async expDifference(p, msg){
        let data = await p.mongo.queryOne("level", `${msg.author.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: msg.author.id, level: 0, exp: 0, lastSent: msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp})
        const currentUserExp = await this.currentUserExp(p, data._id)
        const currentLevelExp = await this.currentLevelExp(p, data._id)
        let expDifference = currentLevelExp-currentUserExp
        const nextLevel = expDifference <= 0 ? true : false
        expDifference = expDifference < 0 ? -expDifference : expDifference

        return {nextLevel, expDifference, data}
    }

    async addExperience(p, msg, levelup=true){
        let data = await p.mongo.queryOne("level", `${msg.author.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: msg.author.id, level: 0, exp: 0, lastSent: msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp})

        if(((msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp)-data.lastSent) > 30000){
            let exp = Math.floor(Math.random() * (20-10+1) + 10)
            //console.log(exp)
            data.exp += exp
            data.lastSent = msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp
        }
        await data.save()

        const currentUserExp = await this.currentUserExp(p, data._id)
        const currentLevelExp = await this.currentLevelExp(p, data._id)
        let expDifference = currentLevelExp-currentUserExp
        const nextLevel = expDifference <= 0 ? true : false
        expDifference = expDifference < 0 ? -expDifference : expDifference

        if(levelup&&nextLevel) levelup = await this.addLevel(p, msg)

        return {nextLevel, expDifference, data, leveledUp: levelup.nextLevel}
    }

    async addLevel(p, msg){
        let data = await p.mongo.queryOne("level", `${msg.author.id || this.user?.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: msg.author.id, level: 0, exp: 0, lastSent: msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp})

        const currentUserExp = await this.currentUserExp(p, data._id)
        const currentLevelExp = await this.currentLevelExp(p, data._id)
        let expDifference = currentLevelExp-currentUserExp
        const nextLevel = expDifference <= 0 ? true : false
        expDifference = expDifference < 0 ? -expDifference : currentUserExp

        if(nextLevel){
            data.level += 1
            data.exp = expDifference
        }
        
        await data.save()

        return {nextLevel, expDifference, data}
    }

    async forceAddLevel(p, user, level=1, keep=true){
        let data = await p.mongo.queryOne("level", user.id)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) return false

        if(!keep){
            data.level += level
            data.exp = 0
        } else data.level += level

        await data.save()
        return data
    }

    async forceAddExp(p, user, exp=0){
        let data = await p.mongo.queryOne("level", user.id)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) return false

        data.exp += exp
        
        await data.save()
        return data
    }

    async checkLevelUp(p, msg){
        let data = await p.mongo.queryOne("level", `${msg.author.id || this.user?.id || p.msg.author.id}`)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("level", { _id: msg.author.id, level: 0, exp: 0, lastSent: msg.createdTimestamp||this.msg.createdTimestamp||p.msg.createdTimestamp})

        const currentUserExp = await this.currentUserExp(p, data._id)
        const currentLevelExp = await this.currentLevelExp(p, data._id)
        let expDifference = currentLevelExp-currentUserExp
        const nextLevel = expDifference <= 0 ? true : false
        expDifference = expDifference < 0 ? -expDifference : expDifference

        return {nextLevel, expDifference, data}
    }

    async rewards(p, user, level){
        return new Promise(async (resolve) => {
            let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild
            let member = await p.fetchUser(user.id) //Fetch author from guild

            let reward = {
                "5": {
                    lvl: await p.fetchRole("497843968151781378"),
                    color: await p.fetchRole("813473502312398918"),
                },
                "10": {
                    nick: await p.fetchRole("874995842111668244"),
                    reactions: await p.fetchRole("813410526465490944")
                },
                "15": {
                    lvl: await p.fetchRole("497491254838427674"),
                    color: await p.fetchRole("813473535145934908"),
                    attachments: await p.fetchRole("813420379410399303")
                },
                "30": {
                    lvl: await p.fetchRole("497578834376392724"),
                    color: await p.fetchRole("813473575440220181")
                },
                "50": {
                    lvl: await p.fetchRole("523184440491638795"),
                    color: await p.fetchRole("813473599226511360")
                },
                "70": {
                    lvl: await p.fetchRole("542051690195451907"),
                    color: await p.fetchRole("820334912690192435")
                }
            }

            if(level >= 5 && level < 10) level = 5
            else if(level >= 10 && level < 15) level = 10
            else if(level >= 15 && level < 30) level = 15
            else if(level >= 30 && level < 50) level = 30
            else if(level >= 50 && level < 70) level = 50
            else if(level >= 70) level = 70

            if(reward[level]){
                let levelRoles = Object.entries(reward).filter(role => Number.parseInt(role) <= level)

                let lvlRoles = []
                let rewardedRolesName = []

                for(let roles in levelRoles){
                    if(levelRoles[roles][0]==10) continue
                    if(Target.roles.highest.position < reward[levelRoles[roles][0]].lvl.position || Target.roles.highest.position < reward[levelRoles[roles][0]].color.position || !p.msg.channel.permissionsFor(Target).has(p.Permissions.ManageRoles)) return p.send({embeds: [new p.embed().setAuthor(p.msg.author.username, p.msg.author.displayAvatarURL({dynamic: true})).setDescription("Unable to give you the role rewards for the level.")]})
                    if(!member.roles.cache.some(role => role.name === reward[levelRoles[roles][0]].lvl.name)){
                        lvlRoles.push(reward[levelRoles[roles][0]].lvl)
                    }
                    if(!member.roles.cache.some(role => role.name === reward[levelRoles[roles][0]].color.name)){
                        lvlRoles.push(reward[levelRoles[roles][0]].color)
                    }
                }

                for(let lvl in lvlRoles){
                    rewardedRolesName.push(this.giveBasicRewards(member, lvlRoles[lvl]))
                }

                rewardedRolesName = await Promise.all(rewardedRolesName)

                rewardedRolesName = rewardedRolesName.flat(1).sort((p, c) => {
                    if(p[0]==c[0]){
                        return p.localeCompare(c, undefined, {
                            numeric: true,
                            sensitivity: 'base'
                        })
                    }
                    else return p < c ? 1 : -1
                })

                if(level>=10){
                    if(Target.roles.highest.position < reward["10"].nick.position || Target.roles.highest.position < reward["10"].reactions.position) return p.send({embeds: [new p.embed().setAuthor(p.msg.author.username, p.msg.author.displayAvatarURL({dynamic: true})).setDescription("Unable to give you the role rewards for the level.")]})
                    else{
                        if(!member.roles.cache.some(role => role.name === reward["10"].nick.name)){
                            rewardedRolesName.push(reward["10"].nick.name)
                            await member.roles.add(reward["10"].nick)
                        }
                        if(!member.roles.cache.some(role => role.name === reward["10"].reactions.name)){
                            rewardedRolesName.push(reward["10"].reactions.name)
                            await member.roles.add(reward["10"].reactions)
                        }
                    }
                }
                if(level>=15){
                    if(Target.roles.highest.position < reward["15"].attachments.position) return p.send({embeds: [new p.embed().setAuthor(p.msg.author.username, p.msg.author.displayAvatarURL({dynamic: true})).setDescription("Unable to give you the role rewards for the level.")]})
                    if(!member.roles.cache.some(role => role.name === reward["15"].attachments.name)){
                        rewardedRolesName.push(reward["15"].attachments.name)
                        await member.roles.add(reward["15"].attachments)
                    }
                }

                resolve(rewardedRolesName);
            }
        }
    )}

    async giveBasicRewards(member, role){
        return new Promise(async (resolve) => {
            let rewardedRolesName = []
            if(role){
                rewardedRolesName.push(role.name)
                await member.roles.add(role)
            }

            resolve(rewardedRolesName)
        })
    }
}