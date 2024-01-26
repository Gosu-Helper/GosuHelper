const ButtonBuilder = require('./ButtonBuilder')

module.exports = class ActionRowBuilder{

    constructor(...components){
        this.data = { 
            type: 1
        }
        this.components = []
        if(components.flat(2).length > 0) this.setComponents(...components)
        return this
    }

    addComponents(...components){
        let flat = components.flat(2)
        for (let button in flat){
            if(flat[button] instanceof ButtonBuilder){
                this.components.push(flat[button])
            }
        }
        return this
    }

    setComponents(...components){
        let set_components = []
        let flat = components.flat(2)
        for (let button in flat){
            if(flat[button] instanceof ButtonBuilder){
                set_components.push(flat[button])
            }
        }
        this.components = set_components
        return this
    }

    toJSON(){
        this.components = this.components.map((component) => component.check())
        return {  
            type: 1,
            ...this
        }
    }
}