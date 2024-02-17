const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ["slowmode","chatrate", "slowchat"],
    args: '(seconds/ON/OFF/MIN/MAX)',
    desc: 'Sets a slowmode for users in the channel.',
    related: ['gh purge'],
    permissions: ["ManageChannels","ManageMessages"],
    permLevel: ['Administrator'],
    group: ["Manager"],
    execute: async function(p){
        p.msg.delete()
        let time = parseInt(p.args[0])
        let option = p.args[0]

        //If args length is 0 or off or on
        if(p.args.length == 0 || option == 'off'){
            return p.msg.channel.setRateLimitPerUser('0')
        } else if(option == 'on'){
            return p.msg.channel.setRateLimitPerUser('3')
        } else if(option == 'min'){
            return p.msg.channel.setRateLimitPerUser('1')
        } else if(option == 'max'){
            return p.msg.channel.setRateLimitPerUser('21600')
        }
        //if time is NaN
        if(Number.isNaN(time)){
            return p.send(new p.embed().setDescription("Enter a valid time/option to set for slowmode.").setColor('INVALID'), 3500)
        } else {//Else set slowmode to time
            if(time > 21600) time = 21600
            p.msg.channel.setRateLimitPerUser(time)
        }
    }
})