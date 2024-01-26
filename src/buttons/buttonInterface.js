module.exports = class ButtonInterface{
    /**
     *  alias: Array,
        desc: string,
        permissions: Array,
        permLevel: String,
        group: Array,
        execute: async function(p){
            //code
        }
        @param {args}
     */
    constructor(args){
        for (let key in args) {
            this[key] = args[key];
		}
    }
}