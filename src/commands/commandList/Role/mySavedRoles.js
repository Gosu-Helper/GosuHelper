const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ["mysavedroles",'msr'],
    args: '',
    desc: "View all your saved roles.",
    related: ["hns savemyroles"],
    permissions: [],
    permLevel: 'User',
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let roleArray = []

        let success = new p.embed()
            .setAuthor({name: p.msg.author.username, iconURL: p.msg.author.displayAvatarURL({dynamic: true})})
            .setColor('SUCCESS')
        const unable = new p.embed()
            .setAuthor({name: p.msg.author.username, iconURL: p.msg.author.displayAvatarURL({dynamic: true})})
            .setDescription("Unable to find your saved roles, or no roles were saved.")
            .setColor('FAILURE')

        let data = await p.mongo.queryOne("savedRoles", p.msg.author.id)
        if(!data || data.savedRoles.length < 1) return p.send(unable)

        for(let i=0; i<data.savedRoles.length; i++){
            let role = await p.fetchRole(data.savedRoles[i])
            if(!role){
                let targetRole = data.savedRoles.indexOf(data.savedRoles[i])
                data.savedRoles.splice(targetRole, 1)
                continue
            }
            roleArray.push(role.id)
        }
        if(roleArray.length < 1) return p.send(unable)

        success.addField('Saved Roles', p.toMention('role', roleArray).join(" "))
        p.send(success)
    }
})