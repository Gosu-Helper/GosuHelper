const {DateTime} = require('luxon')
const CommandInterface = require('../../commandInterface')
const permission = require('../../../data/permissions')

module.exports = new CommandInterface({
    alias: ['automod'],
    args: '',
    desc: '',
    related: [],
    permissions: ["KickMembers"],
    permLevel: 'Bot Owner',
    group: ['Automod'],
    hidden: true,
    execute: async function(p){
        let automod = new p.embed()
            .setColor("ERROR")
            .setAuthor(p.msg.author.username, p.msg.author.displayAvatarURL())
            .setDescription(`**Message sent by <@!${p.msg.author.id}> deleted in <#${p.msg.channel.id}>**\n\n${p.msg.content}`)
            .setFooter(`Author: ${p.msg.author.id} | Message: ${p.msg.id} • Today at ${DateTime.fromISO(p.msg.createdAt.toISOString()).toLocaleString(DateTime.TIME_SIMPLE)}`)
        let automodCase = new p.embed()
            .setColor("ERROR")
            .setAuthor(`Kick | ${p.msg.author.username}`, p.msg.author.displayAvatarURL())
            .addFields(
                {name: "User", value: `<@!${p.msg.author.id}>`, inline: true},
                {name: "Moderator", value: `<@!${p.client.user.id}>`, inline: true},
            )
            .setFooter(`ID: ${p.msg.author.id} • Today at ${DateTime.fromISO(p.msg.createdAt.toISOString()).toLocaleString(DateTime.TIME_SIMPLE)}`)
        let channel = await p.fetchChannel('495719174530924545')
        let modCaseChannel = await p.fetchChannel('570934383121399808')
        let Target = await p.fetchUser(p.client.user.id)
        let user = await p.fetchUser(p.msg.author.id)
        
        for(let commandObj in p.commandGroups['Automod']['Bot Owner']){//Iterate through array of commands
            for(let name in p.commandGroups['Automod']['Bot Owner'][commandObj]){
                if(name == "automod") continue
                if(await p.commands[name].execute(p)){
                    try{
                        automod.addField("Reason", name)
                        channel.send({embeds: [automod]})
                        if(name == "Link"){
                            
                            if(!Target.permissions.has(p.Permissions.KickMembers)) return
                            else if(Target.roles.highest.position < user.roles.highest.position) return

                            await user.kick()
                            automodCase.addField("Reason", name, true)
                            modCaseChannel.send({embeds: [automodCase]})

                            let levelSchema = require('../../../../Schema/levelSchema')
                            await levelSchema.deleteOne({_id: p.msg.author.id})
                        }

                        p.msg.delete()
                        return 1;
                    }catch(err){
                        return 0;
                    }
                }
            }
        }

        return 0;
    }
})