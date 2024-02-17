const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['test'],
    args: '(command)',
    desc: "Get bot command list or info.",
    related:["gh ping"],
    permissions:["ModerateMembers"],
    permLevel: 'Bot Owner',
    group:["No"],
    execute: async function(p){
        p.send("Owner only")
    }
})