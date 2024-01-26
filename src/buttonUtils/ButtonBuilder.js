const ButtonStyle = {
    'primary': 1,
    'secondary': 2,
    'success': 3,
    'danger': 4,
    'link': 5,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5
}

Object.freeze(ButtonStyle)

module.exports = class ButtonBuilder{
    constructor(button){
        this.construct(button)
    }
    construct(button){
        for (let key in button){
            switch(key){
                case 'emoji': this.setEmoji(button[key]); break;
                case 'label': this,setLabel(button[key]); break;
                case 'style': this.setStyle(button[key]); break;
                case 'url': this.setUrl(button[key]); break;
                case 'custom_id': this.setCustomId(button[key]); break;
                default: continue;
            }
        }
        this.data = {
            type: 2,
            emoji: this.emoji ?? undefined,
            label: this.label ?? null,
            style: this.style ?? null,
            custom_id: this.custom_id ?? null
        }
    }

    setEmoji(emoji){
        if(typeof emoji === 'object'){
            this.data.emoji = {
                name: emoji.name ?? null,
                id: emoji.id ?? null
            }
        } else this.data.emoji = undefined
        return this.check()
    }

    setLabel(label){
        if(typeof label === 'string'){
            this.data.label = label
        } else if(!Number.isNaN(label)){
            this.data.label = `${label}`
        } else {
            this.data.label = 'Button'
        }
        return this.check()
    }

    setStyle(style){
        if(typeof style === 'string'){
            this.data.style = ButtonStyle[style.toLowerCase()] ?? 1
        } else if(Number.isInteger(style)){
            this.data.style = (style > 0 || style < 6) ? style : 1
        } else this.data.style = 1
        return this.check()
    }

    setUrl(url){
        this.data,url = isValidUrl(url) ? {url} : null
        return this.check()
    }

    setCustomId(id){
        if(typeof id === 'string'){
            this.data.custom_id = id
        } else this.data.custom_id = null
        return this.check()
    }

    toJSON(){
        return {...this.data}
    }

    check(msg, log=false){
        if(!this){
            ButtonBuilder().setLabel("Button").setStyle(1).setCustomId('default')
        }

        if(this.data.url){
            if(this.data.custom_id) delete this.data.custom_id
            this.data.style = 5
        } else {
            if(!this.data.style) this.data.style = 1
            if(!this.data.custom_id) this.data.custom_id = 'default'
        }

        if(!this.data.label && (!this.data.emoji?.name || !this.data.emoji?.id)) this.data.label = 'Button'

        this.data.type = 2

        return this
    }
}

function isValidUrl(url) {
    try {
      url = new URL(url);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
}