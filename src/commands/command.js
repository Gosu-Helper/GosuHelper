const requireDir = require('require-dir')
const CommandInterface = require('./commandInterface')
const dir = requireDir('./commandList', {recurse: true})
const Embed = require('../utils/embed')
const ButtonBuilder = require('../buttonUtils/ButtonBuilder')
const ActionRowBuilder = require('../buttonUtils/ActionRowBuilder')
const permissions = require('../data/permissions')
const Permissions = permissions.Permissions
const levelClass = require('../utils/level')
let commandList = {}
let commandGroups = {}
let levels = {}
let cdCache = {}

class Command {

    constructor (main){
        this.main = main
        this.prefix = main.prefix
        initCommands()
        initLevels()
        this.levels = levels
        this.commands = commandList
        //console.log(commandGroups)
    }

    async execute(msg){
        require('dotenv').config()

        let level = (require('../utils/permLevel')).permlevel(msg)
        
        if(level < 2 && !(await checkDisabled(initParam(msg,"Automod", "", "", this.main)))){
            if(await commandList['automod'].execute(initParam(msg, "automod", "", "", this.main))) return
        }

        if(msg.content == `${msg.author.id}-ChatExp`) return chatExp(msg, level, this.main)

        let args = await checkPrefix(this.main, msg)

        if(!args?.args) return

        let command = args.args.shift().toLowerCase()

        if(!commandList[command]) return

        if(level < levels[commandList[command].permLevel]) return

        let param = initParam(msg,command,args,level,this.main);

        let disabled = await checkDisabled(param)

        if(disabled==1) return param.send(new param.embed({description: 'This commmand is disabled on this channel.', color: 'ERROR'}))
        else if(disabled==2) return param.send(new param.embed({description: 'This commmand is disabled on this server.', color: 'ERROR'}))

        let privated = await checkPrivated(param)
        
        if(privated && param.msg.guildId != process.env.OWNER_GUILD) return

        let perms = await checkPerms(this.main, param)

        if(perms.perms === false){
            if(perms.missing.includes('SendMessages')) return
            return param.send(`The bot is missing **${perms.missing.join(", ")}** permissions.`)
        }

        let gosu = await checkGosu(param)
        
        if(!gosu) return

        let cd = await checkCd(param)

        if(cd) {
            if((cd.cooldown-(Date.now()-cd.now))/1000 < 1) cd = (cd.cooldown-(Date.now()-cd.now))/1000
            else cd = Math.floor((cd.cooldown-(Date.now()-cd.now))/1000)
            return param.send(new param.embed({description: `This command is on cooldown please wait ${cd}s`, color: 'ERROR'}),"", cd>1.5?cd*1000:2000)
        }

        await executeCommand(param);
    }
}

async function executeCommand(p){
    await commandList[p.command].execute(p)
    if(!cdCache[p.msg.author.id+p.command]){
        let cooldown = 3000
        if(commandList[p.command]["cd"]) cooldown = commandList[p.command].cd
        cdCache[p.msg.author.id+p.command] = {cooldown: cooldown, now: Date.now()}
        setTimeout(() => {delete cdCache[p.msg.author.id+p.command]}, cooldown)
    }
}

async function initCommands(){
    let groupCommand = function(command, name) {
        let permLevel = command.permLevel
		let groups = command.group;
        //console.log(groups)

		if (groups && groups.length) {
			for (let i in groups) {
				let group = groups[i];
                if (!commandGroups[group]) commandGroups[group] = [];
                if (!commandGroups[group][permLevel]) commandGroups[group][permLevel] = [];
                let commandObj = {}
                commandObj[name] = command
				commandGroups[group][permLevel].push(commandObj);
			}
		} else {
            let commandObj = {}
            commandObj[name] = command
            if(!commandGroups['Ungrouped']) commandGroups['Ungrouped'] = [];
			if (!commandGroups['Ungrouped'][permLevel]) commandGroups['Ungrouped'][permLevel] = [];
			commandGroups['Ungrouped'][permLevel].push(commandObj);
		}
	}

	let addCommand = function(command){
		let alias = command.alias;
		let name = alias[0];
		if(alias){
            process.stdout.write("[ALIASES] - ")
			for(let i=0;i<alias.length;i++){
				commandList[alias[i]] = command;
                process.stdout.write(`${alias[i]} `)
            }
            console.log("\n")
		}
		groupCommand(command, name);
	}

    console.log('Initiating commands...\n')
    for(let key in dir){
        if(key instanceof CommandInterface){
            addCommand(dir[key])
        } else {
            for(let command in dir[key]){
                if(dir[key][command] instanceof CommandInterface){
                    addCommand(dir[key][command])
                }
            }
        }
    }
}

function initLevels(){
    const { confLevels } = requireDir('../data')
    for (let i of confLevels['permLevels']) {
        levels[i.name] = i.level;
    }
}

