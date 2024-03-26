const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['apply'],
    args: '',
    desc: 'Nick change request and self promotion application.',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let application = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            //.setTitle("Welcome to Gosu(고수) Server")
            //.setDescription("This server abides by the following ToS.\n[Discord's Community Guidelines](https://discordapp.com/guidelines)\n[Discord's Term of Service](https://discordapp.com/terms)\n[MLBB's Terms of Service](https://m.mobilelegends.com/en/newsdetail/473)\n\nServer Rules to Abide by:\n\n**Rule 1 - Respect the channels**\n**Rule 2 - No personal attacks or harassment**\n**Rule 3 - No spamming links, images, mentions, copyapasta etc**\n**Rule 4 - No NSFW/NSFL/Gore or any alluding content**\n**Rule 5 - No Advertising/Unapproved Links**\n**Rule 6 - No writing in caps**\n**Rule 7 - Do not excessively ping any members**\n**Rule 8 - Do not beg for roles/skins/diamonds/currency etc**\n**Rule 9 - Server Guides/FAQ/Rules**\n**Rule 10 - Alternate accounts are not allowed**\n**Rule 11 - Exploitation**\n**Rule 12 - Profiles, Banners, Avatars and About Me**\n**Rule 13 - Drama and Arguments**\n**Rule 14 - Cursed, ear rape and epilepsy content/posts are not allowed**\n**Rule 15 - Third Party Terms of Service**\n**Rule 16 - Problems with Staff**\n**Rule 17 - Staff Discretion**")
            .addField("Nickname Change Request", "To change your nickname, press the nick change request button and type in your new desired nickname. Moderators will verify the nickname and your nickname will be changed once approved.\n​")
            .addField("Self Promotion Application", "To apply to self promote in <#534423531358781441>, press the self promotion application button and state the desired platforms on which you would like to promote. \n**All server rules apply, and if found promoting unapproved sites or contents or others than yourself, moderators have the power to revoke your rights at any time and enforce server rules.** \nTo apply answer the following questions after pressing the button. \nModerators will verify the application and you will obtain a role with the permission to promote in <#534423531358781441> once approved.")
            //.setFooter({text: "P.S. Just have some common sense and it will likely be fine. Extended rules description may be found by clicking \"To Rules\" button. By clicking agree to rules you agree to all terms specified.", iconURL: p.msg.guild.iconURL()})
            .setColor("#FFFEFE")
        p.send(application)
    }
})