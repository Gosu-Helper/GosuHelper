const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['invite', 'inv'],
    args: '',
    desc: "Get bot ping.",
    related:["hns info"],
    permissions:[],
    permLevel: 'Bot Owner',
    group:["Info"],
    execute: async function(p){
        p.msg.delete()
        p.send("[Invite The Bot](https://discord.com/oauth2/authorize?client_id=1194078943888810144&scope=bot&permissions=2617764982)", "", 3000)
    }
})