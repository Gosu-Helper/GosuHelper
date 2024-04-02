const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['denied'],
    permisions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let deleted = new p.embed().setDescription("Your application for nickname change has been deleted. Please reapply again for a new application.").setColor("ERROR")
        let apply = await p.fetchChannel("717770672125902860")

        let data = await p.mongo.queryOne("application", p.interaction.user.id)
        if(!data){
            deleted.setDescription("Your application for nickname change has been deleted already. Please reapply again for a new application.")
            return p.interaction.reply({embeds: [deleted], ephemeral: true})
        }

        try{
            apply.messages.fetch(data.nickname._id).then(fetched => {
                fetched.delete()
            }).catch(err => {
                return
            })
        }catch(err){
            return
        }

        let applicationSchema = require('../../../Schema/applicationSchema')

        if(!data?.promotion?.youtube&&!data?.promotion?.tiktok&&!data?.promotion?.youtube){
            await applicationSchema.deleteOne({_id: p.interaction.user.id})
        }else{
            await applicationSchema.updateOne({_id: p.interaction.user.id}, { $unset: { nickname: {} } })
        }

        if(p.interaction.replied) p.interaction.editReply({embeds: [deleted], components: [], ephemeral: true})
        else p.interaction.reply({embeds: [deleted], ephemeral: true})
    }
})