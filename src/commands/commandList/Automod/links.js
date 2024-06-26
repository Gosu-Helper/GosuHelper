const commandInterface = require('../../commandInterface')

module.exports = new commandInterface({
    alias: ['Link'],
    args: '',
    desc: '',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Automod'],
    hidden: true,
    execute: async function(p){
        let flag = 0

        if((p.msg.content.match(/(discord\.gg)\/(\w+)/g)?.length > 0) && !(p.msg.content.includes('discord.gg/gosugeneral')||p.msg.content.includes('discord.gg/xgxD5hB'))) flag = 1
        else if(p.msg.content.toLowerCase().includes("only fans")||p.msg.content.toLowerCase().includes("onlyfans")) flag = 1
        else if((p.msg.content.includes("http")||p.msg.content.match(/(https?:\/\/)?(www\.)?(\w+)\.(\w+)\/(\w)+/g)?.length>0) && (p.msg.content.includes("@here")||p.msg.content.includes("@everyone"))) flag = 1

        let data = await p.mongo.queryOne("level", p.msg.author.id)
        if(data&&flag==1){
            if(data.level >= 15) flag = 0
        }

        return flag
    }
})