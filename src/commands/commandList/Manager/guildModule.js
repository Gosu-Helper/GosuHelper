const CommandInterface = require("../../commandInterface");
const guildCommand = require('./guildCommand')

module.exports = new CommandInterface({
    alias: ['module', 'category'],
    args: '[module name]',
    desc: 'Enable or disable all commands in a module.',
    related: ['gh command'],
    permissions: [],
    permLevel: 'Administrator',
    group: ['Manager'],
    execute: async function(p){
        let unfound = new p.embed().setDescription("I couldn't find the module you were looking for.").setColor('UNFOUND')
        let success = new p.embed().setColor('SUCCESS')
    
        if(p.args.length < 1) return p.send(unfound)

        p.args[0] = p.args[0][0].toUpperCase() + p.args[0].slice(1).toLowerCase()
        let moduleName = p.commandGroups[p.args[0]]

        if(!moduleName) return p.send(unfound)

        let data = await p.mongo.queryOne("command", p.msg.guildId, { _id: p.msg.guildId, disabled: [], channel: []}, false)//Find data

        if(!data) return

        let channel;
        if(p.args[1]) channel = await p.fetchChannel(p.args[1])

        if(channel&&data.channel){
            if(data.channel.length > 0){
                let chnl = data.channel.indexOf((data?.channel?.filter(channels => channels._id == channel.id))[0])
                if(chnl < 0){
                    data.channel.push({ _id: `${channel.id}`, commands: [], module: [] })
                    chnl = data.channel.indexOf((data.channel.filter(channels => channels._id == channel.id))[0])
                    if(!data.channel[chnl].module.includes(p.args[0])){
                        data.channel[chnl].module.push(p.args[0])
                        for(let permLevel in moduleName){
                            if(p.level < p.levels[permLevel]) break
                            for(let commandObj in moduleName[permLevel]){
                                for(let name in moduleName[permLevel][commandObj]){
                                    if(name == 'help'||name == 'command'||name == 'module') break
                                    if(!data.channel[chnl].commands.includes(name)) data.channel[chnl].commands.push(name)
                                }
                            }
                        }
                    }
                    success.setDescription(`Disabled all commands in \`${p.args[0]}\` for <#${channel.id}>.`)
                }else{
                    if(!data.channel[chnl].module.includes(p.args[0])){
                        if(!data.channel[chnl].module.includes(p.args[0])){
                            data.channel[chnl].module.push(p.args[0])
                            for(let permLevel in moduleName){
                                if(p.level < p.levels[permLevel]) break
                                for(let commandObj in moduleName[permLevel]){
                                    for(let name in moduleName[permLevel][commandObj]){
                                        if(name == 'help'||name == 'command'||name == 'module') break
                                        if(!data.channel[chnl].commands.includes(name)) data.channel[chnl].commands.push(name)
                                    }
                                }
                            }
                        }
                        success.setDescription(`Disabled all commands in \`${p.args[0]}\` for <#${channel.id}>.`)
                    }else if(data.channel[chnl].module.includes(p.args[0])){
                        let module = data.channel[chnl].module.indexOf(p.args[0])
                        data.channel[chnl].module.splice(module, 1)
                        for(let permLevel in moduleName){
                            if(p.level < p.levels[permLevel]) break
                            for(let commandObj in moduleName[permLevel]){
                                for(let name in moduleName[permLevel][commandObj]){
                                    let index = data.channel[chnl].commands.indexOf(name)
                                    data.channel[chnl].commands.splice(index, 1)
                                }
                            }
                        }
                        success.setDescription(`Enabled all commands in \`${p.args[0]}\` for <#${channel.id}>.`)
                    }
                }
            }else{
                data.channel.push({ _id: `${channel.id}`, commands: [], module: [] })
                chnl = data.channel.indexOf((data.channel.filter(channels => channels._id == channel.id))[0])
                if(!data.channel[chnl].module.includes(p.args[0])){
                    data.channel[chnl].module.push(p.args[0])
                    for(let permLevel in moduleName){
                        if(p.level < p.levels[permLevel]) break
                        for(let commandObj in moduleName[permLevel]){
                            for(let name in moduleName[permLevel][commandObj]){
                                if(name == 'help'||name == 'command'||name == 'module') break
                                if(!data.channel[chnl].commands.includes(name)) data.channel[chnl].commands.push(name)
                            }
                        }
                    }
                }
                success.setDescription(`Disabled all commands in \`${p.args[0]}\` for <#${channel.id}>.`)
            }
        }else{
            if(!data?.disabled.includes(p.args[0])){
                data.disabled.push(p.args[0])
                success.setDescription(`Disabled all commands in \`${p.args[0]}\` for this server.`)
                for(let permLevel in moduleName){
                    if(p.level < p.levels[permLevel]) break
                    for(let commandObj in moduleName[permLevel]){
                        for(let name in moduleName[permLevel][commandObj]){
                            if(name == 'help'||name == 'command'||name == 'module') break
                            if(!data.disabled.includes(name)) data.disabled.push(name)
                        }
                    }
                }
            }
            else {
                let moduleIndex = data.disabled.indexOf(p.args[0])
                data.disabled.splice(moduleIndex, 1)
                success.setDescription(`Enabled all commands in \`${p.args[0]}\` for this server`)
                for(let permLevel in moduleName){
                    if(p.level < p.levels[permLevel]) break
                    for(let commandObj in moduleName[permLevel]){
                        for(let name in moduleName[permLevel][commandObj]){
                            let index = data.disabled.indexOf(name)
                            data.disabled.splice(index, 1)
                        }
                    }
                }
            }
        }
        await data.save()
        p.send(success)
    }
})