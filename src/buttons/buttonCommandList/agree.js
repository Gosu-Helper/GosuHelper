const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['agree-to-rules'],
    permissions: ['ManageRoles'],
    permLevel: 'User',
    group: [],
    cd: 5000,
    execute: async function(p){

        let error = new p.embed().setDescription("Unable to verify you.").setColor("ERROR")

        let success = new p.embed().setDescription("Successfully verified.").setColor("SUCCESS")

        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild

        let user = await p.fetchUser(p.interaction.user.id)

        let agree_to_rules = await p.fetchRole('823535883054743644')

        let friend = await p.fetchRole('496717793388134410')

        if(user.roles.cache.has(friend.id)) return p.interaction.deferUpdate()

        try {
            if(Target.roles.highest.position < friend.position || Target.roles.highest.position < agree_to_rules.position) return p.interaction.reply({ embeds: [error], ephemeral: true })
            await user.roles.remove(agree_to_rules)
            await user.roles.add(friend).then((user) => {
                if(user.roles.cache.has(friend.id)) return p.interaction.reply({ embeds: [success], ephemeral: true })
                else return p.interaction.reply({ embeds: [error], ephemeral: true })
            })
        } catch(err){
            console.log(err)
            return p.interaction.reply({ embeds: [error], ephemeral: true })
        }
    }
})