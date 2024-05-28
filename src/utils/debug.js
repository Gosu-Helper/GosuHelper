module.exports = async function debug(main, event){
    return new Promise(async (resolve) => {
        require('dotenv').config()

        let flag = 0
        let data = await main.mongo.queryOne("debug", process.env.INSTANT)

        if(data){
            if(data.servers.all === true){
                flag = 1
                if(data.servers.some.length > 0){
                    let serverFilter = data.servers.some.filter((server) => server._id == event.guild.id)
                    if(serverFilter.length > 0){
                        if(serverFilter[0].users.includes(event.user.id) || serverFilter[0].users.includes("all")) flag = 0
                    }
                    if(data.users.all == true){
                        let userFilter = data.users.some.filter((user) => user._id == event.user.id)
                        if(userFilter.length > 0){
                            if(userFilter[0].servers.includes(event.guild.id) || userFilter[0].servers.includes("all")) flag = 0
                        }
                    }
                }
            }else if(data.servers.all === false){
                if(data.servers.some.length > 0){
                    let serverFilter = data.servers.some.filter((server) => server._id == event.guild.id)
                    if(serverFilter.length > 0){
                        let userFilter = data.users.some.filter((user) => user._id == event.user.id)
                        if(serverFilter[0].users.includes(event.user.id) || serverFilter[0].users.includes("all")) flag = 1
                        if(userFilter.length > 0){
                            if(userFilter[0].servers.includes(event.guild.id) || userFilter[0].servers.includes("all")){
                                if(data.users.all === true) flag = 0
                                else if(data.users.all === false) flag = 1
                            }
                        }
                    }
                }
            }else{
                if(data.servers.all === null){
                    let userFilter = data.users.some.filter((user) => user._id == event.user.id)
                    if(data.users.all === true){
                        flag = 1
                        if(userFilter[0]?.servers.includes(event.guild.id) || userFilter[0]?.servers.includes("all")) flag = 0
                    }else if(data.users.all === false){
                        flag = 0
                        if(userFilter[0]?.servers.includes(event.guild.id) || userFilter[0].servers.includes("all")) flag = 1
                    }
                }
            }
        }

        resolve(flag)
    })
}