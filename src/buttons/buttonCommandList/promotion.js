const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonInterface = require('../buttonInterface')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')

module.exports = new ButtonInterface({
    alias: ['promotion'],
    permissions: [],
    permLevel: 'User',
    cd: 120000,
    group: [],
    execute: async function(p){
        let Target = await p.fetchUser(p.client.user.id)

        let user = await p.fetchUser(p.interaction.user.id)

        let role = await p.fetchRole("717765731139452988")

        let error = new p.embed().setDescription(`Uh oh it seems like I am unable to assign the <@&${role.id}> to you.`).setColor("ERROR")
        let instructions = new p.embed().setTitle("Try Not To Delete This Message").setDescription("**Please select the platform that you are promoting yourself on and provide a link to your channel/profile.** \nFor example: YouTube -> https://youtube.com/TeamGosu\n__Only links are accepted no files.__ \n\n").setColor("OBTAIN")
        let timeUp = new p.embed().setDescription("To continue filling out your application, click promotion button again in 10-15 seconds to continue.").setColor("ERROR")

        if(Target.roles.highest.position < role.position){
            p.interaction.reply({embeds: [error]})
            return end(p, user, role)
        }

        if(user.roles.cache.has(role.id)) return p.interaction.deferUpdate()

        user.roles.add(role)

        let youtube = new ButtonBuilder().setLabel("YouTube").setStyle(2).setCustomId("youtube")
        let twitch = new ButtonBuilder().setLabel("Twitch").setStyle(2).setCustomId("twitch")
        let tiktok = new ButtonBuilder().setLabel("TikTok").setStyle(2).setCustomId("tiktok")
        //let instagram = new ButtonBuilder().setLabel("Instagram").setStyle(2).setCustomId("instagram")
        let actionRow = new ActionRowBuilder().setComponents(youtube, twitch, tiktok)

        p.interaction.reply({embeds: [instructions], components: [actionRow], ephemeral: true}).then(reply => {
            setTimeout(async ()=>{
                p.interaction.editReply({embeds: [timeUp], components: [], ephemeral: true})
                return end(p, user, role, 99)
            }, 105000)
        })
    }
})

function end(p, user, role, amount=1){
    //Fetch amount messages and then filter where messages aren't pinned and bulk delete
    user.roles.remove(role)
    p.interaction.channel.messages.fetch({ limit: amount }).then(fetched => {
        const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
        if(notPinned.size) p.interaction.channel.bulkDelete(notPinned, true);
    }).catch(err => {return})
}