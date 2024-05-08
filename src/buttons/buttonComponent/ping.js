const ButtonBuilder = require('../../buttonUtils/ButtonBuilder')
    
module.exports = {
    address: ['493164609591574528/1196628188403597495/1197713758097768568'],
    actionRow: {
        name: 'helpRow',
        position: 1
    },
    position: 0,
    buttonData: new ButtonBuilder().setLabel('ping').setStyle(1).setCustomId('ping')
}
/*Required Params => {
    () = optional but required in one form
    address: ['guild.id/channel.id/message.id/(actionRow name|up to you)/(position | int or default 100)']
    (actionRow): {
        name: 'actionRow name',
        (position): int | default 100
    }
    position: int | default 100 => this is for button position in an actionRow array
    buttonData: ButtonBuilder Class
}*/

/*
{
    'message.id': [
        {
            name: 'name',
            position: int,
            components: [
                {
                    'button': ButtonBuilder,
                    position: int
                }
            ]
        }
    ]
}

{
    address: ['guild/channel/message'],
    actionRow: {
        name: 'name',
        position: int
    },
    button: {
        buttonData: new ButtonBuilder(),
        position: int
    }
}

{
    address: ['guild/channel/message/actionRow/Position'],
    button: {
        buttonData: new ButtonBuilder(),
        position: int
    }
}

let array = []
let obj = {}

for(let key in dirComponent){ @key = 0,1,2 => address, actionRow, button
    if(dirComponent[key].address){
        for(let a in dirComponent[key].address){ @a = 0,... => address strings
            let args = dirComponent[key].address[a].split("/") @args = address string split "/"
            if(!obj[args[2]]) obj[args[2]] = [] 
            if(dirComponent[key].actionRow){
                let actionRow = obj[args[2]].find((actionRow) => actionRow.toLowerCase() == dirComponent[key].actionRow.name.toLowerCase())
                if(actionRow){
                    actionRow.position = dirComponent[key].actionRow.position
                    if(!actionRow.components) actionRow.components = []
                    if(actionRow.components.length < 5){
                        actionRow.components.push(dirComponent[key].actionRow)
                    } else {
                        console.log(".")
                    }
                }
                if(dirComponent[key].actionRow.position){

                }
            }
        }
    }
}
*/

/*

{
    'message.id': [

    ]
}

*/