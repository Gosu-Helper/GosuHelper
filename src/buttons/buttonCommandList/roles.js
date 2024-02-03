const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['roles'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let embed = new p.embed()
        .setTitle("Roles")
        .setDescription("Selectable roles in <#1201714240126468116>\nFor other roles check out this [message](https://discord.com/channels/495716062097309697/1200217121578307657/1200495702535589998) for more info.\n​")
        .addFields(
            {
                name: "Color 1",
                value: "**Requires <@&813473502312398918> role**\n__Obtainable Colors:__ \n<@&820025241405227012> | <@&820025457914675231> | <@&820025603373400084>\n<@&820025765608554526> | <@&820025901836009474> | <@&820026074788134963>\n​"
            }, {
                name: "Color 2",
                value: "**Requires <@&813473535145934908> role**\n__Obtainable Colors:__ \n<@&820021275685552128> | <@&820021548198527042> | <@&820021805359300629>\n<@&820024024083333131> | <@&820024750838644746> | <@&820036044475990087>\n​"
            }, {
                name: "Color 3",
                value: "**Requires <@&813473575440220181> role**\n__Obtainable Colors:__ \n<@&820022963687653417> | <@&820023274587029544> | <@&820023727433318431>\n<@&820026375259684934> | <@&820026636455378996> | <@&820026796748832770>\n​"
            }, {
                name: "Color 4",
                value: "**Requires <@&813473599226511360> role**\n__Obtainable Colors:__ \n<@&820022069974532129> | <@&820022340594434099> | <@&820022551228710963>\n<@&820026984431616051> | <@&820027152912089158> | <@&813767512352358470>\n​"
            }, {
                name: "Free Colors",
                value: "**Requires <@&496717793388134410> role**\n__Obtainable Colors:__ \n<@&820327239467270144> | <@&820328618822598657> | <@&820328716571770920>\n<@&820328896820936744> | <@&820329131438243911> | <@&820329311353176074>\n​"
            }, {
                name: "Elite",
                value: "**Requires <@&820334912690192435> role**\n__Obtainable Colors:__ \n<@&659628122756349982> and gain access to a new channel.\n​"
            }, {
                name: "Region",
                value: "__Available Region Role:__ \n<@&851237222090932235> | <@&851237285697159178> | <@&851237339610742824>\n​"
            }, {
                name: "Additional Server Roles",
                value: "__Obtainable Roles:__ \n<@&851248038207029300> | To be notified of server related stuff\n<@&706932223181324340> | To be notified of any ongoing giveaways\n<@&497654614729031681> | To be notified of any ongoing streams and YouTube Uploads from Gosu General TV\n<@&1073686758052614204> | To be notified of any MLBB Updates, Events or Leaks"
            }
        )
        .setColor("HEART")
        p.interaction.reply({embeds: [embed], ephemeral: true})
    }
})