const ButtonInterface = require('../buttonInterface')

module.exports = new ButtonInterface({
    alias: ['agree-to-rules'],
    permissions: ['MANAGE_ROLES'],
    permLevel: 'User',
    group: [],
    execute: async function(p){

        let Target = await p.fetchUser(p.client.user.id) //Fetch client from guild

        let user = await p.fetchUser(p.interaction.user.id)

        let role = await p.fetchRole('748956236799672381')

        if(Target.roles.highest.position < role.position) return p.interaction.reply({ content: "Unable to give verify you.", ephemeral: true })

        user.roles.add(role)
        if(user.roles.cache.has(role.id)) return p.interaction.reply({ content: "Succesfully Verified.", ephemeral: true })
        else return p.interaction.reply({ content: "Unable to verify you.", ephemeral: true })
    }
})