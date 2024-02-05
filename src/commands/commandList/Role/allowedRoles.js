const CommandInterface = require('../../commandInterface');

module.exports = new CommandInterface({
    alias: ["allow-role"],
    args: '[role]',
    desc: "Added roles to the allowed saved roles.",
    related: ["disallow-role"],
    permissions: [],
    permLevel: 'Administrator',
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let success = new p.embed()
            .setColor('SUCCESS')
        const unfound = new p.embed()
            .setDescription("I couldn't find that role.")
            .setColor('UNFOUND')
        const userUnable = new p.embed()
            .setDescription('That role is above you.')
            .setColor('ERROR')
        const managed = new p.embed()
            .setDescription('That role is managed externally unable to save.')
            .setColor('ERROR')
        const unable = new p.embed()
            .setDescription('That role is above me.')
            .setColor('ERROR')
        const disallowed = new p.embed()
            .setDescription("That role is saved in disallowed roles. Please remove from disallowed roles and try again.")
            .setColor('FAILURE')
        

        let role = p.msg.mentions.roles.first() || await p.fetchRole(p.args[0]) //Fetch role from mention if not ID
        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild
        let user = await p.fetchUser(p.msg.author.id) //Fetch author from guild
        let keyPerms = ['ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'MANAGE_MESSAGES', 'MANAGE_ROLES', 'MANAGE_EMOJIS_AND_STICKERS', 'MODERATE_MEMBERS']
    
        //If unable to find role return unfound
        if(!role) return p.send(unfound)
    
        let roleID = role.id
        let perms = role.permissions.toArray()
        let similar = p.fixPerms(keyPerms, perms)

        //If role is above user send userUnable
        if(user.roles.highest.position < role.position) return p.send(userUnable)
        //If role is above bot send unable
        if(Target.roles.highest.position < role.position) return p.send(unable)
        //If role is managed return managed
        if(role.managed) return p.send(managed)

        //Fetch rolesSchema
        let data = await p.mongo.queryOne("roles", p.msg.guildId)
        //If no data or data exists and doesn't include roleID add to saved roles
        if(!data) data = await p.mongo.createOne("roles", { _id: p.msg.guildId, allowedRoles: [], disallowedRoles: []})

        if(!data.disallowedRoles.includes(roleID)){
            if(!data.allowedRoles.includes(roleID)){
                if(similar?.length > 0){
                    const response = await p.awaitReply(`This role contains **${similar.join(", ")}** permissions. Are you sure you want to add ${role.name} into saved roles? y/n`)
                    if(["y", "yes"].includes(response)) p.send("Allowed")
                    else return p.send("Cancelled")
                }
                data.allowedRoles.push(roleID)
                success.setDescription(`Added \`${role.name}\` to allowed saved roles.`)
            } else if(data.allowedRoles.includes(roleID)){
                let targetRole = data.allowedRoles.indexOf(roleID)
                data.allowedRoles.splice(targetRole, 1)
                success.setDescription(`Removed \`${role.name}\` from allowed saved roles.`)
            }
        } else{
            return p.send(disallowed)
        }
        await data.save()
        p.send(success)
    }
})