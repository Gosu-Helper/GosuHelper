const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['level-roles'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let embed = new p.embed()
        .setTitle("Level Roles")
        .setDescription("Based upon <@!1194078943888810144> | `ghlevel` in <#497076896199344156> to check your level\nSelf Selectable roles in <#1199891939642851378>\nFor other roles check out this [message](https://discord.com/channels/495716062097309697/1227276632956342332/1227280959221792799) for more info.\n​")
        .addFields(
            {
                name: "Level 5",
                value: "​\n__Self Select__\n<@&497912748357713962> | Worker\n<@&497910079849496588> | Noble\n​"
            },
            {
                name: "Level 10",
                value: "​\n__Given__\n<@&874995842111668244> | Nickname Change Permission\n<@&813410526465490944> | Add Reactions Permission\n​"
            },
            {
                name: "Level 15",
                value: "​\n__Given__\n<@&813420379410399303> | Add Attachments Permission\n\n__Self Select__\n<@&497491973742133258> | Farmer\n<@&497491650159968259> | Peddler\n<@&497497794622390272> | Soldier\n<@&497579388917776404> | Scholar\n​"
            },
            {
                name: "Level 30",
                value: "​\n__Self Select__\n<@&497580312486871040> | Head Farmer\n<@&497582122924507166> | Head Merchant\n<@&497590234435813377> | Colonel\n<@&497582147511517204> | Head Scholar\n​"
            },
            {
                name: "Level 50",
                value: "​\n__Self Select__\n<@&497591253144436736> | Landowner\n<@&497582173612670976> | Business Owner\n<@&497593990498222080> | Commander\n<@&497594302818418689> | Philosopher\n​"
            },
            {
                name: "Level 70",
                value: "​\n__Given__\n<@&820334912690192435> | Pre-Elite Role \n\n__Self Select__\n<@&659628122756349982> | Elite Role"
            }
        )
        .setColor("HEART")
        p.interaction.reply({embeds: [embed], ephemeral: true})
    }
})