function initParam(msg, command, args, level, main){
    return {
		"msg":msg,
		"args":args.args,
		"command":command,
        "prefix":args.prefix,
        "level":level,
        "levels":levels,
        "send":main.sender.send(msg),
        "reply":main.sender.reply(msg),
        "errorMsg":main.sender.errorMsg(msg),
        "embed": Embed,
        "button": ButtonBuilder,
        "actionrow": ActionRowBuilder,
        "Permissions": Permissions,
        "leveling": levelClass,
        "main": main,
		"client":main.client,
		"commands":commandList,
		"commandGroups":commandGroups,
		"config":main.config,
        "mongo": main.mongo,
        "zws": '​',
        "fixPerms":fixPerms,
        "fetchUser":async function(id){
            id = id?.match(/\d+/g)
            if(!id) return null
            id = id[0]
            let user = await msg.guild.members.fetch(id).catch(err => {return null})
            if(user) return user
            else return null
        },
        "fetchRole":async function(id){
            id = id?.match(/\d+/g)
            if(!id) return null
            id = id[0]
            let role = await msg.guild.roles.fetch(id).catch(err => {return null})
            if(role) return role
            else return null
        },
        "fetchChannel": async function(id){
            id = id?.match(/\d+/g)
            if(!id) return null
            id = id[0]
            let guild = await msg.guild.channels.fetch(id).catch(err => {return null})
            if(guild) return guild
            else return null
        },
        /**
         * 
         * @param {string} type user|role
         * @param  {...any} mentions Array[mentions]
         * @returns {Array|null}
         */
        "toMention":function(type,...mentions){
            if(mentions.flat(2).length == 0) return ["None"]
            if(type.toLowerCase() == 'user'){
                mentions = mentions.flat(2).join(" ").match(/\d+/g).map(id => `<@!${id}>`)
                return mentions
            } else if(type.toLowerCase() == 'role'){
                mentions = mentions.flat(2).join(" ").match(/\d+/g).map(id => `<@&${id}>`)
                return mentions
            } else return null
        },
        "awaitReply":async function awaitReply(question, del = false, limit = 60000){
            const filter = m => m.author.id === msg.author.id;
            const message = await msg.channel.send(question);
            try {
                const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
                if(del) message.delete()
                return collected.first().content;
            } catch (e) {
                return false;
            }
        }
	}
}

async function checkPrefix(main, msg){

    const content = msg.content.toLowerCase();

    let data = await main.mongo.queryOne('prefix', msg.guildId)

    let prefix = data?.newPrefix

    if (content.startsWith(`<@${main.client.user.id}>`) || content.startsWith(`<@!${main.client.user.id}>`)){
        return {
            args: content.startsWith(`<@${main.client.user.id}>`) ? msg.content.slice(`<@${main.client.user.id}>`.length).trim().split(/ +/g) : msg.content.slice(`<@!${main.client.user.id}>`.length).trim().split(/ +/g),
            prefix: main.prefix
        }
    }
    else if (prefix && content.startsWith(prefix)){
        return {
            args: msg.content.slice(prefix.length).trim().split(/ +/g),
            prefix: prefix
        }
    } else if(content.startsWith(main.prefix)){
        return {
            args: msg.content.slice(main.prefix.length).trim().split(/ +/g),
            prefix: main.prefix
        }
    }
    return null
}

async function checkPerms(main, p){
    let perms;
    let missing = []
    let Target = await p.msg.guild.members.fetch(main.client.user.id)

    if(Target.permissions.has(Permissions.Administrator)) return {perms: true}
    else if(!p.msg.channel.permissionsFor(Target).has(Permissions.SendMessages)) missing.push('SendMessages')
    else{
        for(let perm in commandList[p.command].permissions){
            if(commandList[p.command].permissions[perm] == 'ManageRoles'){
                if(!Target.permissions.has(Permissions[commandList[p.command].permissions[perm]])) missing.push("Manage Roles")
            }
            else if(!p.msg.channel.permissionsFor(Target).has(Permissions[commandList[p.command].permissions[perm]])){
                missing.push(fixPerms(false, commandList[p.command].permissions[perm]))
            }
        }
    }

    if(missing.length > 0) perms = false
    else if(missing.length < 1) perms = true
    else perms = false

    return {
        perms,
        missing
    }
}

/**
 * 
 * @param {boolean} filter Key Perms
 * @param  {...any} perms Array[perms] 
 * @returns {Array}
 */
