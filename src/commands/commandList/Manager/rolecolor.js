const CommandInterface = require("../../commandInterface");

module.exports = new CommandInterface({
    alias: ['rolecolor'],
    args: 'rolecolor [role] [hexcolor]',
    desc: 'Change the color of a role.',
    related: ['gh roleinfo'],
    permissions: ['ManageRoles'],
    permLevel: 'Administrator',
    group: ['Manager'],
    execute: async function(p){
        const unfound = new p.embed()
            .setDescription("I couldn't find that role.")
            .setColor('UNFOUND')
        const unable = new p.embed()
            .setDescription('That role is above me.')
            .setColor('ERROR')
        const userUnable = new p.embed()
            .setDescription('That role is above you.')
            .setColor('ERROR')
        const invalid = new p.embed()
            .setDescription("Provide a valid color in [hex color](https://www.color-hex.com/).")
            .setColor('INVALID')

        let changed = new p.embed()

        //Fetch client from guild
        let Target = await p.fetchUser(p.client.user.id)

        //if args length is less than 1 return unfound
        if(p.args.length < 1) return p.send(unfound)
        
        //Fetch role from mentinon if not fetch from ID
        let role = p.msg.mentions.roles.first() || await p.fetchRole(p.args[0])
        //If unable to find role return unfound
        if(!role) return p.send(unfound)
        //If args length equals 1 send invalid
        if(p.args.length==1) return p.send(invalid)
        //If role is above user
        if(p.msg.member.roles.highest.position < role.position) return p.send(userUnable)
        //If role is above bot send unable
        if(Target.roles.highest.position < role.position){
            return p.send(unable)
        }

        //Current role color to hex
        let roleColor = `${role.hexColor}`
        let newColor = p.args[1].replace('#', '')//Parse color
        let random = Math.floor(Math.random() * (0xffffff + 1))//Random color
        //If args[1] is random set rolecolor to random
        if(p.args[1] == 'random'){
            newColor = random
        } else if(newColor=='0'){
            p.args[1] = '000000'
            newColor = '000000'
        }
        //If it's not a hex valid hex color
        if (!/[\dA-F]{6}/i.test(newColor) || (p.args[1].length < 6||p.args[1].length > 7)) return p.send(invalid)
        //If roleColor or newColor is transparent set it to transparent
        role.setColor(newColor)
        if(roleColor == '#000000'){
            roleColor = 'transparent'
        }
        if(newColor == '000000'){
            newColor = `transparent`
        } else newColor = newColor.toString(16)

        changed.setDescription(`Changed the role color for <@&${role.id}> from ${roleColor} \nto ${newColor=='transparent'?newColor:'#'+newColor}`).setColor(`#${newColor=='transparent'?'0':newColor}`)

        p.send(changed)
    }
})