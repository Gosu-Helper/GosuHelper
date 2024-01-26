const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['private', "priv", 'hide'],
    args: '[command name]',
    desc: "Private a command or module.",
    related: [],
    permissions: ["MANAGE_MESSAGES"],
    permLevel: 'Bot Owner',
    group: ["Manager"],
    execute: async function(p){
        p.msg.delete()

        let unfound = new p.embed().setDescription("I couldn't find the command/module you were looking for.").setColor('UNFOUND')
        let success;
        let cmds = []

        if(p.args.length < 1) return p.send(unfound)

        let command = p.commands[p.args[0]]
        let moduleName = p.args[0][0].toUpperCase() + p.args[0].slice(1).toLowerCase()

        if(command){
            cmds = command.alias[0]
        } else if(p.commandGroups[moduleName]){
            for(let permLevel in p.commandGroups[moduleName]){
                for(let commandObj in p.commandGroups[moduleName][permLevel]){
                    for(let name in p.commandGroups[moduleName][permLevel][commandObj]){
                        cmds.push(name)
                    }
                }
            }
        } else {
            return p.send(unfound, "", 5000)
        }

        let data = await p.mongo.queryOne("priv", '493164609591574528') //Find data
        if(!data){
            data = await p.mongo.createOne("priv", { _id: '493164609591574528', priv: cmds })
            return p.send(`Privated **${cmds.join(", ")}**`, "", 5000)
        }

        if(command){
            if(!data.priv.includes(cmds)){
                data.priv.push(cmds)
                success = `Privated **${cmds}**`
            } else if(data.priv.includes(cmds)){
                let name = data.priv.indexOf(cmds)
                data.priv.splice(name, 1)
                success = `Unprivated **${cmds}**`
            }
        } else{
            if(!data.priv.includes(moduleName)){
                data.priv.push(moduleName)
                cmds.forEach(cmd => {
                    if(!data.priv.includes(cmd)){
                        data.priv.push(cmd)
                    }
                })
                success = `Privated **${moduleName}**\n\`\`\`${cmds.join(", ")}\`\`\``
            } else if(data.priv.includes(moduleName)){
                let name = data.priv.indexOf(moduleName)
                data.priv.splice(name, 1)
                cmds.forEach(cmd => {
                    let command = data.priv.indexOf(cmd)
                    data.priv.splice(command, 1)
                })
                success = `Unprivated **${moduleName}**\n\`\`\`${cmds.join(", ")}\`\`\``
            }
        }
        await data.save()
        p.send(success, "", 5000)
    }
})