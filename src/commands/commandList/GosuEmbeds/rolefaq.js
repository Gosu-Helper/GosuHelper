const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['rolefaq'],
    args: '',
    desc: 'Gosu General Social Links',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let rolefaq = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setTitle("Server Roles")
            .setDescription("**Gosu Squad**\n\n<@&495727509959344149> | Gosu Squad Leader\n<@&700151699444334652> | Gosu Squad Vice Leader\n<@&874850643855159317> | Members of Gosu Squad\n\n**Admin and Mods**\n\n<@&495718851288236032> | Admin\n<@&496915843364552706> | Server Developer\n<@&874993185959583834> | Head Server Moderator\n<@&495727371140202506> | Server Moderation Team\n<@&874855288522563644> | Stream Moderation Team\n\n**VIPs**\n\n<@&901260527450353685> | Legends (Mostly Retired Staff)\n<@&797932385429487676> | Lovely People Who Subscribe To Membership On YouTube Streams\n<@&832458135544266752> | Lovely People Who Subscribe To Membership On Twitch Streams\n<@&585672404383039530> | Wonderful Server Boosters\n\n**Level Roles**\nBased upon MEE6 `!rank`\n\n<@&542051690195451907> | Level 70\n<@&523184440491638795> | Level 50\n<@&497578834376392724> | Level 30\n<@&687470373331402752> | Level 25\n<@&497491254838427674> | Level 15\n<@&497843968151781378> | Level 5\n<@&659628122756349982> | Can be bought in the shop at <@!292953664492929025>\nOther roles can be obtained upon choosing when leveling up.\n\n**Bot Roles**\n\n<@&875008259818409984> | The Main Important Bots\n<@&875012914371768330> | Normal Play Bots\n<@&875013599167389696> | Music Bots\n\n**Others**\n\n<@&528731175133642782> | YouTuber Role\n<@&496717793388134410> | Obtained upon verifying\n<@&497654614729031681> | People who are subscribed to receive notifications \`|iam subscriber\`\n<@&706932223181324340> | Pings for giveaways \`|iam giveawaypings\`\n<@&875223942749622274> | Members that are muted\n<@&882420393183424542> | Music DJ\n\n__**Please Don\'t Beg For Roles**__\n*Even though some are given out*")
            .setColor("#FFFEFE")
        p.send(rolefaq)
    }
})