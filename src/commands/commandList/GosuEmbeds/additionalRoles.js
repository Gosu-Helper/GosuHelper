const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['serverrolesmb', 'serverrolesembed', 'serveroleemb',, 'serveroleembed'],
    args: '(1|2|3)',
    desc: 'Additional Free Server Roles',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let role = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setColor("#a900ff")
        let setting = 0

        if(p.args.length == 1) p.args[0] == "1" ? setting = 1 : p.args[0] == "2" ? setting = 2 : p.args[0] == "3" ? setting = 3 : setting
        else return (display(p, role, setting))
        p.send(display(p, role, setting))
    }
})

function display(p, role, setting){
    if(setting == 0){
        p.send(display(p, role, 1))
        p.send(display(p, role, 2))
        p.send(display(p, role, 3))
        return
    } else if(setting == 1){
        role.setTitle("Elite").setDescription(":shield:<@&659628122756349982>").setFooter({text:"Requires Pre-Elite"})
    } else if(setting == 2){
        role.setTitle("Region").setDescription(":flag_us:<@&851237222090932235>\n:england:<@&851237285697159178>\n:flag_id:<@&851237339610742824>").setFooter({text:"Free Roles"})
    } else if(setting == 3){
        role.setTitle("Server").setDescription(":gem:<@&851248038207029300>\n:tada:<@&706932223181324340>\n<:Gosu:504519252632403979><@&497654614729031681>\n:bell:<@&1073686758052614204>").setFooter({text:"Free Roles"})
    }else display(p, level, 0)

    return role
}