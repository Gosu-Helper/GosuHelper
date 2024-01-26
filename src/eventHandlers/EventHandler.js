const requireDir = require('require-dir')
const dir = requireDir('./')

class EventHandler {
    constructor(main){
        let filename = __filename.slice(__dirname.length+1, -3)
        for(let listener in dir){
            if(listener != filename){
                main.client.on(listener, dir[listener].handle.bind(null, main));
            }
            console.log(`[EVENT HANDLER] - File ${listener} was loaded`);
        }
        //console.log(main.client)
    }
}
module.exports = EventHandler