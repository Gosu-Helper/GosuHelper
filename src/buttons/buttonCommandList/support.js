const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['support'],
    permissions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let support = new p.embed()
        .setTitle("Support")
        .addFields(
            {
                name: "Name Change and Self Promotion Role", value: "You can change your nickname or obtain Self Promotion role by applying in <#1220221275927089194>"
            },
            {
                name: "Gosu General Livestreams and/or Server Issues", value: "Any questions related to skin redemption from Twitch, general questions about Gosu General Livestream, or other questions about the server may be asked in <#500079487610912791>"
            },
            {
                name: "Saving Your Roles", value: "You can save your roles in case you leave by using the `ghsavemyroles` command and you can reobtain your roles by using the `ghgivemyroles` command, you can also view the roles you saved by using `ghmysavedroles` in <#497076896199344156>"
            },
            {
                name: "Other Questions", value: "All other questions can be asked in <#500079487610912791> as well."
            }
        )
        .setFooter("We will do our best to assist you.")
        .setColor("HEART")
        p.interaction.reply({embeds: [support], ephemeral: true})
    }
})