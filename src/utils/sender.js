const Embed = require('./embed')

exports.send = function(msg){
    return function(content, sep, del, file, opt){
        let maxLength = 2000
        let maxSends = 10
        let sendCount = 0

        if(typeof content === "string"&&content.length>=maxLength){//Content is of type string and the content length is greater than character limit
			let prepend = '';
			let append = '';
			if (opt && opt.split) {//If there is an option to split the content
				prepend = opt.split.prepend ? opt.split.prepend : '';
				append = opt.split.append ? opt.split.append : '';
			}

			let fragments = content.split("\n");//Splits the content according to new lines
			let total = content.startsWith(prepend) ? '' : prepend;//If content startswith prepend turn it into '' else prepend it
			for(let i in fragments){//For loop through fragments
				if(sendCount>=maxSends){
					// Do not send more than 10 messages
				}else if(total.length+fragments[i].length+append.length>=maxLength){//If the current total length + new fragment length is greater than max length
					if(total===""||fragments[i].length>=maxLength){//If the total is "" or the fragment length is greater than max length
                        //If fragment starts with prepend -> current fragment sliced 0,100 else -> prepend + fragment slice 0,100 + if fragment ends with append -> fragment slice -1,-append.length + '...' else '...' + append
                        total = (fragments[i].startsWith(prepend)?fragments[i].slice(0,100):prepend+fragments[i].slice(0,100)) + (fragments[i].endsWith(append)?fragments.slice(-1,-append.length)+'...':'...'+append)
						return createMessage(msg, {title: `Message to long to be sent.`,description:`${total}`, color: 15548997});
					}else{//else the total does not equal "" and fragment length is less than max length
						createMessage(msg, total.endsWith(append) ? total : total + append); //Create a message with the total and if total ends with append keep it else total + append
						total = prepend +"\n"+ fragments[i]; //Reset the total with a new fragment that is confirmed to be less in length than the max length
						sendCount++;
					}
				}else{//If total length+fragment length is not greater than max length keep adding fragments to the total
					total += "\n"+fragments[i];
				}
			}//For loop ends when there is no longer additional fragments
			if(total!==""){//If total does not equal "" send the last fragment remaining
                if(!total.endsWith(append)) total += append
				return createMessage(msg, total, sep, del, file, opt);
			}
		}
		else{//If content type is not of string
			return createMessage(msg, content, sep, del, file, opt)
        }
	}
}

exports.reply = function(msg){
    return function(content, opt){
        let maxLength = 2000
        let maxSends = 10
        let sendCount = 0

        if(typeof content === "string"&&content.length>=maxLength){//Content is of type string and the content length is greater than character limit
			let prepend = '';
			let append = '';
			if (opt && opt.split) {//If there is an option to split the content
				prepend = opt.split.prepend ? opt.split.prepend : '';
				append = opt.split.append ? opt.split.append : '';
			}
			let fragments = content.split("\n");//Splits the content according to new lines
			let total = content.startsWith(prepend) ? '' : prepend;//If content startswith prepend turn it into '' else prepend it
			for(let i in fragments){
				if(sendCount>=maxSends){
					// Do not send more than 10 messages
				}else if(total.length+fragments[i].length+append.length>=maxLength){//If the current total length + new fragment length is greater than max length
					if(total===""||fragments[i].length>=maxLength){//If the total is "" or the fragment length is greater than max length
                        if(fragments.indexOf(fragments[i]) === 1) {
                            return msg.reply(`Message to long to be sent.\n`+`${total}`)
                        }
                        //If fragment starts with prepend -> current fragment sliced 0,100 else -> prepend + fragment slice 0,100 + if fragment ends with append -> fragment slice -1,-append.length + '...' else '...' + append
                        total = (fragments[i].startsWith(prepend)?fragments[i].slice(0,100):prepend+fragments[i].slice(0,100)) + (fragments[i].endsWith(append)?fragments.slice(-1,-append.length)+'...':'...'+append)
						return createMessage(msg, {title: `Message to long to be sent.`,description:`${total}`, color: 15548997});
					}else{
                        if(fragments.indexOf(fragments[i]) === 1) {
                            msg.reply(total.endsWith(append) ? total : total + append)
                            continue
                        }
						createMessage(msg, total.endsWith(append) ? total : total + append);
						total = prepend +"\n"+ fragments[i];
						sendCount++;
					}
				}else{
					total += "\n"+fragments[i];
				}
			}
			if(total!==""){
                if(!total.endsWith(append)) total += append
				return msg.reply(total);
			}
		}
        if(typeof content === 'string' && content){
            return msg.reply(content)
        } else if(!content || typeof content === 'object'){
            return msg.reply(`${content}`)
        }
    }
}

