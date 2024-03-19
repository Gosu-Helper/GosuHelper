const CommandInterface = require('../../commandInterface')
const {attachments} = require('discord.js')
const {Font, RankCardBuilder} = require('canvacord')
const levelSchema = require('../../../../Schema/levelSchema')

module.exports = new CommandInterface({
    alias: ['leaderboard', 'lb'],
    args: '(user)',
    desc: "Checks the leaderboard.",
    related:["gh rank", "level"],
    permissions:[],
    permLevel: 'User',
    group:["Leveling"],
    execute: async function(p){
        p.send("In progress")
    }
})