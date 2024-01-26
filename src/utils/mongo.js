/**
 * findOne(file, id, create)
 * @param {String} file 
 * @param {String} id 
 * @param {Object|Boolean} create 
 * @returns 
 */

async function findOne(file, id, create=false, opt=false){
    try{
        const schema = require(`../../Schema/${file}Schema`)
        let data;
        try{
            if(typeof id === 'object'){
                data = await schema.findOne(id)
            } else {
                data = await schema.findOne({ _id: id})
            }
            if(data) return data
            else return null
        } catch (err){
            console.log(err)
            return null
        }
    } catch(err2){
        console.log(err2)
        return null
    }
}

async function queryOne(file, id, create, opt=false){
    try{
        const schema = require(`../../Schema/${file}Schema`)
        let data;
        try{
            if(typeof id === 'object'){
                data = await schema.findOne(id)
            } else{
                data = await schema.findOne({ _id: id })
            }
            if(data) return data
            else {
                if(create){
                    data = await createOne(schema, create, id, opt)
                    return data
                } else return null
            }
        } catch (err){
            console.log(err)
            return null
        }
    } catch(err2){
        console.log(err2)
        return null
    }
}
/**
 * save(data)
 * @param {Object} data 
 */
async function save(data){
    await data.save()
}
/**
 * createOne(file, create, id)
 * @param {String} file 
 * @param {Boolean|Object} create 
 * @param {String} id 
 * @returns 
 */
async function createOne(file, create=false, id=null, opt=false){
    try{
        const schema = typeof file === 'string' ? require(`../../Schema/${file}Schema`) : file
        if(!schema) return null

        if(create === true&&id!=null){//createOne("prefix",true,"guildId") -> returns an object { data: { _id: guildId }, created: true }
            return {data: await schema.create({ _id: id }), created: true}
        }
        else if(typeof create === 'object'&&!id&&!opt) return await schema.create(create)//createOne("prefix", { _id: "guildId, newPrefix: "gh" }) -> returns data itself { _id: guildId, newPrefix: "gh" }
        else if(typeof create === 'object' && opt){//createOne("prefix", { _id: "guildId", newPrefix: "gh" }, "", true) -> returns an object { data: { _id: guildId, newPrefix: "gh" }, created: true}
            return {data: await schema.create(create), created: true}
        } else return await schema.create(create)//createOne("prefix", { _id: guildId, newPrefix: "gh"}) -> returns data itself { _id: guildId, newPrefix: "gh" }
    } catch(err){
        console.log(err)
        return null
    }
}

module.exports = {findOne, queryOne, save, createOne}