exports.errorMsg = function(msg){
    return function(content, del){
        let contents = {}

        if(typeof content === 'object'){
            if(content.content || content.embeds){
                if(content.content && typeof content.content === 'string'){
                    contents.content = /*"Uh Oh an error has occured...\n"+*/content.content}
                else{ 
                    contents.content = "Uh Oh an error has occured...\n"
                }
                if(content.embeds && typeof content.embeds === 'object') contents.embeds = [content.embeds]
            }
            else {
                //contents.content = "Uh Oh an error has occured..."
                contents.embeds = [content]
            }
        }
        if(typeof content === 'string'){
            return msg.channel.send(/*"Uh Oh an error has occured...\n"+*/content)
        } else {
            try{
                return msg.channel.send(contents).catch(err => console.log(err))
            } catch(err2){
                console.log(err2)
            }
        }
    }
}

function createMessage(msg, content, sep=false, del, file, opt){
    let contents = {}

    if(typeof content === 'object'){//If type of content is object
        if(content.content || typeof content.embeds === 'object'){//If content.content exists or if the type of content.embeds is an object
            if(content.content && typeof content.content === 'string') contents.content = content.content //If content.content exists and is of type string set contents.content equal to content.content
            if(content.embeds && typeof content.embeds === 'object' && !Array.isArray(content.embeds)) contents.embeds = [content.embeds] //If content.embeds exists and is of type object and content.embeds is not of type array set contents.embeds equal to an array of content.embeds
            else if(content.embeds && typeof content.embeds === 'object' && Array.isArray(content.embeds)) contents.embeds = content.embeds
        }
        else {//Else if content passed through is just an embed
            if(content instanceof Embed) content.check() //If the content is an instance of the class Embed check the content for errors
            contents.embeds = [content] //Then set contents.embeds equal to an array of content
        }
    }

    if(file) contents.files = [file] //If file exists set contents.files equal to an array of file

    if(del && Number.isInteger(del)){ //If del exists and the number is an integer
        try{
            if(typeof content === 'string'){//If the type of content solely is a string send the message and delete it after del time or catch and log err
                return msg.channel.send(content).then(m => setTimeout(() => m.delete().catch(err => console.log(err)), del))
            } else { //Else if the content is not solely a string
                try{ //Try and send contents and then delete it after del time or catch and log error
                    return msg.channel.send(contents).then(m => setTimeout(() => m.delete().catch(err2 => console.log(err2)), del))
                } catch(err3){ //If there is an error console.log the error
                    return console.log(err3)
                }
            }
        } catch (err4){ //If there is an error catch and log the error
            console.log(err4)
        }
    } else { //Else if del does not exist
        if(typeof content === 'string'){ //If the content is of type string
            return msg.channel.send(content) //Send the message
        } else { //Else if message is an object
            try{
                if(content.embeds && Array.isArray(content.embeds) && sep) {//If content.embeds exists and is of type array
                    delete contents.embeds
                    if(contents.content || contents.files) msg.channel.send(contents).catch(err => console.log(err))
                    content.embeds.forEach(embed => {createMessage(msg, embed, false)}); //For each embed create
                    return
                }
                if(!contents.embeds&&!contents.content&&!contents.files&&!sep) return console.log("Nothing was sent")
                msg.channel.send(contents).catch(err => console.log(err))
            } catch(err2){
                console.log(err2)
            }
        }
    }
}