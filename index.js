const mParsing = require("./myModule/seriMessage.js")

console.log("Terimaskasih telah menggunakan module ini, support terus module ini untuk berkembang lebih baik!")

function qParsingSimple(query){
    const q = query.message
    const qfc = {}
    
    qfc.clicker = {}
    qfc.clicker.id = query.from.id
    qfc.clicker.first_name = query.from.first_name
    qfc.clicker.username = query.from.username || ""
    
    qfc.chat = {}
    qfc.chat.id = query.message.chat.id
    qfc.chat.name = query.message.chat.first_name || query.message.chat.title
    qfc.chat.username = query.message.chat.username
    qfc.chat.type = query.message.chat.type
    
    qfc.msg = {}
    qfc.msg.id = q.message_id
    qfc.msg.time = q.date
    
    qfc.query = {}
    qfc.query.id = query.id
    qfc.query.instance = query.chat_instance
    qfc.query.data = query.data
    
    return qfc
}

//================
//buat entities
//================
function entitiesList(){
    return [
        "bold", "italic", "underline", "strikethrough",
        "spoiler", "code", "pre", "blockquote", 
        "expandable_blockquote", "text_link", "text_mention",
        "mention", "url", "email", "phone_number", "cashtag",
        "hashtag", "bot_command", "custom_emoji"
    ]
}

// buat entities biasa
function cEntities(allText, area, jenis){
    const only = ["bold", "italic", "underline", "strikethrough", "spoiler",
                  "code", "pre", "blockquote", "expandable_blockquote", "mention",
                  "hashtag", "cashtag", "bot_command", "url", "email", "phone_number"]
    if(!only.includes(jenis))throw new Error("Invalid type entities, type entities only: "+only.join(", "))
    const i = allText.indexOf(area)
    if(i === -1)throw new Error("Unknown where is \""+area+"\" in \""+allText+"\"")
    
    return {
        "offset": i,
        "length": area.length,
        "type" : jenis
    }
}

function cEntitiesTextLink(allText, area, url){
    if(!url)throw new Error("url dibutuhkan!")
    const i = allText.indexOf(area)
    if(i === -1)throw new Error("Unknown where is \""+area+"\" in \""+allText+"\"")
    
    
    return {
        "offset": i,
        "length": area.length,
        "type" : "text_link",
        "url": url
    }
}

function cEntitiesTextMention(allText, area, id){
    const i = allText.indexOf(area)
    if(i === -1)throw new Error("Unknown where is \""+area+"\" in \""+allText+"\"")
    
    return {
        "offset": i,
        "length": area.length,
        "type" : "text_mention",
        "user": {
            id: id
        }
    }
}

module.exports = {
    mParsing,
    qParsing: require("./myModule/seriQuery.js"),
    qParsingSimple,
    cParsing: require("./myModule/seriChannel.js"),
    entitiesList,
    cEntities,
    cEntitiesTextLink,
    cEntitiesTextMention,
}