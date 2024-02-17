const CommandInterface = require("../../commandInterface");

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

        let data = await p.mongo.queryOne("command", p.msg.guildId)//Find data

        if(!data) data = (await p.mongo.createOne("command", {_id: p.msg.guildId, disabled: []}))

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
        await data.save()
        p.send(success)
    }
})