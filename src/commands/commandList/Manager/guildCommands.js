const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['commands'],
    args: '',
    desc: 'View all the enabled commands on the server.',
    related: ["gh command", "gh help"],
    permissions: [],
    permLevel: 'User',
    group: ["Info", "Manager"],
    execute: async function(p){
        //Help embed
        let help = new p.embed().setColor("HEART")
        let data = await p.mongo.queryOne("command",p.msg.guildId) || {disabled: []}//Find data else disabled equal empty object
        let text = ""
        for(let module in p.commandGroups){//Iterate through modules
            for(let permLevel in p.commandGroups[module]){//Iterate through permission group names
                for(let commandObj in p.commandGroups[module][permLevel]){//Iterate through array of commands
                    for(let name in p.commandGroups[module][permLevel][commandObj]){//Grabs the name of the command
                        if(p.level < p.levels[permLevel] && p.levels[permLevel] > 5) break//If user level is less than permission group level break
                        if(data.disabled.includes(name)) text += `~~${name}~~ `//If data disabled includes name
                        else text += `\`${name}\` `//If data doesn't include name
                    }
                }
            }
            if(text == "") continue//If there is no commands under that module continue
            help.addField(module, text.substring(0, text.length-1))//New field for all commands under that module
            text = ""//Resets text
        }
        if(help.fields.length == 0) help.setColor('FAILURE').setDescription('No Commands.')//If there is no commands at all
        else help.setTitle("Enabled Command List").setDescription(`Enabled commands on this server.`)//Sets title and description of help embed
        p.send(help)
    }
})