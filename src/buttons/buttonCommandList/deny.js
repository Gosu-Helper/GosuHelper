const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['deny'],
    permisions: [],
    permLevel: 'User',
    group: [],
    execute: async function(p){
        let deleted = new p.embed().setDescription("Your application for nickname change has been deleted. Please reapply again for a new application.").setColor("ERROR")

        let data = await p.mongo.queryOne("application", p.interaction.user.id)
        if(!data){
            deleted.setDescription("Your application for nickname change has been deleted already. Please reapply again for a new application.")
            return p.interaction.reply({embeds: [deleted], ephemeral: true})
        }

        let applicationSchema = require('../../../Schema/applicationSchema')
        await applicationSchema.deleteOne({_id: p.interaction.user.id})

        p.interaction.reply({embeds: [deleted], ephemeral: true})
    }
})