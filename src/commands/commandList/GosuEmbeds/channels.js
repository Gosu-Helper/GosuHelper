const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['channels'],
    args: '',
    desc: 'Gosu Server Channels',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let channels = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setTitle("Gosu Server Channel List")
            //.setDescription("Check out the FAQs by clicking the button.")
            .addFields(
                {
                    name: "Server Hub", value: "<#1200217121578307657>\n<#1199891939642851378>\n<#1201714240126468116>"
                },
                {
                    name: "Guides", value: "<#1227274859101425857>\n<#1227276632956342332>\n<#1227319743053168660>"
                },
                {
                    name: "Live Streaming", value: "<#495719410032705536>\n<#495718726486720562>"
                },
                {
                    name: "Community Engagement", value: "<#495719344483991582>\n<#740365291510562921>\n<#873973576758345818>"
                },
                {
                    name: "MLBB", value: "<#1066517544380399616>\n<#1047372758897659944>"
                },
                {
                    name: "Community Chat", value: "<#496716663144579082>\n<#495719914875912192>\n<#495735459142434826>\n<#534423531358781441>\n<#720658789832851487>"
                },
                {
                    name: "Support", value: "<#1220221275927089194>\n<#500079487610912791>"
                },
                {
                    name: "Art", value: "<#743516497900601405>\n<#743530207117443131>\n<#743522390516170983>"
                },
                {
                    name: "Music", value: "<#495719472913448981>\n<#1077996447041069076>\n<#1077993500211150908>\n<#495720886666657824>"
                },
                {
                    name: "Game Room", value: "<#497076896199344156>\n<#720090984255586324>\n<#533834316388630539>\n<#534089013116796958>\n<#814180051444170779>\n<#834788888232329246>\n<#834789233642307595>"
                },
                {
                    name: "AFK", value: "<#496763949568622596>"
                }
            )
            .setColor("#FFFEFE")
        p.send(channels)
    }
})