function fixPerms(filter,...perms){
    let include = ["Administrator", "ManageGuild","ManageRoles","ManageChannels","ManageMessages","ManageWebhooks","ManageNicknames","ManageGuildExpressions","KickMembers","BanMembers","ModerateMembers","ManageEvents","ManageThreads",Permissions.Administrator,Permissions.ManageGuild,Permissions.ManageRoles,Permissions.ManageChannels,Permissions.ManageMessages,Permissions.ManageWebhooks,Permissions.ManageNicknames,Permissions.ManageGuildExpressions,Permissions.KickMembers,Permissions.BanMembers,Permissions.ModerateMembers,Permissions.ManageEvents,Permissions.ManageThreads]//['START_EMBEDDED_ACTIVITIES', 'SEND_MESSAGES_IN_THREADS', 'CREATE_PRIVATE_THREADS', 'CREATE_PUBLIC_THREADS', 'REQUEST_TO_SPEAK', 'USE_VAD', 'CONNECT', 'SPEAK', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'READ_MESSAGE_HISTORY',]
    if(filter === true) perms = perms.flat(2).filter((perm) => include.includes(perm))
    else if(Array.isArray(filter)) perms = perms.flat(2).filter((perm) => filter.includes(perm))
    //new perm().log()
    //console.log(perms.flat(2))
    //perms = Object.fromEntries(Object.entries(permissions).filter(([permission, bit]) => perms.include(bit)))//.filter((perm) => Object.values(permissions).filter((permission) => perms.flat(2).includes(permission))//.map(perm => fixPerm(perm))
    if(perms.length>0){
        perms = perms.flat(2).map(perm => fixPerm(perm))
        return perms
    } else return null
}

function fixPerm(perms){
    if(perms == Permissions.ManageGuild){
        perms = 'ManageServer'
    }
    if(perms == Permissions.ModerateMembers){
        perms = 'TimeoutMembers'
    }
    
    let words = perms.split(/(?=[A-Z])/g)
    // let combined = []
    // for(let j of words){
    //     let word = j.toLowerCase()
    //     combined.push(word[0].toUpperCase()+word.substring(1))
    // }
    return words.join(' ')
}

async function checkDisabled(p){
    let data = await p.mongo.queryOne("command", p.msg.guildId)
    let chnl = data?.channel?.indexOf((data?.channel?.filter(channels => channels._id == p.msg.channel.id))[0])
    if(p.command == "Leveling" || p.command === "Automod") return (data?.channel[chnl]?.module?.includes(p.command) ? 1 : 0)
    return (data?.channel[chnl]?.commands?.includes(commandList[p.command].alias[0]) ? 1 : data?.disabled.includes(commandList[p.command].alias[0]) ? 2 : 0);
}

async function checkPrivated(p){
    let data = await p.mongo.queryOne("priv", '493164609591574528')
    //console.log(data)
    return !!(data?.priv.includes(p.command));
}

async function checkGosu(p){
    if(commandList[p.command]["gosu"]){
        return ["495716062097309697","493164609591574528", "491747726208270338"].includes(p.msg.guildId)
    } else return true
}

async function checkCd(p){
    if(cdCache[p.msg.author.id+p.command]){
        return cdCache[p.msg.author.id+p.command]
    } else return false
}

async function chatExp(msg, level, main){
    const levelParam = initParam(msg, "Leveling", "", "", main)
    let leveling = new levelClass(levelParam,msg)
    let gain = await leveling.addExperience(levelParam, msg, true)
    let rewards = [];
    if(level<2) rewards = await leveling.rewards(levelParam, msg.author, gain.data.level)
    
    let rewardText = ""

    if(rewards.includes("Lv5")||rewards.includes("Lv15")||rewards.includes("Lv30")||rewards.includes("Lv50")||rewards.includes("Lv70")) rewardText += "You earned a level role, go pick a class under that level in <#1199891939642851378>!\n"
    if(rewards.includes("Color 1")||rewards.includes("Color 2")||rewards.includes("Color 3")||rewards.includes("Color 4")) rewardText += "You earned a color role, go pick a color under that role in <#1201714240126468116>!\n"
    if(rewards.includes("nick")) rewardText += "You can change your nickname now!\n"
    if(rewards.includes("reactions")) rewardText += "You can add reactions to messages now!\n"
    if(rewards.includes("attachments")) rewardText += "You can send pictures in <#496716663144579082> now!\n"

    if(gain.leveledUp){
        let levelUpEmbed = new Embed().setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true})).setDescription(`Congratulations, you leveled up to Level ${(await gain).data.level}!`).setColor("RANDOM")
        let rewardsEmbed = new Embed().setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true})).setTitle("Level Up Rewards").setColor("RANDOM")
        let embeds = [levelUpEmbed]

        if(rewardText){
            rewardsEmbed.setDescription(rewardText.slice(0,-1))
            rewardsEmbed.addField('Rewards', rewards.join(", "))
            if(level<2) embeds.push(rewardsEmbed)
        }
        if(!(await checkDisabled(levelParam))) msg.channel.send({embeds: embeds})
    }else if(!gain.leveledUp){
        let rewardsEmbed = new Embed().setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true})).setTitle("Missing Level Rewards").setColor("RANDOM")

        if(rewards.length > 0&&level<2){
            if(rewardText){
                rewardsEmbed.setDescription(rewardText.slice(0,-1))
                rewardsEmbed.addField('Rewards', rewards.join(", "))
            }
            if(!(await checkDisabled(levelParam))) msg.channel.send({embeds: [rewardsEmbed]})
        }
    }
}

module.exports = Command