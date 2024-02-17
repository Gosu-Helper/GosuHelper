const zws = '​'
const defaultImage = 'https://techyhost.com/wp-content/uploads/2021/06/Discord-logo.png'
const defaultUrl = 'https://discord.gg/gosugeneral'
const Colors = {
    DEFAULT: '0x000000',//Default
    SUCCESS: '0x57f287',//Green
    FAILURE: '0xed4245',//Red
    LENGTH: '0xf1c40f',//Gold
    UNFOUND: '0xeb459e',//Fuchsia
    ERROR: '0xed4245',//Red
    HEART: '0x820300',//Heart
    HEART2: '0x98002e',//Heart2
    INVALID: '0xfee75c',//Yellow
    OBTAIN: '0x5865f2',//Blurple
    OBTAINED: '0x34495e',//Navy
    WIN: '0xe91e63',//Luminous Vivid Pink
    LOST: '0x206694',//Dark Blue
}

Object.freeze(Colors)

module.exports = class Embed {
    constructor(embed){
        this.construct(embed)
    }
    construct(embed){
        for(let key in embed){
            switch(key){
                case 'title': this.setTitle(embed[key]); break;
                case 'description': this.setDescription(embed[key]); break;
                case 'url': this.setUrl(embed[key]); break;
                case 'color': this.setColor(embed[key]); break;
                case 'timestamp': this.setTimestamp(embed[key]); break;
                case 'field': this.addField(embed[key]['name'], embed[key]['value'], embed[key]['inline']); break;
                case 'fields': this.addFields(embed[key]); break;
                case 'thumbnail': this.setThumbnail(embed[key]); break;
                case 'image': this.setImage(embed[key]); break;
                case 'video': this.setVideo(embed[key]); break;
                case 'author': this.setAuthor(embed[key]['name'],embed[key]['iconURL'],embed[key]['url']); break;
                case 'footer': this.setFooter(embed[key]['text'],embed[key]['iconURL']); break;
                default: continue;
            }
        }
        this.type = 'rich'
        this.title = this.title ?? null
        this.description = this.description ?? null
        this.url = this.url ?? null
        this.color = this.color ?? null
        this.timestamp = this.timestamp ?? null
        this.fields = this.fields ?? []
        this.thumbnail = this.thumbnail ?? null
        this.image = this.image ?? null
        this.video = this.video ?? null
        this.author = this.author ?? null
        this.provider = this.provider ?? null
        this.footer = this.footer ?? null
    }
    /**
     * Sets embed title
     * @param {string} title
     * @returns {Embed}
     */
    setTitle(title){
        if(typeof title === 'string'){
            if(title.length > 256){
                title.slice(0, 253)
                this.title = title+"..."
            } else {
                this.title = title
            }
        } else if(title?.length < 1 || !title){
            this.title = zws
        }
        return this
    }
    /**
     * Sets embed description
     * @param {string} desc
     * @returns {Embed}
     */
    setDescription(desc){
        if(typeof desc === 'string'){
            if(desc.length > 4096){
                desc.slice(0, 4093)
                this.description = desc+"..."
            } else {
                this.description = desc
            }
        } else if(desc?.length < 1 || !desc){
            this.description = zws
        }
        return this
    }
    /**
     * Sets embed url
     * @param {string} url
     * @returns {Embed}
     */
    setUrl(url){
        this.url = isValidUrl(url) ? url : defaultUrl
        return this
    }
    /**
     * Sets embed color
     * @param {string|number} color
     * @returns {Embed}
     */
    setColor(color){
        if (typeof color === 'string'){
            if (color === 'RANDOM') color = Math.floor(Math.random() * (0xffffff + 1));
            else{
                let colorOpt = parseInt(Colors[color.toUpperCase()])
                color = Number.isNaN(colorOpt) === false ? colorOpt : parseInt(color.replace('#', ''), 16)
            }
        }
        if (color < 0 || color > 0xffffff || Number.isNaN(color)) color = undefined
        this.color = color ?? null
        return this
    }
    /**
     * Sets embed timestamp
     * @param {Date|string|number} [timestamp=Date.now()]
     * @returns {Embed}
     */
    setTimestamp(timestamp = Date.now()){
        this.timestamp = new Date(timestamp).toISOString() ?? new Date(Date.now()).toISOString()
        if(Number.isNaN(this.timestamp)) this.timestamp = new Date(Date.now()).toISOString()
        return this
    }
    /**
     * Adds embed field
     * @param {string} name
     * @param {string} value
     * @param {boolean} inline
     * @returns {Embed}
     */
    addField(name, value, inline=false){
        return this.addFields({name,value,inline})
    }
    /**
     * Adds embed fields
     * @param {...EmbedFieldData} fields
     * @returns {Embed}
     */
    addFields(...fields){
        if(!this.fields) this.fields = []
        this.fields.push(...this.constructor.normalizeFields(...fields))
        return this
    }

    static normalizeFields(...fields){
        return fields.flat(2).map(field => this.normalizeField(field.name, field.value.replace(/\{zws\}+/g, '​'), typeof field.inline === 'boolean' ? field.inline : false))
    }
    static normalizeField(name, value, inline = false) {
        if(name == ''){
            if(value === true) inline = true
            name = zws
            value = zws
        }
        return {
          name: name,
          value: value,
          inline: inline,
        };
    }
    /**
     * Sets embed thumbnail
     * @param {string} url
     * @returns {Embed}
     */
    setThumbnail(url){
        this.thumbnail = isImage(url) ? {url} : {url: defaultImage}
        return this
    }
    /**
     * Sets embed image
     * @param {string} url
     * @returns {Embed}
     */
    setImage(url){
        this.image = isImage(url) ? {url} : {url: defaultImage}
        return this
    }
    /**
     * Sets embed video
     * @param {string} url
     * @returns {Embed}
     */
    setVideo(url){
        this.video = isValidUrl(url) ? {url} : null
        return this
    }
    /**
     * Sets embed author
     * @param {string|Object} name
     * @param {string} iconURL
     * @param {string} url
     * @returns {Embed}
     */
    setAuthor(name, iconURL, url){
        if(typeof name === 'object' && name !== null){
            let tempname = name.name
            iconURL = name.iconURL
            url = name.url
            this.author = {
                name: tempname==''?zws : tempname?tempname : null,
                iconURL: isImage(iconURL)?iconURL : iconURL==''?defaultImage:null,
                url: isValidUrl(url)?url : iconURL==''?defaultUrl:null
            }
        }else{
            this.author = {
                name: name==''?zws : name?name : null,
                iconURL: isImage(iconURL)?iconURL : iconURL==''?defaultImage:null,
                url: isValidUrl(url)?url : url==''?defaultUrl:null
            }
        }
        return this
    }
    /**
     * Sets embed footer
     * @param {string|Object} text
     * @param {string} iconURL
     * @returns {Embed}
     */
    setFooter(text, iconURL){
        if(typeof text==='object' && text !== null){
            let temptext = text.text
            iconURL = text.iconURL
            this.footer = {
                text: temptext==''?zws : temptext?temptext : null,
                iconURL: isImage(iconURL)?iconURL : iconURL == ''?defaultImage:null
            }
        } else{
            this.footer = {
                text: text==''?zws : text?text : null,
                iconURL: isImage(iconURL)?iconURL : iconURL == ''?defaultImage:null
            }
        }
        return this
    }
    /**
     * Checks if sendable
     * @returns {Embed}
     */
    check(msg, log=false){
        if(!this){
            this.description = "Nothing was sent"
            return this
        }
        if(msg){
            let text = '```js\nEmbed { '
            for(let key in this){
                //Level 1
                if(this[key] === null) text += `\n\t${key}: null,`
                else if(this[key] === undefined) text += `\n\t${key}: undefined,`
                else if(typeof this[key] === 'string') text += `\n\t${key}: "${this[key]}",`
                else if(typeof this[key] === 'number') text += `\n\t${key}: ${this[key]}`
                else if(Array.isArray(this[key])){
                    //Level 2
                    text += `\n\t${key}: [ `
                    for(let i=0; i<this[key].length; i++){
                        //Level 3
                        text += `\n\t\t{`
                        for(let key2 in this[key][i]){
                            if(this[key][i][key2] === null) text += `\n\t\t\t${key2}: null,`
                            else if(typeof this[key][i][key2] === 'string') text += `\n\t\t\t${key2}: "${this[key][i][key2]}",`
                            else if(Array.isArray(this[key][i][key2])) text += `\n\t\t\t${key2}: [${(this[key][i][key2].join(", ")).slice(-1, -2)}],`
                            else if(typeof this[key][i][key2] === 'boolean') text += `\n\t\t\t${key2}: ${this[key][i][key2]},`
                            else if(this[key][i][key2] === undefined) text += `\n\t\t\t${key2}: undefined,`
                            else if(typeof this[key][i][key2] === 'number' || Number.isNaN(this[key][i][key2])) text += `\n\t\t\t${key2}: ${this[key][i][key2]}`
                        }
                        text = text.slice(0, -1)
                        text += `\n\t\t},`
                    }
                    text = text.slice(0,-1)
                    text += `\n\t],`
                }
                else if(typeof this[key] === 'object'){
                    text += `\n\t${key}: { `
                    for(let key2 in this[key]){
                        if(this[key][key2] === null) text += `\n\t\t${key2}: null,`
                        else if(typeof this[key][key2] === 'string') text += `\n\t\t${key2}: "${this[key][key2]}",`
                        else if(typeof this[key][key2] === 'boolean') text += `\n\t\t${key2}: ${this[key][key2]},`
                        else if(Array.isArray(this[key][key2])) text += `\n\t\t${key2}: ${(this[key][key2].join(", ")).slice(-1, -2)}`
                        else if(this[key][key2] === undefined) text += `\n\t\t${key2}: undefined,`
                        else if(typeof this[key][key2] === 'number' || Number.isNaN(this[key][i][key2])) text += `\n\t\t${key2}: ${this[key][key2]},`
                    }
                    text = text.slice(0, -1)
                    text += `\n\t},`
                }
            }
            text = text.slice(0, -1)
            text += '\n}```'
            msg.channel.send(text)
        }
        if(log) console.log(this)
        if(this.fields.length > 0){
            let fieldArr = []
            this.fields.forEach(field => {
                if(!field.name || !field.value){
                    //
                }
                else if(typeof field.name !== 'string' || typeof field.value !== 'string'){
                    //
                }
                else(fieldArr.push({
                    name: field.name,
                        value: field.value,
                        inline: field.inline
                    }))
                })
                if(fieldArr.length < 1){
                    this.fields = []
                } else{
                    this.fields = fieldArr
                }
        }
        if(this.author){
            if((!this.author.name || typeof this.author.name !== 'string')){
                this.author = null
            }
        }
        if(this.footer){
            if((!this.footer.text || typeof this.footer.text !== 'string')&&(this.footer.iconURL || !isImage(this.footer.iconURL))){
                this.footer = null
            }
        }
        if(!this.title&&!this.description&&this.fields.length<1&&!this.thumbnail&&!this.image&&!this.author&&!this.footer){
            this.description = "Nothing was sent"
        }
        return this
    }
}

function isImage(url) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)(\?size=\d+)?$/.test(url) || undefined
}
function isValidUrl(url) {
    try {
      url = new URL(url);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}