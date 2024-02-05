const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['disallow-role'],
    args: '[role]',
    desc: "Added roles to the disallowed saved roles.",
    related: ["hns allow-role", "hns view-roles"],
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
        const allowed = new p.embed()
            .setDescription("That role is saved in allowed roles. Please remove from allowed roles and try again.")
            .setColor('FAILURE')

        let role = p.msg.mentions.roles.first() || await p.fetchRole(p.args[0]) //Fetch role from mention if not ID
        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild
        let user = await p.fetchUser(p.msg.author.id) //Fetch author from guild

        //If unable to find role return unfound
        if(!role) return p.send(unfound)
    
        let roleID = role.id
        
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

        if(!data.allowedRoles.includes(roleID)){
            if(!data.disallowedRoles.includes(roleID)){
                data.disallowedRoles.push(roleID)
                success.setDescription(`Added \`${role.name}\` to disallowed saved roles.`)
            } else if(data.disallowedRoles.includes(roleID)){
                let targetRole = data.allowedRoles.indexOf(roleID)
                data.disallowedRoles.splice(targetRole, 1)
                success.setDescription(`Removed \`${role.name}\` from disallowed saved roles.`)
            }
        } else{
            return p.send(allowed)
        }
        await data.save()
        p.send(success)
    }
})