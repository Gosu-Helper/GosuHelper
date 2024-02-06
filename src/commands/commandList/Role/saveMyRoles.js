const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['savemyroles', 'saveroles','smr'],
    args: '',
    desc: "Saves your current roles.",
    cd: 10000,
    related: ["hns mysavedroles"],
    permissions: [],
    permLevel: 'User',
    group: ["Role"],
    gosu: true,
    execute: async function(p){
        let keyPerms = ["Administrator","KickMembers","BanMembers","ManageChannels","ManageGuild","ManageMessages","ManageRoles","ManageGuildExpressions","ModerateMembers",p.Permissions.Administrator, p.Permissions.KickMembers, p.Permissions.BanMembers, p.Permissions.ManageChannels, p.Permissions.ManageGuild, p.Permissions.ManageMessages, p.Permissions.ManageRoles, p.Permissions.ManageGuildExpressions, p.Permissions.ModerateMembers]
        
        
        let success = new p.embed().setAuthor({name: p.msg.author.username, iconURL: p.msg.author.displayAvatarURL({dynamic: true})}).setDescription("Successfully saved your **current** roles that are allowed to be saved.").setColor('SUCCESS')
        const unable = new p.embed().setAuthor({name: p.msg.author.username, iconURL: p.msg.author.displayAvatarURL({dynamic: true})}).setDescription("Unable to save your roles or no roles to be saved.").setColor('FAILURE')
        
        let roleData = await p.mongo.queryOne("roles", p.msg.guildId)
        let roles = []
        p.msg.member.roles.cache.forEach(role => {
            let similar = p.fixPerms(keyPerms, role.permissions.toArray())
            if(roleData.disallowedRoles.includes(role.id) || (similar?.length > 0 && !roleData.allowedRoles.includes(role.id))  || role.managed) {/**/}
            else if(role.name.toLowerCase().includes("muted")) roles.push("muted")
            else roles.push(role.id)
        });
        roles = roles.slice(0, -1)//Remove @everyone role

        if(roles.includes("muted") || roles.length == 0) return p.send(unable)
    
        let data = await p.mongo.queryOne("savedRoles", p.msg.author.id, { _id: p.msg.author.id, savedRoles: [] })
        data.savedRoles = roles
        await data.save()

        success.addField('Saved', p.toMention("role", roles).join(" "))
        p.send(success)
    }
})