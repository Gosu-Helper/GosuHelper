const CommandInterface = require("../../commandInterface");
const {DateTime} = require('luxon')

module.exports = new CommandInterface({
    alias: ['roleinfo'],
    args: '[role]',
    desc: 'Get information about a role.',
    related: ['gh serverinfo', 'gh whois'],
    permission: [],
    permLevel: 'User',
    group: ['Miscellaneous'],
    execute: async function(p){
        //Role object
        let role = p.msg.mentions.roles.first() || await p.fetchRole(p.args.length > 0?p.args[0]:null)
        //If can't find role send I couldn't find that role.
        if(!role) return p.send(new p.embed().setDescription("I couldn't find that role.").setColor("UNFOUND"))

        const roleID = role.id//Role ID
        const roleName = role.name//Role name
        const mention = p.toMention("role", roleID)//Role mention
        const location = role.position//Role position
        let perms = p.fixPerms(true, role.permissions.toArray())//Role Key Permissions
        //Role info embed
        let roleinfo = new p.embed()
        .addFields(
            {name: 'ID', value: `${roleID}`, inline: true},
            {name: 'Name', value: `${roleName}`, inline: true},
            {name: 'Color', value: `${role.color===0x0?"None":role.hexColor}`, inline: true}
        )
        .addFields(
            {name: 'Mention', value: `${mention}`, inline: true},
            {name: 'Hoisted', value: `${role.hoist?"Yes":"No"}`, inline: true},
            {name: 'Role Position', value: `${location}`, inline: true}
        )
        .addFields(
            {name: 'Mentionable', value: `${role.mentionable?"Yes":"No"}`, inline: true},
            {name: 'Managed', value: `${role.managed?"Yes":"No"}`, inline: true},
        )
        .setColor(`${role.hexColor}`)
        .setFooter({text: 'Role Created • '+`${DateTime.fromISO(role.createdAt.toISOString()).toLocaleString(DateTime.DATETIME_SHORT)}`})
        //If have key perms add Key Perms embed field
        if(perms) roleinfo.addField('Key Permissions', `${perms.join(", ")}`)

        p.send(roleinfo)
    }
})