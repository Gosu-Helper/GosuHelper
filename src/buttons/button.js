const requireDir = require('require-dir')
const ActionRowBuilder = require('../buttonUtils/ActionRowBuilder')
const ButtonInterface = require('./buttonInterface')
const ButtonBuilder = require('../buttonUtils/ButtonBuilder')
const Embed = require('../utils/embed')
const { PermissionsBitField } = require('discord.js');
const dirButtonComponent = requireDir('./buttonComponent')
const dirLevelButtonComponent = requireDir('./levelButtonComponent')
const dirCommand = requireDir('./buttonCommandList')
let buttonCommandList = {}
let buttonGroups = {}
let actionRow = {}
let levels = {}
let cdCache = {}

class Button {

    constructor(main){
        this.main = main
        initButtons(main, dirButtonComponent)
        initButtons(main, dirLevelButtonComponent)
        initButtonCommands()
        initLevels()
        this.prefix = main.prefix
        this.levels = levels
        this.buttons = buttonCommandList
    }

    async execute(interaction){
        require('dotenv').config()

        let command = interaction.customId ?? null
        
        if(!buttonCommandList[command]) return interaction.deferUpdate()

        let args = ''

        let level = (require('../utils/permLevel')).permlevel(interaction)

        if(level < levels[buttonCommandList[command].permLevel]) return

        let param = initParam(interaction,command,args,level,this.main);

        /*let disabled = await checkDisabled(param)

        if(disabled) return param.send(new param.embed({description: 'This commmand is disabled on this server.', color: 'ERROR'}))

        let privated = await checkPrivated(param)
        
        if(privated && param.msg.guildId != process.env.OWNER_GUILD) return*/
        
        let cd = await checkCd(param)
        
        if(cd) {
            if((cd.cooldown-(Date.now()-cd.now))/1000 < 1) cd = (cd.cooldown-(Date.now()-cd.now))/1000
            else cd = Math.floor((cd.cooldown-(Date.now()-cd.now))/1000)
            return interaction.deferUpdate()
        }
        
        let gosu = await checkGosu(param)
        
        if(!gosu) return
        
        let perms = await checkPerms(this.main, param)

        if(perms.perms === false){
            if(perms.missing.includes('Send Messages')) return
            return param.interaction.reply( {content: `The bot is missing **${perms.missing.join(", ")}** permissions.`, ephemeral: true})
        }
        
        await executeCommand(param);
    }
}

