const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['givemyroles','giveroles'],
    args: '',
    desc: "Returns all the roles that allowed/can be returned.",
    related: ["hns savemyroles", "hns mysavedroles"],
    permissions: ["ManageRoles"],
    permLevel: 'User',
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let success = new p.embed()
            .setAuthor({name: p.msg.author.username, iconURL: p.msg.author.displayAvatarURL({dynamic: true})})
            .setDescription("Successfully returned your saved roles that are allowed to be returned.")
            .setColor('SUCCESS')
        const unable = new p.embed()
            .setAuthor({name: p.msg.author.username, iconURL: p.msg.author.displayAvatarURL({dynamic: true})})
            .setDescription("Unable to find your saved roles, no allowed roles to be returned, or no roles were saved.")
            .setColor('FAILURE')

        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild

        let user = await p.fetchUser(p.msg.author.id)

        let keyPerms = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']
        
        let roles = []

        let roleData = await p.mongo.queryOne("roles", p.msg.guildId, { _id: p.msg.guildId, allowedRoles: [], disallowedRoles: [] })
    
        let data = await p.mongo.queryOne("savedRoles", p.msg.author.id)
    
        for(let i=0; i<data.savedRoles.length; i++){
            let role = await p.fetchRole(data.savedRoles[i])
            if(!role){
                let targetRole = data.savedRoles.indexOf(data.savedRoles[i])
                data.savedRoles.splice(targetRole, 1)
                continue
            }

            let similar = p.fixPerms(keyPerms, role.permissions.toArray())

            if(Target.roles.highest.position < role.position || roleData.disallowedRoles.includes(role.id) || (similar?.length > 0 && !roleData.allowedRoles.includes(role.id)) || role.managed){
                continue
            } else{
                user.roles.add(role)
                roles.push(role.id)
            }
        }

        if(roles.length < 1) return p.send(unable)
        success.addField('Roles Returned', p.toMention("role", roles).join(" "))
        p.send(success)
    }
})