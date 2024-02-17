const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['membercount'],
    desc: "Get the server member count.",
    related: ["gh serverinfo"],
    permission: [],
    permLevel: 'User',
    group: ['Miscellaneous'],
    execute: async function(p){
        let server = p.msg.guild//message guild
        let fetching = new p.embed().setDescription('Fetching info...')//Fetching info embed
        let wait = p.send(fetching)//Sends fetching embed
        let human = await server.members.fetch().then(human => human.filter(member => !member.user.bot).size)//Fetch all humans
        let bot = await server.members.fetch().then(bot => bot.filter(member => member.user.bot).size)//Fetch all bots
        let online = (await server.members.fetch()).filter(member => member.presence?.status === "online").size//Fetch all online including bots
        let idle = (await server.members.fetch()).filter(member => member.presence?.status === "idle").size//Fetch all online including bots
        let dnd = (await server.members.fetch()).filter(member => member.presence?.status === "dnd").size//Fetch all online including bots
        let offline = (await server.members.fetch()).filter(member => !member.presence || member.presence?.status === "offline").size//Fetch anyone without status or offline
        //Count embed
        let count = new p.embed()
            .addField('Members', `${server.memberCount}`)
            .addFields(
                {name: 'Human', value: `:bust_in_silhouette:${human}`, inline: true},
                {name: '​', value: '​', inline: true},
                {name: 'Bot', value: `:robot:${bot}`, inline: true}
            )
            .addFields(
                {name:'Online', value: `<:online:939692639660425217>${online}`, inline: true},
                {name: '​', value: '​', inline: true},
                {name: 'Offline', value: `<:offline:939692660921344100>${offline}`, inline: true},
                {name:'Idle', value: `<:idle:688436257113768057>${idle}`, inline: true},
                {name: '​', value: '​', inline: true},
                {name:'Do Not Disturb', value: `<:dnd:688436211710427170>${dnd}`, inline: true}
            )
            .setColor('RANDOM')
        wait.then(msg => msg.edit({embeds: [count]}))//Edits the wait message with count embed
    }
})