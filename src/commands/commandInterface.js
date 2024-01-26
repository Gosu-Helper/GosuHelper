module.exports = class CommandInterface{
    /**
     *  alias: Array,
        args: string,
        desc: string,
        related: Array,
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