async function initButtons(main, dirComponent){
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    let obj = {}

    for(let key in dirComponent){
        if(dirComponent[key].address){
            for(let a in dirComponent[key].address){
                let args = dirComponent[key].address[a].split("/")
                if(!obj[args[2]]) obj[args[2]] = []
                if(dirComponent[key].actionRow){
                    let actionRow = obj[args[2]].filter((actionRow) => actionRow?.name?.toLowerCase().includes(dirComponent[key].actionRow.name?.toLowerCase()))
                    let buttonPosition = dirComponent[key].position ?? 100
                    if(actionRow?.length > 0){
                        let slicedActionRow = actionRow.slice(-1)[0]
                        let position = obj[args[2]].findIndex((row) => {return row.name === slicedActionRow.name})
                        position = position < 0 ? obj[args[2]].length - 1 : position
                        if(obj[args[2]][position].components.length < 5){
                            obj[args[2]][position].components.push({button: dirComponent[key].buttonData, position: buttonPosition})
                        } else {
                            dirComponent[key].actionRow.name = `${dirComponent[key].actionRow.name}${actionRow.length}`
                            obj[args[2]].push(dirComponent[key].actionRow)
                            actionRow = obj[args[2]].find((actionRow) => actionRow?.name.toLowerCase() == dirComponent[key].actionRow.name.toLowerCase())
                            if(!actionRow.hasOwnProperty('position')) actionRow.position = 100
                            if(!actionRow.components) actionRow.components = []
                            actionRow.components.push({button: dirComponent[key].buttonData, position: buttonPosition})
                        }
                    } else {
                        obj[args[2]].push(dirComponent[key].actionRow)
                        actionRow = obj[args[2]].find((actionRow) => actionRow?.name.toLowerCase() == dirComponent[key].actionRow.name.toLowerCase())
                        if(!actionRow.hasOwnProperty('name')) actionRow.name = 'undefined'
                        if(!actionRow.hasOwnProperty('position')) actionRow.position = 100
                        if(!actionRow.components) actionRow.components = []
                        actionRow.components.push({button: dirComponent[key].buttonData, position: buttonPosition})
                    }
                } else if(args.length >= 3 && !dirComponent[key].actionRow){
                    let name = args[3] ?? 'undefined'
                    let position = args[4] ?? 100
                    let actionRow = obj[args[2]].filter((actionRow) => actionRow?.name.toLowerCase().includes(name.toLowerCase()))
                    let buttonPosition = dirComponent[key].position ?? 100
                    if(actionRow?.length > 0){
                        let slicedActionRow = actionRow.slice(-1)[0]
                        position = obj[args[2]].findIndex((row) => {return row.name === slicedActionRow.name})//obj[args[2]].indexOf(slicedActionRow.name)
                        position = position < 0 ? obj[args[2]].length - 1 : position
                        if(obj[args[2]][position].components.length < 5){
                            obj[args[2]][position].components.push({button: dirComponent[key].buttonData, position: buttonPosition})
                        } else {
                            dirComponent[key].actionRow.name = `${name}${actionRow.length}`
                            obj[args[2]].push({ name: name, position: position, components: [] })
                            actionRow = obj[args[2]].find((actionRow) => actionRow?.name.toLowerCase() == dirComponent[key].actionRow.name.toLowerCase())
                            if(!actionRow.hasOwnProperty('position')) actionRow.position = 100
                            if(!actionRow.components) actionRow.components = []
                            actionRow.components.push({button: dirComponent[key].buttonData, position: buttonPosition})
                        }
                    } else {
                        obj[args[2]].push({ name: name, position: position, components: [] })
                        actionRow = obj[args[2]].find((actionRow) => actionRow?.name.toLowerCase() == name.toLowerCase())
                        if(!actionRow.hasOwnProperty('position')) actionRow.position = 100
                        if(!actionRow.components) actionRow.components = []
                        actionRow.components.push({button: dirComponent[key].buttonData, position: buttonPosition})
                        //actionRow.components.push(dirComponent[key].buttonData)
                    }
                }
            }
        }
    }
    let checked = {}
    for(let msg in obj){
        obj[msg].sort(((p, c) => p.position - c.position))
        let toBeSent = []
        for(let row in obj[msg]){
            let components = []
            obj[msg][row].components.flat(2).sort((p, c) => p.position - c.position).forEach((buttonData) => components.push(buttonData.button))
            let actionRow = new ActionRowBuilder().setComponents(components)
            toBeSent.push(actionRow)
        }

        if(toBeSent.length > 5) toBeSent = toBeSent.slice(0, 5)
        
        for(let key in dirComponent){
            if(dirComponent[key].address){
                for(let address in dirComponent[key].address){
                    try{
                        address = dirComponent[key].address[address].split("/")
                        let guild = await main.client.guilds.fetch(address[0])
                        let channel = await guild.channels.fetch(address[1])
                        if(address[2]==msg && !checked[msg]){
                            let message = await channel.messages.fetch(msg)
                            checked[msg] = true
                            message.edit({components: toBeSent})
                        }
                    } catch(err){
                        console.log(err)
                    }
                }
            }
        }
    }
    /*for(let key in dirComponent){
        if (dirComponent[key].address){
            for(let address in dirComponent[key].address){
                try{
                    address = dirComponent[key].address[address].split("/")
                    let guild = await main.client.guilds.fetch(address[0])
                    let channel = await guild.channels.fetch(address[1])
                    let message = await channel.messages.fetch(address[2])
                    message.edit({components: [new main.actionrow().addComponents(dirComponent[key].buttonData)]})
                } catch(err){
                    console.log(err)
                }
            }
        }
    }*/
}

