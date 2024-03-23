const CommandInterface = require("../../commandInterface");
const {DateTime} = require('luxon')

module.exports = new CommandInterface({
    alias: ['whois'],
    args: '[user]',
    desc: "Get user information.",
    related:["gh roleinfo"],
    permissions:[],
    permLevel: 'User',
    group:["Miscellaneous"],
    execute: async function(p){
        //Target by mention, id or self
        let Target = (p.msg.mentions.users.first())?.id ?? p.args.length > 0 ? p.args[0] : p.msg.member.user.id
        //Fetch guild member
        let Member = await p.fetchUser(Target)
        //If can't find Member return embed "I couldn't find that user."
        if(!Member) return p.send(new p.embed().setDescription("I couldn't find that user.").setColor("UNFOUND"))
        //roles array with role id
        let roles = []
        Member.roles.cache.sort((p, c) => c.position - p.position).forEach(role => {
            roles.push(role.id)
        });
        roles = roles.slice(0, -1)//Remove @everyone role

        let rolecolor = '000000'//Default rolecolor for embed color
        let perms = p.fixPerms(true, Member.permissions.toArray()) ?? ''//Fix member perms if exist or set to ''
        //If user has more than one role, turn into mention and fetch the highest role position color for embed color
        if(roles.length > 0){
            roles = p.toMention("role", roles)
            rolecolor = (await p.fetchRole(roles[0])).color.toString(16)
        } else roles = "None"//Else roles = "None"
        //Create embed
        let user = new p.embed()
            .setAuthor({name: Member.user.username, iconURL: Member.user.displayAvatarURL({dynamic: true})})
            .setThumbnail(Member.user.displayAvatarURL({dynamic: true}))
            .setDescription(`<@!${Member.user.id}>`)
            .addField("Joined", `${DateTime.fromISO(Member.joinedAt.toISOString()).toLocaleString(DateTime.DATETIME_SHORT)}`)
            .addField(`Roles [${typeof roles === 'string'?0:roles.length}]`, `${Array.isArray(roles)?roles.join(" "):'None'}`)
            .setColor(`#${rolecolor}`)
            .setFooter({text: Member.user.id})
            .setTimestamp()
        //If user has Key Permissions add a new embed field
        if(perms) user.addField("Key Permissions", `${perms.join(", ")}`)

        p.send(user)
    }
})