const CommandInterface = require('../../commandInterface')

module.exports = new CommandInterface({
    alias: ['ping', 'pong','ms'],
    args: '',
    desc: "Get bot ping.",
    related:["hns info"],
    permissions:[],
    permLevel: 'User',
    group:["Info"],
    execute: async function(p){
        p.send("Ping!").then(m =>{ //Sends Ping!
            let ping = Date.now() - m.createdTimestamp //Edits from current time minus message created time
            if (ping < 0) ping = m.createdTimestamp - Date.now()
            m.edit(`Pong! \`${ping}ms\``) //Edits message to current ping
        })
    }
})