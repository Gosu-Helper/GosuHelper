const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['viewroles', 'view-roles', 'list-roles'],
    args: '(user)',
    desc: "View all allowed and disallowed saved roles for the server/saved roles for user.",
    related: ["gh allow-role", "gh disallow-role"],
    permissions: [],
    permLevel: "Server Moderator",
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let success = new p.embed().setColor('SUCCESS')
        const unfound = new p.embed()
            .setDescription("I couldn't find that user.")
            .setColor("UNFOUND")
        //Fetch rolesSchema
        let data = await p.mongo.queryOne("roles", p.msg.guildId, { _id: p.msg.guildId, allowedRoles: [], disallowedRoles: [] })

        let allowed = data.allowedRoles.length > 0 ? p.toMention('role', data.allowedRoles).join(" ") : 'None'
        let disallowed = data.disallowedRoles.length > 0 ? p.toMention('role', data.disallowedRoles).join(" ") : 'None'

        let Target = (p.msg.mentions.users.first())?.id || p.args.length > 0 ? p.args[0] : null
        let Member = await p.fetchUser(Target)

        if(p.args.length > 0){
            if(Member){
                data = await p.mongo.queryOne("savedRoles", Member.user.id)
                success.setAuthor({name: Member.user.username, iconURL: Member.displayAvatarURL({dynamic: true})})
                success.addField('Saved', p.toMention("role", data.savedRoles).join(" "))
                return p.send(success)
            } else {
                return p.send(unfound)
            }
        }

        success.setDescription(`**Allowed Roles: **\n${allowed}\n**Disallowed Roles:**\n${disallowed}`)
        p.send(success)
    }
})