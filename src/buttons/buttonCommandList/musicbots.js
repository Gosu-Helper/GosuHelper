const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['music-bots'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let role = await p.fetchRole("875013599167389696")

        let music = new p.embed()
        .setTitle("Music Bots")
        .setDescription("You can use")
        .addFields(
            {
                name: "Temp Voice Bot", value: "<@!762217899355013120>\n\nCreate a personal temporary music/voice channel by joining the <#1077993500211150908> channel. Temp Voice Bot offers you control over your voice channel in <#1077996447041069076>, where you can select from multiple options. \n\nHere is a list of options it offers: \nName, Limit, Private, Transfer, Region, Trust, Block, Kick, Claim, Thread, Untrust, Unblock, Invite, Waiting Room, Close"
            },
            {
                name: "Ayana Bot", value: "<@!185476724627210241> | Prefix is `=`\n\nMusic player for your voice channel. You can play and stop music by entering the commands in <#495719472913448981> after joining a voice channel. \n\nAvailable music commands are: \njoin, play, leave, nowplaying, queue, remove, removerange, purge, shuffle, play, stop, pause, skip, back, jump, seek, fastforward, rewind, volume, repeat, reset, and more."
            },
            {
                name: "Musical Tune", value: "<@!489076647727857685> | Prefix is `/`\n\nMusic player for your voice channel. You can play and stop music by entering the commands in <#495719472913448981> after joining a voice channel. \n\nAvailable music commands are: join, play, skip, pause, resume, queue, lyrics, now-playing, loop, volume, stop, disconnect, and more.\n"
            },
            {
                name: "Jockie Music", value: "<@!411916947773587456> | Prefix is `m!`\n\nMusic player for your voice channel. You can play and stop music by entering the commands in <#495719472913448981> after joining a voice channel. \n\nAvaialable music commands are: \njoin, play, leave, skip, pause, resume, repeat queue, clear, lyrics, now playing, and more.\n"
            }
        )
        .setFooter("To view more commands on a specific bot type {prefix}help \nPS: remove the brackets {} and replace prefix with the bot's prefix.")
        .setColor(`${role.color.toString(16)||"HEART"}`)
        p.interaction.reply({embeds: [music], ephemeral: true})
    }
})