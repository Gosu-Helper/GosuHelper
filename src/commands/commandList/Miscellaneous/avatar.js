const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['avatar', 'av'],
    args: '(user)',
    desc: 'Get an own/user avatar.',
    related: ['gh whois'],
    permissions: [],
    permLevel: "User",
    group: ["Miscellaneous"],
    execute: async function(p){
        //Target by mention, id or self
        let Target = (p.msg.mentions.users.first()) ?? p.args.length > 0 ? p.args[0] : p.msg.member.user
        //Fetch guild member
        let Member = await p.fetchUser(Target?.id||Target)
        //If can't find Member return embed "I couldn't find that user."
        if(!Member) return p.send(new p.embed().setDescription("I couldn't find that user.").setColor("UNFOUND"))
        //Avatar embed
        let avatar = new p.embed().setTitle("Avatar").setTimestamp()

        avatar.setAuthor({name: Member.user.username, iconURL: Member.user.displayAvatarURL({dynamic: true})})
            .setImage(`${Member.user.displayAvatarURL({dynamic: true, size: 512})}`)
            .setColor('HEART')
        return p.send(avatar)
    }
})