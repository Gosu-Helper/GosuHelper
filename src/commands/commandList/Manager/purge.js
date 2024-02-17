const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['purge', 'prune'],
    args: '[amount]',
    desc: 'Delete a number of messages from a channel.',
    related: ['gh slowmode'],
    permissions: ['ManageMessages'],
    permLevel: 'Server Moderator',
    group: ['Manager'],
    execute: async function(p){
        //Parse int
        let amount = parseInt(p.args[0])
        //If amount isn't a number send Please enter a valid number of messages to purge.
        if(Number.isNaN(amount) || amount < 1) return p.send(new p.embed().setDescription("Please enter a valid number of messages to purge.").setColor('INVALID')) //If amount is NaN or less than 1 return invalid
        //If amount is more than 100
        if(amount > 100) amount = 100
        //Fetch amount messages and then filter where messages aren't pinned and bulk delete
        p.msg.channel.messages.fetch({ limit: amount+1 }).then(fetched => {
            const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
            p.msg.channel.bulkDelete(notPinned, true);
        })
    }
})