const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['force-save'],
    args: '[user]',
    desc: "Force saves an user\'s current roles.",
    related: ["hns view-roles"],
    permission: [],
    permLevel: "Server Moderator",
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let Target = (p.msg.mentions.users.first())?.id || p.args.length > 0 ? p.args[0] : null
        let Member = await p.fetchUser(Target)
        let success = new p.embed()
        .setAuthor({name: Member.user.username, iconURL: Member.displayAvatarURL({dynamic: true})})
        .setDescription(`Successfully saved <@!${Member.id}> **current** roles that are allowed to be saved.`)
            .setColor('SUCCESS')
        const unfound = new p.embed()
            .setDescription("I couldn't find that user.")
            .setColor("UNFOUND")
        const userUnable = new p.embed()
            .setDescription('That user is above you.')
            .setColor('ERROR')
        const unable = new p.embed()
            .setAuthor({name: Member.user.username, iconURL: Member.displayAvatarURL({dynamic: true})})
            .setDescription(`Unable to save <@!${Member.id}> roles or no roles to be saved.`)
            .setColor('FAILURE')


        if(!Member) return p.send(unfound)

        let keyPerms = ['Administrator', 'KickMembers', 'BanMembers', 'ManageChannels', 'ManageGuild', 'ManageMessages', 'ManageRoles', 'ManageGuildExpressions', 'ModerateMembers']

        let roles = []
        let userRoles = Member._roles

        let roleData = await p.mongo.queryOne("roles", p.msg.guildId, { _id: p.msg.guildId, allowedRoles: [], disallowedRoles: [] })

        if(userRoles.length < 1) return p.send(unable)

        //If role is above user
        if(p.msg.member.roles.highest.position <= Member.roles.highest.position) return p.send(userUnable)

        for(let i=0; i<userRoles.length; i++){
            let role = await p.fetchRole(userRoles[i])
            let similar = p.fixPerms(keyPerms, role.permissions.toArray())

            if(roleData.disallowedRoles.includes(role.id) || role.managed){
                continue
            } else if(role.name.toLowerCase().includes("muted") || (similar?.length > 0 && !roleData.disallowedRoles.includes(role.id))){
                const response = await p.awaitReply(`Are you sure you want to add **${role.name}** into their saved roles? y/n\n__${p.fixPerms(keyPerms, role.permissions.toArray()).join(", ")}__`);
                // If they respond with y or yes, continue.
                if(["y", "yes"].includes(response)) {
                    roles.push(role.id)
                    p.send("Allowed")
                } else if(["n", "no"].includes(response)) {
                    p.send("Skipped")
                } else return
            } else{
                roles.push(role.id)
            }
        }
    
        if(roles.length == 0) return p.send(unable)

        let data = await p.mongo.queryOne("savedRoles", Member.id, { _id: Member.id, savedRoles: [] })

        data.savedRoles = roles.reverse()
        await data.save()

        success.addField('Saved', p.toMention("role", roles.reverse()).join(" "))
        p.send(success)
    }
})

