const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ["recache-roles"],
    args: '',
    desc: "Recache and removes any unavailable saved server roles.",
    related: ["hns view-roles"],
    permissions: [],
    permLevel: 'Administrator',
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let success = new p.embed()
            .setColor('SUCCESS')

        //Fetch rolesSchema
        let data = await p.mongo.queryOne("roles", p.msg.guildId)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data){
            success.setDescription(`No saved roles found for this server.`)
        } else {//If data does include roleID remove from allowedRoles
            for(let i=0; i<data.allowedRoles.length; i++){
                let targetRole = data.allowedRoles.indexOf(data.allowedRoles[i])
                if(!(await p.fetchRole(data.allowedRoles[i]))) data.allowedRoles.splice(targetRole, 1)
            }
            for(let i=0; i<data.disallowedRoles.length; i++){
                let targetRole = data.disallowedRoles.indexOf(data.disallowedRoles[i])
                if(!(await p.fetchRole(data.disallowedRoles[i]))) data.disallowedRoles.splice(targetRole, 1)
            }
            success.setTitle("Recached Server Saved Roles").setDescription(`**Allowed Roles: **\n${p.toMention("role", data.allowedRoles).join(" ")}\n**Disallowed Roles:**\n${p.toMention("role", data.disallowedRoles).join(" ")}`)
        }

        await data.save()
        p.send(success)
    }
})