async function initButtonCommands(){
    let groupCommand = function(command, name) {
        let permLevel = command.permLevel
		let groups = command.group;
        //console.log(groups)

		if (groups && groups.length) {
			for (let i in groups) {
				let group = groups[i];
                if (!buttonGroups[group]) buttonGroups[group] = [];
                if (!buttonGroups[group][permLevel]) buttonGroups[group][permLevel] = [];
                let commandObj = {}
                commandObj[name] = command
				buttonGroups[group][permLevel].push(commandObj);
			}
		} else {
            let commandObj = {}
            commandObj[name] = command
            if(!buttonGroups['Ungrouped']) buttonGroups['Ungrouped'] = [];
			if (!buttonGroups['Ungrouped'][permLevel]) buttonGroups['Ungrouped'][permLevel] = [];
			buttonGroups['Ungrouped'][permLevel].push(commandObj);
		}
	}

	let addCommand = function(command){
		let alias = command.alias;
		let name = alias[0];
		if(alias){
            process.stdout.write("[BUTTON ALIASES] - ")
			for(let i=0;i<alias.length;i++){
				buttonCommandList[alias[i]] = command;
                process.stdout.write(`${alias[i]} `)
            }
            console.log("\n")
		}
		groupCommand(command, name);
	}

    console.log('Initiating buttons commands...\n')
    for(let key in dirCommand){
        if(dirCommand[key] instanceof ButtonInterface){
            addCommand(dirCommand[key])
        } else {
            for(let command in dirCommand[key]){
                if(dirCommand[key][command] instanceof ButtonInterface){
                    addCommand(dirCommand[key][command])
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

async function executeCommand(p){
    await buttonCommandList[p.command].execute(p)
    if(!cdCache[p.interaction.user.id+p.command]){
        let cooldown = 2500
        if(buttonCommandList[p.command]["cd"]) cooldown = buttonCommandList[p.command].cd
        cdCache[p.interaction.user.id+p.command] = {cooldown: cooldown, now: Date.now()}
        setTimeout(() => {delete cdCache[p.interaction.user.id+p.command]}, cooldown)
    }
}

function initParam(interaction, command, args, level, main){
    return {
		"interaction":interaction,
		"args":args,
		"command":command,
        //"prefix":args.prefix,
        "level":level,
        "levels":levels,
        "send":main.sender.send(interaction),
        "reply":main.sender.reply(interaction),
        "errorMsg":main.sender.errorMsg(interaction),
        "embed": Embed,
        "buttonBuilder": ButtonBuilder,
        "main": main,
		"client":main.client,
		"commands":buttonCommandList,
		"commandGroups":buttonGroups,
		"config":main.config,
        "mongo": main.mongo,
        "zws": '​',
        "fetchUser":async function(id){
            id = id?.match(/\d+/g)
            if(!id) return null
            id = id[0]
            let user = await interaction.guild.members.fetch(id).catch(err => {return null})
            if(user) return user
            else return null
        },
        "fetchRole":async function(id){
            id = id?.match(/\d+/g)
            if(!id) return null
            id = id[0]
            let role = await interaction.guild.roles.fetch(id).catch(err => {return null})
            if(role) return role
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
        //"fixPerms":fixPerms,
        "awaitReply":async function awaitReply(question, limit = 60000) {
            const filter = m => m.author.id === interaction.author.id;
            await interaction.channel.send(question);
            try {
                const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
                return collected.first().content;
            } catch (e) {
                return false;
            }
        }
	}
}

async function checkPerms(main, p){
    let perms;
    let missing = []
    let Target = await p.interaction.guild.members.fetch(main.client.user.id)

    if(!cdCache[p.interaction.user.id+p.command]){
        let cooldown = 3000
        if(buttonCommandList[p.command]["cd"]) cooldown = buttonCommandList[p.command].cd
        cdCache[p.interaction.user.id+p.command] = {cooldown: cooldown, now: Date.now()}
        setTimeout(() => {delete cdCache[p.interaction.user.id+p.command]}, cooldown)
    }

    if(Target.permissions.has(PermissionsBitField.Flags.Administrator)) return {perms: true}
    else if(!p.interaction.channel.permissionsFor(Target).has(/*'SEND_MESSAGES'*/PermissionsBitField.Flags.SendMessages)) {
        missing.push('Send Messages')
    }
    else{
        for(let perm in buttonCommandList[p.command].permissions){
            if(!p.interaction.channel.permissionsFor(Target).has(/*commandList[p.command].permissions[perm]*/PermissionsBitField.Flags.ManageRoles)){
                missing.push(fixPerms(false, buttonCommandList[p.command].permissions[perm]))
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

function fixPerm(perms){
    if(perms == 'MANAGE_GUILD'){
    perms = 'MANAGE_SERVER'
    }
    if(perms == 'MODERATE_MEMBERS'){
        perms = 'TIMEOUT_MEMBERS'
    }
    let words = perms.split("_")
    let combined = []
    for(let j of words){
        let word = j.toLowerCase()
        combined.push(word[0].toUpperCase()+word.substring(1))
    }
    return combined.join(' ')
}
/**
 * 
 * @param {boolean} filter Key Perms
 * @param  {...any} perms Array[perms] 
 * @returns {Array}
 */
function fixPerms(filter,...perms){
    let include = ['ADMINISTRATOR','MANAGE_GUILD','MANAGE_ROLES','MANAGE_CHANNELS','MANAGE_MESSAGES','MANAGE_WEBHOOKS','MANAGE_NICKNAMES','MANAGE_EMOJIS_AND_STICKERS','KICK_MEMBERS','BAN_MEMBERS','MODERATE_MEMBERS','MANAGE_EVENTS','MANAGE_THREADS']//['START_EMBEDDED_ACTIVITIES', 'SEND_MESSAGES_IN_THREADS', 'CREATE_PRIVATE_THREADS', 'CREATE_PUBLIC_THREADS', 'REQUEST_TO_SPEAK', 'USE_VAD', 'CONNECT', 'SPEAK', 'PRIORITY_SPEAKER', 'STREAM', 'VIEW_CHANNEL', 'SEND_MESSAGES', 'SEND_TTS_MESSAGES', 'READ_MESSAGE_HISTORY',]
    if(filter === true) perms = perms.flat(2).filter((perm) => include.includes(perm))
    else if(Array.isArray(filter)) perms = perms.flat(2).filter((perm) => filter.includes(perm))

    if(perms.length>0){
        perms = perms.flat(2).map(perm => fixPerm(perm))
        return perms
    } else return null
}

async function checkGosu(p){
    if(buttonCommandList[p.command]["gosu"]){
        return ["495716062097309697","493164609591574528", "491747726208270338"].includes(p.interaction.guildId)
    } else return true
}

async function checkCd(p){
    if(cdCache[p.interaction.user.id+p.command]){
        return cdCache[p.interaction.user.id+p.command]
    } else return false
}

module.exports = Button