const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['welcome'],
    args: '',
    desc: 'Welcome Embed for Gosu Server',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['Gosu Embeds'],
    execute: async function(p){
        let welcome = new p.embed()
            .setAuthor(p.msg.guild.name, p.msg.guild.iconURL())
            .setTitle("Welcome to Gosu(고수) Server")
            .setDescription("Welcome to the official Gosu(고수) server. Gosu General is the largest streamer for Mobile Legends: Bang Bang in North America. Please enjoy your stay within the community while following the rules. If help is needed check out these faqs or you can ask in our support channel <#500079487610912791>\nThank You!\n​")
            .addFields({
                name: "Socials",
                value: "[YouTube](https://www.youtube.com/c/TeamGosu/videos) | [Twitch](https://www.twitch.tv/gosugeneraltv) | [Instagram](https://www.instagram.com/parkjimahn/)|[Facebook](https://www.facebook.com/GosuFamily/) | [Discord](https://discord.gg/xgxD5hB) | discord.gg/gosugeneral"
            }, {
                name: "General's IGN/ID and Group",
                value: "__Main:__ General (18292632)\n__Smurf:__ ​ (46732750)\n\n**Gosu Gang**\n__Group 1:__ 174495\n__Group 2:__ 246146\n__Group 3:__ 615464"
            }, {
                name: "General's Donation and Merch",
                value: "[Merch](https://teespring.com/stores/generaltv) | [Hoodie](https://teespring.com/en/gosu-logo-zip-up-hoodie?view_as=USA) | [Short Sleeve T-Shirt](https://teespring.com/shop/Gosu-logo-tee1)\n[Secret Lab Chair](https://secretlab.co/?rfsn=3472715.0098ca&utm_source=refersion&utm_medium=affiliate&utm_campaign=3472715.0098ca) | [Stream Labs](https://streamlabs.com/teamgosu/tip)\n[YouTube VIP Membership](https://www.youtube.com/sponsor_channel/UCqp8SDQ4WI77KEI7g4IZBfg?app=desktop&noapp=1) | [Twitch Subscription](https://www.twitch.tv/products/gosugeneraltv)"
            })
            .setUrl('https://discord.gg/gosugeneral')
            .setColor("#FFFEFE")
        p.send(welcome)
    }
})