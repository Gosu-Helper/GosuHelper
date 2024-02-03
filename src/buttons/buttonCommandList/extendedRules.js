const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['extended-rules'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let join = new p.embed()
        .setAuthor(p.interaction.member.guild.name, p.interaction.member.guild.iconURL())
        .setTitle("Welcome to Gosu(고수) Server")
        .setDescription("Go To Rules: <#1200217121578307657>\nThis server abides by the following ToS.\n[Discord's Community Guidelines](https://discordapp.com/guidelines)\n[Discord's Term of Service](https://discordapp.com/terms)\n[MLBB's Terms of Service](https://m.mobilelegends.com/en/newsdetail/473)\n\nServer Rules to Abide by:")
        .addFields({
                name: "Rule 1 - Respect the channels",
                value: "Keep things in their appropriate channels. They exist for a reason, please use them as intended.",
            }, {
                name: "Rule 2 - No personal attacks or harassment",
                value: 'Racism or sexism will not be tolerated. Casual swearing is allowed, although excessive use of swearing/rough language that is deemed offensive by staff will result in a warning/mute/kick/ban in the server.'
            }, {
                name: "Rule 3 - No spamming links, images, mentions, copyapasta etc",
                value: "Spam of any form will get you muted/kicked/banned from the server."
            }, {
                name: "Rule 4 - No NSFW/NSFL/Gore or any alluding content",
                value: "Do not post NSFW/NSFL/Gore or any alluding content of any kind that is not deemed suitable for a public server. This may result for you to get kicked/banned. \nKeep it PG12!"
            }, {
                name: "Rule 5 - No Advertising/Unapproved Links",
                value: "Advertising/Unapproved Links is prohibited in any form of channel with the exception of the dedicated channel, given permission. Such as sending unsolicited invite, advertising other unaffiliated sites/servers is not allowed, sending links through DM without the permission of the user you shared that link with is strictly not allowed. This will result in a kick/ban."
            }, {
                name: "Rule 6 - No writing in caps",
                value: "Do not write in all caps, if it is more than 70% it will be deleted by the bot and excessive use of caps will get you muted."
            }, {
                name: "Rule 7 - Do not excessively ping any members",
                value: "Pinging random members few/multiple times regardless the amount of people mentioned in one or multiple messages is prohibited. **Do not ping the Staffs/Gosu Members/General without reason or given permission.** Only during urgent/emergency issues is one allowed to mention server staff and patiently wait after. All other issues are to be sent in support channel and excessive ping rule applies in most cases unless deemed otherwise. This may result in a warning/mute/kick/ban"
            }, {
                name: "Rule 8 - Do not beg for roles/skins/diamonds/currency etc",
                value: "Begging others to give you/someone else roles/skins/diamonds/currency etc will result in a warning/kick/mute/ban."
            }, {
                name: "Rule 9 - Server Guides/FAQ/Rules",
                value: "Read the server guides/faq/rules before posing simple questions already answered."
            }, { 
                name: "Rule 10 - Alternate accounts are not allowed",
                value: "Alternate accounts on this server to avoid punishment/break rules/grief server/raid etc will result a kick/ban in all accounts owned."
            }, {
                name: "Rule 11 - No Exploitation",
                value: "Exploitation of any form such as hacking/sharing bugs/viruses etc for things such as games/accounts/auto moderation/rules/organism etc will result in kick/ban."
            }, {
                name: "Rule 12 - No Inappropriate Profiles, Banners, Avatars and About Me",
                value: "All profiles, banners, avatars, and about me must follow all given rules listed above and below. This means no obscene/political/racial/sexual stuff on display. As well as promoting links and any others that are deemed unsafe is prohibited. This will result in a permanent mute or kick/ban."
            }, {
                name: "Rule 13 - No Drama and Arguments",
                value: "Keep dramas, arguments and any other type of controversial topics out of the server. This may result in a mute/kick/ban."
            }, {
                name: "Rule 14 - Cursed, ear rape and epilepsy content/posts are not allowed",
                value: "Do not share obnoxious sounds/content that make one uncomfortable. Flashy image/gif/video etc that cause epilepsy is not tolerated. This will result in a warning/mute/kick/ban."
            }, {
                name: "Rule 15 - Third Party Terms of Service",
                value: "Third Party Terms of Services listed or unlisted will be upheld as much as possible. Anything that can get you banned in MLBB/Discord can get you banned here. Not following this may result in a warning/mute/kick/ban."
            }, {
                name: "Rule 16 - Problems with Staff",
                value: "All problems with staff may be sent to <@!274909438366973953> through DMs and will be reviewed."
            }, {
                name: "Rule 17 - Staff Discretion",
                value: "Staff/Dyno may punish a member upon appropriate discretion at any given time."
            }
        )
        .setFooter({text: "P.S. Just have some common sense and it will likely be fine", iconURL: p.interaction.member.guild.iconURL()})
        .setColor("#FFFEFE")
        p.interaction.reply({embeds: [join], ephemeral: true})
    }
})