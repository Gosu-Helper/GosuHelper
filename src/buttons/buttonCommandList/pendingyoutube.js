const ActionRowBuilder = require('../../buttonUtils/ActionRowBuilder')
const ButtonInterface = require('../buttonInterface')
const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
const {ComponentType} = require('discord.js')

module.exports = new ButtonInterface({
    alias: ['pending-youtube'],
    permissions: [],
    permLevel: 'Server Moderator',
    cd: 0,
    group: [],
    execute: async function(p){
        let application = p.interaction.message.embeds[0]
        let id = application.footer.text.slice(4, application.footer.text.length)
        let user = await p.fetchUser(id)
        
        if(!user){
            let length = application.fields.length/3
            for(let i = 0; i<length; i++){
                application.fields[i*3+2].value = "User Left"
            }
            
            let applicationSchema = require('../../../Schema/applicationSchema')
            await applicationSchema.deleteOne({_id: p.interaction.user.id})
            
            return p.interaction.message.edit({embeds: [application], components: []})
        }

        let data = await p.mongo.queryOne("application", user?.user?.id)
        
        if(!data){
            let length = application.fields.length/3
            for(let i = 0; i<length; i++){
                application.fields[i*3+2].value = "Application Not Found"
            }

            return p.interaction.message.edit({embeds: [application], components: []})
        }

        let embed = new p.embed().setTitle("Self Promotion Application").setDescription(`<@!${user.user.id}> | ${user.displayName||user.username}`)
        .addFields(
            {
                name: "YouTube", value: `${data?.promotion?.youtube?.link}`, inline: true
            },
            {
                name: `${p.zws}`, value: "", inline: true
            },
            {
                name: `Status`, value: `${data?.promotion?.youtube?.status}`, inline: true
            }
        )
        .setFooter({text: `ID: ${user.user.id}`})
        .setTimestamp()
        .setColor("HEART2")

        if(data?.promotion?.youtube?.status === "In Progress"){
            embed.fields[2].value = `Application In Progress`
            embed.addField(`${p.zws}`, "Unable to approve/deny until user finishes application.")
            return p.interaction.reply({embeds: [embed], ephemeral: true})
        }

        let approve = new ButtonBuilder().setLabel("Approve").setStyle(3).setCustomId('pending-approve')
        let deny = new ButtonBuilder().setLabel("Deny").setStyle(4).setCustomId('pending-deny')
        let actionRow = new ActionRowBuilder().setComponents(approve, deny)

        let reply = await p.interaction.reply({embeds: [embed], components: [actionRow], fetchReply: true, ephemeral: true})

        let proceed = await toProceed(reply)
        if(!proceed) p.commands["disapprove"].execute(p)
        else if(proceed==1) p.commands["approve"].execute(p)
        else p.interaction.editReply({components: []})
    }
})

async function toProceed(reply){
    return new Promise(async (resolve) => {
            try{
                const collector = await reply.createMessageComponentCollector({  ComponentType: ComponentType.Button, max: 1, time: 10000 })

                collector.on('end', async i => {
                    if(i.first()?.customId == 'pending-deny') resolve(0)
                    else if(i.first()?.customId == 'pending-approve') resolve(1)
                    else if(i.size < 1) resolve(2)
                })
            }catch(e){
                resolve(2)
                console.log(e)
            }
        }
    )
}

/*{
    "_id": "274909438366973953",
    "promotion": {
      "_id": "274909438366973953",
      "youtube": {
        "link": "https://youtube.com/TeamGosu",
        "status": "Waiting Approval",
        "confirmed": true,
        "_id": "1224256412264169584"
      },
      "twitch": {
        "link": "https://twitch.tv/gosugenerealtv",
        "status": "Waiting Approval",
        "confirmed": true,
        "_id": "1224256412264169584"
      },
      "tiktok": {
        "link": "https://tiktok.com/@abcdef",
        "status": "Waiting Approval",
        "confirmed": true,
        "_id": "1224256412264169584"
      }
    },
    "__v": 0
  }*/