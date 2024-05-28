const CommandInterface = require("../../commandInterface");
const debugSchema = require('../../../../Schema/debugSchema')

const functionPath = {
    "-servers": {
        "$all": {
            "set": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let values = args.slice(3)
                    if(values.length < 1) return p.send(`No value was given to be set for. \n> ${args.join(" ")}\n`)
    
                    if(instant == "all"){
                        await debugSchema.updateMany({}, { $set: { "servers.all": values[0].toLowerCase() == "true" ? true : false } })
                    }else{
                        data.servers.all = values[0].toLowerCase() == "true" ? true : false
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "off": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let values = args.slice(3)
    
                    if(instant == "all"){
                        await debugSchema.updateMany({}, { $set: { "servers.all": null } })
                        if(values[0]?.toLowerCase() == "&delete") await debugSchema.updateMany({}, { $set: { "servers.some": [] } })
                    }else{
                        data.servers.all = null
                        if(values[0]?.toLowerCase() == "&delete") data.servers.some = []
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            }
        },
        "$some": {
            "set": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let some = await validateArgsForServer(p, data, instant, args)
    
                    if(instant == "all"){
                        await debugSchema.updateMany({}, { $set: { "servers.some": some } })
                    }else{
                        data.servers.some = some
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "add": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let some = await validateArgsForServer(p, data, instant, args)
    
                    let documents = await debugSchema.find()
    
                    if(instant == "all"){
                        for(let document in documents){
                            let filtered = some.filter((server) => !documents[document].servers.some.find((server2) => server2?._id == server?._id))
                            if(filtered.length > 0){
                                filtered.forEach(async (server) => {
                                    let data = await p.mongo.queryOne("debug", documents[document]._id)
                                    data.servers.some.push(server)
                                    await data.save()
                                })
                            }
                        }
                    }else{
                        let filtered = some.filter((server) => !data.servers.some.find((server2) => server2?._id == server?._id))
                        if(filtered.length > 0){
                            filtered.forEach(async (server) => {
                                data.servers.some.push(server)
                                await data.save()
                            })
                        }
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "delete": async function(p, data, instant, args){
                return new Promise(async (resolve) => {
                    let ids = await validIds(p, data, instant, args)
    
                    let documents = await debugSchema.find()
    
                    if(instant == "all"){
                        for(let document in documents){
                            let data = await p.mongo.queryOne("debug", documents[document]._id)
                            for(let id in ids){
                                let index = data.servers.some.findIndex((server) => server._id == ids[id])
                                await debugSchema.updateOne({_id: data._id}, { $pull: { "servers.some": { $in: [ { _id: ids[id], users: data.servers.some[index].users } ] } } })
                            }
                            await data.save()
                        }
                    }else{
                        for(let id in ids){
                            let index = data.servers.some.findIndex((server) => server._id == ids[id])
                            await debugSchema.updateOne({_id: instant}, { $pull: { "servers.some": { $in: [ { _id: ids[id], users: data.servers.some[index].users } ] } } })
                        }
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "off": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let documents = await debugSchema.find()
    
                    if(instant == "all"){
                        for(let document in documents){
                            let data = await p.mongo.queryOne("debug", documents[document]._id)
                            data.servers.some = []
                            await data.save()
                        }
                    }else{
                        data.servers.some = []
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            }
        }
    },
    "-users": {
        "$all": {
            "set": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let values = args.slice(3)
                    if(values.length < 1) return p.send(`No value was given to be set for. \n> ${args.join(" ")}\n`)
    
                    if(instant == "all"){
                        await debugSchema.updateMany({}, { $set: { "users.all": values[0].toLowerCase() == "true" ? true : false } })
                    }else{
                        data.users.all = values[0].toLowerCase() == "true" ? true : false
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "off": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let values = args.slice(3)
    
                    if(instant == "all"){
                        await debugSchema.updateMany({}, { $set: { "users.all": null } })
                        if(values[0]?.toLowerCase() == "&delete") await debugSchema.updateMany({}, { $set: { "users.some": [] } })
                    }else{
                        data.users.all = null
                        if(values[0]?.toLowerCase() == "&delete") data.users.some = []
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            }
        },
        "$some": {
            "set": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let some = await validateArgsForUser(p, data, instant, args)
    
                    if(instant == "all"){
                        await debugSchema.updateMany({}, { $set: { "users.some": some } })
                    }else{
                        data.users.some = some
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "add": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let some = await validateArgsForUser(p, data, instant, args)
    
                    let documents = await debugSchema.find()
    
                    if(instant == "all"){
                        for(let document in documents){
                            let filtered = some.filter((user) => !documents[document].users.some.find((user2) => user2?._id == user?._id))
                            if(filtered.length > 0){
                                filtered.forEach(async (user) => {
                                    let data = await p.mongo.queryOne("debug", documents[document]._id)
                                    data.users.some.push(user)
                                    await data.save()
                                })
                            }
                        }
                    }else{
                        let filtered = some.filter((user) => !data.users.some.find((user2) => user2?._id == user?._id))
                        if(filtered.length > 0){
                            filtered.forEach(async (user) => {
                                data.users.some.push(user)
                                await data.save()
                            })
                        }
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "delete": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let ids = await validIds(p, data, instant, args)
    
                    let documents = await debugSchema.find()
    
                    if(instant == "all"){
                        for(let document in documents){
                            let data = await p.mongo.queryOne("debug", documents[document]._id)
                            for(let id in ids){
                                let index = data.users.some.findIndex((user) => user._id == ids[id])
                                await debugSchema.updateOne({_id: data._id}, { $pull: { "users.some": { $in: [ { _id: ids[id], servers: data.users.some[index].servers } ] } } })
                            }
                            await data.save()
                        }
                    }else{
                        for(let id in ids){
                            let index = data.users.some.findIndex((user) => user._id == ids[id])
                            await debugSchema.updateOne({_id: instant}, { $pull: { "users.some": { $in: [ { _id: ids[id], servers: data.users.some[index].servers } ] } } })
                        }
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            },
            "off": async function(p, data, instant, args, list){
                return new Promise(async (resolve) => {
                    let documents = await debugSchema.find()
    
                    if(instant == "all"){
                        for(let document in documents){
                            let data = await p.mongo.queryOne("debug", documents[document]._id)
                            data.users.some = []
                            await data.save()
                        }
                    }else{
                        data.users.some = []
                        await data.save()
                    }
                    if(list){
                        p.send("Updated to", "", 29000)
                        functionPath["-list"](p, data, instant, "", list)
                    }
                    resolve()
                })
            }
        }
    },
    "-off": async function(p, data, instant, args, list){
        await functionPath["-servers"]["$all"]["off"](p, data, instant, ["-servers","$all","off"], false)
        await functionPath["-users"]["$all"]["off"](p, data, instant, ["-servers","$all","off"], true)
    },
    "-list": async function(p, data, instant, args, list){
        let documents = instant != "all" ? [data] : await debugSchema.find()

        let debug = "```js\nDebug"

        for(let document in documents){
            let data = documents[document]
            debug += `\n\t{`
            if(data._id) debug += `\n\t\t_id: "${data._id}",`
            if(data.servers){
                debug += `\n\t\tservers: {`
                if(data.servers.all == true || data.servers.all == false || data.servers.all == null) debug += `\n\t\t\tall: ${data.servers.all},`
                if(data.servers.some.constructor.name == 'Array'){
                    debug += `\n\t\t\tsome: [ `
                    for(let server in data.servers.some){
                        debug += `\n\t\t\t\t\t{`
                        debug += `\n\t\t\t\t\t\t_id: ${data.servers.some[server]._id},`
                        debug += `\n\t\t\t\t\t\tusers: [`
                        for(let user in data.servers.some[server].users){
                            debug += `\n\t\t\t\t\t\t\t"${data.servers.some[server].users[user]}",`
                        }
                        debug = debug.slice(0,-1)
                        debug += `\n\t\t\t\t\t\t]`
                        debug += `\n\t\t\t\t\t},`
                    }
                    debug = debug.slice(0, -1)
                    debug += `\n\t\t\t]`
                }
                debug += `\n\t\t},`
            }
            if(data.users){
                debug += `\n\t\tusers: {`
                if(data.users.all == true || data.users.all == false || data.users.all == null) debug += `\n\t\t\tall: ${data.users.all},`
                if(data.users.some.constructor.name == 'Array'){
                    debug += `\n\t\t\tsome: [ `
                    for(let user in data.users.some){
                        debug += `\n\t\t\t\t\t{`
                        debug += `\n\t\t\t\t\t\t_id: ${data.users.some[user]._id},`
                        debug += `\n\t\t\t\t\t\tservers: [`
                        for(let server in data.users.some[user].servers){
                            debug += `\n\t\t\t\t\t\t\t\t"${data.users.some[user].servers[server]}",`
                        }
                        debug = debug.slice(0,-1)
                        debug += `\n\t\t\t\t\t\t]`
                        debug += `\n\t\t\t\t\t},`
                    }
                    debug = debug.slice(0, -1)
                    debug += `\n\t\t\t]`
                }
                debug += `\n\t\t}`
            }
            debug += `\n\t}`
            debug += "```"

            p.send(debug,"",30000)

            debug = "```js\nDebug"
        }
    }
}

const numPath = {
    "-servers": {
        "$all": {
            "set": 1,
            "off": 1
        },
        "$some": {
            "set": 'end',
            "add": 'end',
            "delete": 'end',
            "off": 0
        }
    },
    "-users": {
        "$all": {
            "set": 1,
            "off": 1
        },
        "$some": {
            "set": 'end',
            "add": 'end',
            "delete": 'end',
            "off": 0
        }
    },
    "-off": 0,
    "-list": 0
}

module.exports = new CommandInterface({
    alias: ['debug'],
    args: '[all/Number] -[servers/users/off/list] $[all/some] [set/all/delete/off] (true/false/&delete/...args)',
    desc: '\n__For servers if SERVER__\n\nSERVER ALL is TRUE then SOME is the NEGATION of ALL and is the exception\nthen SOME can contain a SERVER object with SOME USERS, or ALL USERS\n\nSERVER ALL is FALSE then SOME is the NEGATION of ALL and is not the exception\nthen SOME can contain a SERVER object with SOME USERS, or ALL USERS\n\n\n__For users if USER__\n\nUSER ALL is TRUE then SOME is the NEGATION of ALL and is the exception\nthen SOME can contain a USER object with SOME SERVERS, or ALL SERVERS\n\nUSER ALL is FALSE then SOME is the NEGATION of ALL and is not the exception\nthen SOME can contain a USER object with SOME SERVERS, or ALL SERVERS\n\n\nSo if SERVER ALL is TRUE then only check for USER ALL is TRUE and the only exceptions are the ones from SOME SERVER and SOME USER\nSo if SERVER ALL is TRUE and if USER ALL is FALSE then ignore it and only check for exceptions from SOME SERVER\nSo if SERVER ALL is FALSE and if USER ALL is TRUE and the only exceptions are the ones from SOME USER\nSo if SERVER ALL is FALSE and if USER ALL is FALSE then there are no exceptions and check for SOME USER that is not the exception\nSo if SERVER ALL is NEUTRAL then only check for USER condition' + 
    '\nSo if USER ALL is NEUTRAL then only check for SERVER condition\n\n\nghdebug all -off\nghdebug 1 -off\nghdebug all -list\nghdebug 1 -list\nghdebug all -servers $all set true\nghdebug all -servers $all set false\nghdebug all -servers $all off\nghdebug all -servers $all off &delete\nghdebug 1 -servers $all set true\nghdebug 1 -servers $all set false\nghdebug 1 -servers $all off\nghdebug 1 -servers $all off &delete\nghdebug all -users $all set true\nghdebug all -users $all set false\nghdebug all -users $all off\nghdebug all -users $all off &delete\nghdebug 1 -users $all set true\nghdebug 1 -users $all set false\nghdebug 1 -users $all off\nghdebug 1 -users $all off &delete\nghdebug all -servers $some set [{"id": "SERVER_1_ID", "users": ["USER_1_ID", "USER_2_ID", ...]}, {"_id": "SERVER_2_ID", "users": ["USER_1_ID", "USER_2_ID", ...]}]\nghdebug all -servers $some add [{},{}]\nghdebug all -servers $some delete [{}, {}]\nghdebug all -servers $some off\nghdebug 1 -servers $some set [{},{}]\nghdebug 1 -servers $some add [{},{}]\nghdebug 1 -servers $some delete [{},{}]\nghdebug 1 -servers $some off\nghdebug all -users $some set [{"id": "USER_1_ID", "servers": ["SERVER_1_ID", "SERVER_2_ID", ...]}, {"_id": "USER_2_ID", "servers": ["SERVER_1_ID", "SERVER_2_ID", ...]}]\nghdebug all -users $some add [{},{}]\nghdebug all -users $some delete [{},{}]\nghdebug all -users $some off\nghdebug 1 -users $some set [{},{}]\nghdebug 1 -users $some add [{},{}]\nghdebug 1 -users $some delete [{},{}]\nghdebug 1 -users $some off\n',
    related: [],
    permissions: [],
    permLevel: 'Bot Owner',
    group: ['No'],
    hidden: true,
    execute: async function(p){
        if(p.msg.author.id != "274909438366973953") return

        require('dotenv').config()

        if(p.args.length < 1) return p.send("No instant(s) were given to adjust.")

        let instant = p.args[0]

        let data = await p.mongo.queryOne("debug", instant)

        if(!data && instant != "all"){
            let response = await p.awaitReply(`I couldn't find the instant #${instant}, would you like to create one?`)
            if(["yes", "y"].includes(response.toLowerCase())) data = await p.mongo.queryOne("debug", instant, { _id: instant, servers: { all: null, some: [] }, users: { all: null, some: [] } })
            else if(["no", "n"].includes(response.toLowerCase())) return p.send("Instant wasn't created.")
        }

        if(!data && instant != "all") return p.send("Error in creating the data.")

        let slicedArgs = p.args.join(" ").split("\n").join(" ").split("|").join("").split(" ").slice(1)

        let invalid = []
        let invalidArgs = ''
        let args = []
        let arg = 0
        let func;

        while(arg < slicedArgs.length){
            if(args.length < 1){
                func = functionPath[slicedArgs[arg]]
                maxArgs = numPath[slicedArgs[arg]]
                args.push(slicedArgs[arg])
            }
            else if(typeof func == 'object'){
                func = func[slicedArgs[arg]]
                maxArgs = maxArgs[slicedArgs[arg]]
                args.push(slicedArgs[arg])
            }
            if(typeof func == 'function'){
                if(maxArgs == 'end') maxArgs = slicedArgs.length - arg - 1

                let count = 0;
                
                arg++
                while(count < maxArgs && arg < slicedArgs.length && functionPath[slicedArgs[arg]] == undefined){
                    args.push(slicedArgs[arg])
                    arg++
                    count++
                }
                await func(p, data, instant, args, false)
                args = []
                arg--
            }
            if(typeof func == 'undefined'){
                while(arg < slicedArgs.length && functionPath[slicedArgs[arg]] == undefined){
                    if(slicedArgs[arg] == "" || slicedArgs[arg] == " " || slicedArgs[arg == "\n"]){
                        arg++
                        continue
                    }
                    invalidArgs += ` ${slicedArgs[arg]}`
                    arg++
                }
                if(invalidArgs != '') invalid.push(invalidArgs)
                invalidArgs = ''
                args = []
                arg--
            }
            arg++;
        }

        if(slicedArgs[slicedArgs.length-1] != "-list") functionPath["-list"](p, data, instant, args, true)

        if(invalid.length > 0) p.send(`Invalid args\n>>> ${invalid.join("\n")}`)
    }
})

async function validateArgsForServer(p, data, instant, args){
    return new Promise((resolve) => {
        let values = args.slice(3)
        if(values.length < 1) return p.send(`No value was given to be set for. \n> ${args.join(" ")}\n`)
        
        let json = (_=> {try { return JSON.parse(`${values.join("")}`) } catch(err){ return null }})()
        if(json?.constructor?.name == 'Object') json = [json]
        else if(!json || !Array.isArray(json) || json.length < 1) return p.send(`Invalid json object passed. \n> ${values.join(" ")}`)

        let invalidArgs = 'Invalid json object passed in array. \n>>> '

        let some = []

        for(let obj in json){
            if(json[obj]?.constructor?.name == 'Array') invalidArgs += `Element #${obj}: \t${json[obj].length == 0 ? "[]" : '["'+json[obj].join('", "')+'"]'}\n`
            else if(json[obj]?.constructor?.name == 'String') invalidArgs += `Element #${obj}: \t"${json[obj]}"\n`
            else if(json[obj]?.constructor?.name != 'Object') invalidArgs += `Element #${obj}: \t${json[obj]}\n`
            else{
                let keys = Object.keys(json[obj])
                if(keys.length != 2 || !(keys.includes("id") || keys.includes("_id")) || !keys.includes("users")) invalidArgs += `Element #${obj}: \t${JSON.stringify(json[obj])}\n`
                else{
                    if((json[obj].id?.constructor?.name != "String" && json[obj]._id?.constructor?.name != "String") || json[obj].users?.constructor?.name != 'Array') invalidArgs += `Element #${obj}: \t${JSON.stringify(json[obj])}\n`
                    else{
                        if(keys.includes("id")){
                            json[obj]["_id"] = json[obj]["id"]
                            json[obj]["user"] = json[obj]["users"]
                            delete json[obj]["id"]
                            delete json[obj]["users"]
                            json[obj]["users"] = json[obj]["user"]
                            delete json[obj]["user"]
                        }

                        if(some.filter((server) => server._id == json[obj]._id).length > 0) continue

                        let invalidUsers = 'Invalid users passed in array for `-servers $some set`. \n>>> '
                        let users = []
                        for(let user in json[obj].users){
                            if(typeof json[obj].users[user] == 'number' || (json[obj].users[user] != "all" && Number.isNaN(parseInt(json[obj].users[user])))){
                                if(json[obj].users[user]?.constructor?.name == 'Array') invalidUsers += `Element #${user}: \t${json[obj].length == 0 ? "[]" : '["'+json[obj].users[user].join('", "')+'"]'}\n`
                                else if(json[obj].users[user]?.constructor?.name == 'Object') invalidUsers += `Element #${user}: \t${JSON.stringify(json[obj].users[user])}\n`
                                else invalidUsers += `Element #${user}: \t${json[obj].users[user]}\n`
                            }
                            else users.push(`${json[obj].users[user]}`)
                        }

                        if(invalidUsers != "Invalid users passed in array for `-servers $some set`. \n>>> ") p.send(invalidUsers)

                        json[obj].users = users

                        some.push(json[obj])
                    }
                }
            }
        }
        
        if(invalidArgs != "Invalid json object passed in array. \n>>> ") p.send(invalidArgs)

        resolve(some)
    })
}

async function validateArgsForUser(p, data, instant, args){
    return new Promise((resolve) => {
        let values = args.slice(3)
        if(values.length < 1) return p.send(`No value was given to be set for. \n> ${args.join(" ")}\n`)
        
        let json = (_=> {try { return JSON.parse(`${values.join("")}`) } catch(err){ return null }})()
        if(json?.constructor?.name == 'Object') json = [json]
        else if(!json || !Array.isArray(json) || json.length < 1) return p.send(`Invalid json object passed. \n> ${values.join(" ")}`)

        let invalidArgs = 'Invalid json object passed in array. \n>>> '

        let some = []

        for(let obj in json){
            if(json[obj]?.constructor?.name == 'Array') invalidArgs += `Element #${obj}: \t${json[obj].length == 0 ? "[]" : '["'+json[obj].join('", "')+'"]'}\n`
            else if(json[obj]?.constructor?.name == 'String') invalidArgs += `Element #${obj}: \t"${json[obj]}"\n`
            else if(json[obj]?.constructor?.name != 'Object') invalidArgs += `Element #${obj}: \t${json[obj]}\n`
            else{
                let keys = Object.keys(json[obj])
                if(keys.length != 2 || !(keys.includes("id") || keys.includes("_id")) || !keys.includes("servers")) invalidArgs += `Element #${obj}: \t${JSON.stringify(json[obj])}\n`
                else{
                    if((json[obj].id?.constructor?.name != "String" && json[obj]._id?.constructor?.name != "String") || json[obj].servers?.constructor?.name != 'Array') invalidArgs += `Element #${obj}: \t${JSON.stringify(json[obj])}\n`
                    else{
                        if(keys.includes("id")){
                            json[obj]["_id"] = json[obj]["id"]
                            json[obj]["server"] = json[obj]["servers"]
                            delete json[obj]["id"]
                            delete json[obj]["servers"]
                            json[obj]["servers"] = json[obj]["server"]
                            delete json[obj]["server"]
                        }

                        if(some.filter((user) => user._id == json[obj]._id).length > 0) continue

                        let invalidServers = 'Invalid servers passed in array for `-users $some set`. \n>>> '
                        let servers = []
                        for(let server in json[obj].servers){
                            if(typeof json[obj].servers[server] == 'number' || (json[obj].servers[server] != "all" && Number.isNaN(parseInt(json[obj].servers[server])))){
                                if(json[obj].servers[server]?.constructor?.name == 'Array') invalidServers += `Element #${server}: \t${json[obj].length == 0 ? "[]" : '["'+json[obj].servers[server].join('", "')+'"]'}\n`
                                else if(json[obj].servers[server]?.constructor?.name == 'Object') invalidServers += `Element #${server}: \t${JSON.stringify(json[obj].servers[server])}\n`
                                else invalidServers += `Element #${server}: \t${json[obj].servers[server]}\n`
                            }
                            else servers.push(`${json[obj].servers[server]}`)
                        }

                        if(invalidServers != "Invalid servers passed in array for `-users $some set`. \n>>> ") p.send(invalidServers)

                        json[obj].servers = servers

                        some.push(json[obj])
                    }
                }
            }
        }
        
        if(invalidArgs != "Invalid json object passed in array. \n>>> ") p.send(invalidArgs)

        resolve(some)
    })
}

async function validIds(p, data, instant, args){
    return new Promise((resolve) => {
        let values = args.slice(3)
        if(values.length < 1) return p.send(`No value was given to be deleted. \n> ${args.join(" ")}\n`)

        let json = (_=> {try { return JSON.parse(`${values.join("")}`) } catch(err){ return null }})()
        if(!json||json?.constructor?.name != 'Array'){
            json = (_=> {try { return JSON.parse(`["${values.join("").split('"').join("").split(",").join('\",\"')}"]`) } catch(err){ return null }})()
            if(!json) return p.send(`Invalid array/list of ids passed. \n> ${values.join(" ")}`)
        }

        if(json?.length < 1) return p.send(`No value was given to be deleted. \n> ${args.join(" ")}\n`)
        
        let invalidIds = `Invalid ids passed in array for \`${args.slice(0,3).join(" ")}\`. \n>>> `
        let ids = []

        for(let id in json){
            if(Number.isNaN(parseInt(json[id])) && json[id] != "all"){
                if(json[id]?.constructor?.name == 'Array') invalidIds += `Element #${id}: \t${json[id].length == 0 ? "[]" : '["'+json[id].join('", "')+'"]'}\n`
                else if(json[id]?.constructor?.name == 'Object') invalidIds += `Element #${id}: \t${JSON.stringify(json[id])}\n`
                else invalidIds += `Element #${id}: \t${json[id]}\n`
            }else ids.push(json[id])
        }

        if(invalidIds != `Invalid ids passed in array for \`${args.slice(0,3).join(" ")}\`. \n>>> `) p.send(invalidIds)

        resolve(ids)
    })
}

/**
 * For servers if SERVER - SERVER ALL is TRUE then SOME is the NEGATION of ALL and is the exception
 *                         then SOME can contain a SERVER object with SOME USERS, or ALL USERS
 * For servers if SERVER - SERVER ALL is FALSE then SOME is the NEGATION of ALL and is not the exception
 *                         then SOME can contain a SERVER object with SOME USERS, or ALL USERS
 * For users if USER     - USER ALL is TRUE then SOME is the NEGATION of ALL and is the exception
 *                         then SOME can contain a USER object with SOME SERVERS, or ALL SERVERS
 * For users if USER     - USER ALL is FALSE then SOME is the NEGATION of ALL and is not the exception
 *                         then SOME can contain a USER object with SOME SERVERS, or ALL SERVERS
 * 
 * USER IS A HIGHER HIERARCHY THAN SERVER
 * 
 * So if SERVER ALL is TRUE then only check for USER ALL is TRUE and the only exceptions are the ones from SOME SERVER and SOME USER
 * So if SERVER ALL is TRUE and if USER ALL is FALSE then ignore it and only check for exceptions from SOME SERVER
 * 
 * So if SERVER ALL is FALSE and if USER ALL is TRUE and the only exceptions are the ones from SOME USER
 * So if SERVER ALL is FALSE and if USER ALL is FALSE then there are no exceptions and check for SOME USER that is not the exception
 * 
 * So if SERVER ALL is NEUTRAL then only check for USER condition
 * So if USER ALL is NEUTRAL then only check for SERVER condition
 * 
 * [all/Number] instant
 * [-] option
 * [$] flag
 * [set/add/delete/off] operation
 * [true/false/&delete/array] value
 * 
 * ghdebug all -off
 * ghdebug 1 -off
 * 
 * ghdebug all -list
 * ghdebug 1 -list
 * 
 * ghdebug all -servers $all set true
 * ghdebug all -servers $all set false
 * ghdebug all -servers $all off
 * ghdebug all -servers $all off &delete
 * ghdebug 1 -servers $all set true
 * ghdebug 1 -servers $all set false
 * ghdebug 1 -servers $all off
 * ghdebug 1 -servers $all off &delete
 * 
 * ghdebug all -users $all set true
 * ghdebug all -users $all set false
 * ghdebug all -users $all off
 * ghdebug all -users $all off &delete
 * ghdebug 1 -users $all set true
 * ghdebug 1 -users $all set false
 * ghdebug 1 -users $all off
 * ghdebug 1 -users $all off &delete
 * 
 * ghdebug all -servers $some set [{},{}]
 * ghdebug all -servers $some add [{}]
 * ghdebug all -servers $some delete [{}, {}]
 * ghdebug all -servers $some off
 * ghdebug 1 -servers $some set [{},{}]
 * ghdebug 1 -servers $some add [{}]
 * ghdebug 1 -servers $some delete [{},{}]
 * ghdebug 1 -servers $some off
 * 
 * ghdebug all -users $some set [{},{}]
 * ghdebug all -users $some add [{}]
 * ghdebug all -users $some delete [{},{}]
 * ghdebug all -users $some off
 * ghdebug 1 -users $some set [{},{}]
 * ghdebug 1 -users $some add [{}]
 * ghdebug 1 -users $some delete [{},{}]
 * ghdebug 1 -users $some off
 * 
 * ghdebug all -servers $all set true -users $all true
 * ghdebug all -servers $all set false -users $all false
 * ghdebug all -servers $all off -users $all off
 * ghdebug all -servers $all off &delete -users $all off &delete
 * ghdebug 1 -servers $all set true -users $all true
 * ghdebug 1 -servers $all set false -users $all false
 * ghdebug 1 -servers $all off -users $all off
 * ghdebug 1 -servers $all off &delete -users $all off &delete
 * 
 * ghdebug all -users $all set true -servers $all true
 * ghdebug all -users $all set false -servers $all false
 * ghdebug all -users $all off -servers $all off
 * ghdebug all -users $all off &delete -servers $all off &delete
 * ghdebug 1 -users $all set true -servers $all true
 * ghdebug 1 -users $all set false -servers $all false
 * ghdebug 1 -users $all off -servers $all off
 * ghdebug 1 -users $all off &delete -servers $all off &delete
 * 
 * ghdebug all -servers $some set [{},{}] -users $some set [{},{}]
 * ghdebug all -servers $some add [{}] -users $some add [{}]
 * ghdebug all -servers $some delete [{}, {}] -users $some delete [{},{}]
 * ghdebug all -servers $some off -users $some off
 * ghdebug 1 -servers $some set [{},{}] -users $some set [{},{}]
 * ghdebug 1 -servers $some add [{}] -users $some add [{}]
 * ghdebug 1 -servers $some delete [{},{}] -users $some delete [{},{}]
 * ghdebug 1 -servers $some off -users $some off
 * 
 * ghdebug all -users $some set [{},{}] -servers $some set [{},{}]
 * ghdebug all -users $some add [{}] -servers $some add [{}]
 * ghdebug all -users $some delete [{},{}] -servers $some delete [{}, {}]
 * ghdebug all -users $some off -servers $some off
 * ghdebug 1 -users $some set [{},{}] -servers $some set [{},{}]
 * ghdebug 1 -users $some add [{}] -servers $some add [{}]
 * ghdebug 1 -users $some delete [{},{}] -servers $some delete [{},{}]
 * ghdebug 1 -users $some off -servers $some off
 */