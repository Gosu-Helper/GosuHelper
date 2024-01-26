const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['levelembed', "levelemb"],
    args: '(level)',
    desc: 'Gosu General Social Links',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let level = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setColor("#fab8cc")
        let setting = 0

        if(p.args.length == 1) p.args[0] == "5" ? setting = 1 : p.args[0] == "15" ? setting = 2 : p.args[0] == "30" ? setting = 3 : p.args[0] == "50" ? setting = 4 : p.args[0] == "colors" || p.args[0] == "color" ? setting = 5 : setting
        else return (display(p, level, setting))
        p.send(display(p, level, setting))
    }
})

function display(p, level, setting){
    if(setting == 0){
        p.send(display(p, level, 4))
        p.send(display(p, level, 3))
        p.send(display(p, level, 2))
        p.send(display(p, level, 1))
    } else if(setting == 1){
        level.setTitle("Level 5").setDescription("<@&497912748357713962> | Worker\n<@&497910079849496588> | Noble")
    } else if(setting == 2){
        level.setTitle("Level 15").setDescription("<@&497491973742133258> | Farmer\n<@&497491650159968259> | Peddler\n<@&497497794622390272> | Soldier\n<@&497579388917776404> | Scholar")
    } else if(setting == 3){
        level.setTitle("Level 30").setDescription("<@&497580312486871040> | Head Farmer\n<@&497582122924507166> | Head Merchant\n<@&497590234435813377> | Colonel\n<@&497582147511517204> | Head Scholar")
    } else if(setting == 4){
        level.setTitle("Level 50").setDescription("<@&497591253144436736> | Landowner\n<@&497582173612670976> | Business Owner\n<@&497593990498222080> | Commander\n<@&497594302818418689> | Philosopher")
    } else level.setTitle("Colors")

    return level
}