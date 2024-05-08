const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports.handle = async (main, member) => {
    if(member.guild.id != '495716062097309697') return

    let channel = await member.guild.channels.fetch("1203156522603913237")

    const image = new AttachmentBuilder('./src/assets/GeneralHeart.gif')

    let welcome = new EmbedBuilder().setAuthor({name: member.user.username, iconURL: member.user.displayAvatarURL()})
    .setTitle("Welcome to the Official Gosu(고수) Server")
    .setThumbnail(member.guild.iconURL())
    .addFields({
        name: "​",
        value: "**[Click this link](https://discord.com/channels/495716062097309697/1203156522603913237/1203156603667488888) and Agree to the Rules to join the server!**\n​"
    })
    .setImage("attachment://GeneralHeart.gif")
    .setColor("#820300")
    .setFooter({text: "Thanks for joining! ❤️"})

    channel.send({content: `<@!${member.id}>`, embeds: [welcome], files: [image]}).then(m => setTimeout(() => m.delete().catch(err => console.log(err)), 30000))
}