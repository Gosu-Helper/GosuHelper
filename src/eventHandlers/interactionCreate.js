const {ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonStyle, ComponentType} = require('discord.js')

module.exports.handle = async (main, interaction) => {
    
    if(!interaction) console.log("Uh oh no interaction was found")

    if(!interaction.isButton()) return

    //inter.ephemeral = true
    const first = new ButtonBuilder().setLabel('confirm').setStyle(ButtonStyle.Primary).setCustomId('confirm')
    const second = new ButtonBuilder().setLabel('cancel').setStyle(ButtonStyle.Primary).setCustomId('cancel')
    const row = new ActionRowBuilder().addComponents(first, second)
    //let inter = await interaction.reply({ content: "It works!", components: [row]})
    try{
        await main.buttons.execute(interaction)
    } catch(err){
        console.log(err)
    }
    //console.log(interaction)
        //console.log(first)
        //console.log(interaction.user.id)
        /*let reply = await interaction.reply({content: "hi"})
        const collect = reply.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
        })
        collect.on('collect', (i)=>{
            console.log(i.user.id)
            //console.log(interaction.user.id)
        })*/
        /*console.log(interaction.message.id)
        console.log(interaction.customId)
        if(interaction.customId == 'first-button' || interaction.customId == 'second-button' || interaction.customId == 'confirm'){
            const response = await interaction.reply({
                content: `Are you sure you want to ban them for reason: nothing?`,
                components: [row],
                fetchReply: true
            });

            //if(interaction.customId == "confirm") console.log("confirmed")
            console.log(interaction.customId, "interCustomid")
            try {
                const confirmation = await response.awaitMessageComponent({ time: 10_000 });
                console.log(confirmation.customId, "confirmationId")
                if (confirmation.customId === 'confirm') {
                    //await interaction.guild.members.ban(target);
                    await confirmation.update({ content: `They has been banned for reason: nothing`, components: [] });
                } else if (confirmation.customId === 'cancel') {
                    await confirmation.update({ content: 'Action cancelled', components: [] });
                }
            } catch (e) {
                try{
                    await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
                } catch(err){
                    console.log(err)
                }
            }
        } else {
            //
        }*/
        //collect.on
        //console.log(interaction.user.id)
}