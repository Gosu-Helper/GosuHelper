const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['command', 'cmd'],
    args: '[command name] (channel)',
    desc: 'Enable or disable a command.',
    related: ['gh module'],
    permissions: [],
    permLevel: 'Administrator',
    group: ['Manager'],
    execute: async function(p){
        //Required embedss
        let unfound = new p.embed().setDescription("I couldn't find the command you were looking for.").setColor('UNFOUND')
        let success = new p.embed().setColor('SUCCESS')
        
        //If args less than 1 send unfound embed
        if(p.args.length < 1) return p.send(unfound)
        //Command object
        let command = p.commands[p.args[0]]
        //If no command send unfound embed
        if(!command) return p.send(unfound)
        //Command name
        let name = command.alias[0]
        //If user level is less than command level return
        if(p.level < p.levels[command.permLevel]) return;
        //If command is help or command return
        if(name == 'help' || name == 'command') return
        //Find guild command schema
        let data = await p.mongo.queryOne("command", p.msg.guildId, {_id: p.msg.guild.id, disabled: [name]}, true)//Find data
        //If just created set success description to be disabled
        if(data?.created){
            success.setDescription(`Disabled \`${name}\` for this server.`)
        } else {//Else not just created
            if(!data.disabled.includes(name)){//If the disabled doesn't include the command name
                data.disabled.push(name)//Push name
                success.setDescription(`Disabled \`${name}\` for this server.`)//Set description to disabled
            } else if(data.disabled.includes(name)){//Else if it includes the command
                let cmd = data.disabled.indexOf(name)//Find the command name index
                data.disabled.splice(cmd, 1)//Remove it from the disabled array
                success.setDescription(`Enabled \`${name}\` for this server.`)//Set description to enabled
            }
            await data.save()//Save data
        }
        p.send(success)
    }
})