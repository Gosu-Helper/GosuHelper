//0*(57,37,41,32,43,56,39,37)->8,7,6,5,4,3,2,1
//0*(57,56,43,41,39,37,37,32)->8,3,4,6,2,(7&1),5
/*
(5,6)->32+41=73
(1,4)->37+43=80
(7,3)->37+56=93
(2,8)->39+56=95
*/
const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['colorembed', "coloremb", 'colorsembed', 'colorsemb'],
    args: '(color)',
    desc: 'Color Roles',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let level = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setColor("#a900ff")
        let setting = 0

        if(p.args.length == 1) p.args[0] == "1" ? setting = 1 : p.args[0] == "2" ? setting = 2 : p.args[0] == "3" ? setting = 3 : p.args[0] == "4" ? setting = 4 : p.args[0] == "5" || p.args[0] == "default" ? setting = 5 : setting
        else return (display(p, level, setting))
        p.send(display(p, level, setting))
    }
})

function display(p, level, setting){
    if(setting == 0){
        p.send(display(p, level, 1))
        p.send(display(p, level, 2))
        p.send(display(p, level, 3))
        p.send(display(p, level, 4))
        p.send(display(p, level, 5))
        return
    } else if(setting == 1){
        level.setTitle("Color 4").setDescription(":tea:<@&820022069974532129>\n:ocean:<@&820022340594434099>\n:droplet:<@&820022551228710963>\n:coffee:<@&820026984431616051>\n:fog:<@&820027152912089158>\n:cookie:<@&813767512352358470>").setFooter({text:"Requires Color 4"})
    } else if(setting == 2){
        level.setTitle("Color 3").setDescription(":snowflake:<@&820022963687653417>\n:candy:<@&820023274587029544>\n:tulip:<@&820023727433318431>\n:heartbeat:<@&820026375259684934>\n:fish_cake:<@&820026636455378996>\n:chocolate_bar:<@&820026796748832770>").setFooter({text:"Requires Color 3"})
    } else if(setting == 3){
        level.setTitle("Color 2").setDescription(":watermelon:<@&820021275685552128>\n:cherry_blossom:<@&820021548198527042>\n:peach:<@&820021805359300629>\n:crown:<@&820024024083333131>\n:strawberry:<@&820024750838644746>\n:hibiscus:<@&820036044475990087>").setFooter({text:"Requires Color 2"})
    } else if(setting == 4){
        level.setTitle("Color 1").setDescription(":pie:<@&820025241405227012>\n:custard:<@&820025457914675231>\n:four_leaf_clover:<@&820025603373400084>\n:cloud:<@&820025765608554526>\n:mango:<@&820025901836009474>\n:grapes:<@&820026074788134963>").setFooter({text:"Requires Color 1"})
    } else if(setting == 5){
        level.setTitle("Free Colors").setDescription(":heart:<@&820327239467270144>\n:orange_heart:<@&820328618822598657>\n:yellow_heart:<@&820328716571770920>\n:green_heart:<@&820328896820936744>\n:blue_heart:<@&820329131438243911>\n:purple_heart:<@&820329311353176074>").setFooter({text:"Free Colors"})
    }else display(p, level, 0)

    return level
}
//495716062097309697/1201714240126468116/