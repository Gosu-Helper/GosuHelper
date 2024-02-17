const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['help'],
    args: '(command)',
    desc: "Get bot command list or info.",
    related:["gh ping"],
    permissions:[],
    permLevel: 'User',
    group:["Info"],
    execute: async function(p){
        let help = new p.embed({description: "Hi"}).setColor('heart2')
        //No args send all commands
        if(p.args.length < 1) p.send(display(p, help, 0)/*.check(p.msg)*/)
        else if(p.commands[p.args[0]]?.group[0] == "Role" && !(["493164609591574528","495716062097309697","491747726208270338"].includes(p.msg.guildId))) return
        else if(p.commands[p.args[0]]){//If help for a specific command exists
            p.send(display(p, help, 1))
        }//Else send couldn't find that command
        else p.send(display(p, help, 2))
    }
})

function display(p, help, setting){
    if(setting == 0){
        let text = ""
        for(let module in p.commandGroups){//Iterate through modules
            if(module == "Role" && !(["493164609591574528","495716062097309697","491747726208270338"].includes(p.msg.guildId))) continue
            for(let permLevel in p.commandGroups[module]){//Iterate through permission group names
                for(let commandObj in p.commandGroups[module][permLevel]){//Iterate through array of commands
                    for(let name in p.commandGroups[module][permLevel][commandObj]){//Grabs the name of the command
                        if(p.level < p.levels[permLevel] && p.levels[permLevel] > 5) break//If user level is less than permission group level and command permLevel is greater than Lv5 -> break
                        if(p.commands[name]["gosu"] && !(["493164609591574528","495716062097309697","491747726208270338"].includes(p.msg.guildId))) continue //If the command is only within gosu servers
                        text += "`" + name + "`, "
                    }
                }
            }
            if(text == "") continue//If there is no commands under that module continue
            help.addField(module, text.substring(0, text.length-2))//New field for all commands under that module
            text = ""//Resets text
        }//If there is no commands at all
        if(help.fields.length == 0) help.setColor('FAILURE').setDescription('No Commands.')//Sets title for command list
        else help.setTitle("Command List").setDescription(`Here is the list of commands! \nFor more info on a specific command, use \`${p.prefix} help {command}\`\nFor command usage remove brackets when typing:\n> \`(input)\` = Optional user input\n> \`[input]\` = Required user input\nInput in capitals are input options for the command\n(They do not need to be typed in capitals).`)
    } else if(setting == 1){//Specific command
        let cmd = p.commands[p.args[0]]//Grabs the command object
        let alias, name, related//Initiates all variables
        //If user level is lower than command level send couldn't find the command
        if(p.level < p.levels[cmd.permLevel] && p.levels[cmd.permLevel] > 5) return  help.setColor('UNFOUND').setDescription('I couldn\'t find the command you were looking for.')
        if(cmd.alias.length > 0){
            name = cmd.alias[0]//Set the name
            alias = cmd.alias.filter(function(_elem, i){ return i !== 0}).join(", ") || 'None'
            related = cmd.related.length > 0 ? cmd.related.join(", ") : null//If there is related commands
        }
        help.setTitle(`Command: ${p.prefix}${name}`).setDescription(`**Aliases: **${alias}\n**Description: ** ${cmd.desc}\n**Usage: **${p.prefix} ${name} ${cmd.args?cmd.args:''}\n**Cooldown: **${cmd.cd/1000||"3"}s\n${related != null?"**Related: **"+related: ''}`)
    } else{
        help.setColor('UNFOUND').setDescription('I couldn\'t find the command you were looking for.')
    }
    return help
}