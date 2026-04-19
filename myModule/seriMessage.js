module.exports = async (myBot, m) => {
try{
    let fc = {}
    let temp;
    
    //for global 
    fc.from = m.chat.id //id chat
    
    //message
    fc.msg = {}
    fc.msg.id = m.message_id
    fc.msg.type = m.photo ? "photo" :
                     m.video ? "video" :
                     m.document ? "document" :
                     m.location ? "location" :
                     m.venue ? "venue" :
                     m.poll ? "polling" :
                     m.contact ? "contact" :
                     m.audio ? "audio" :
                     m.animation ? "animation" :
                     m.sticker ? "sticker" :
                     m.voice ? "voice" : 
                     m.video_note ? "video note" :
                     m.dice ? "dice" :
                     m.text ? "text" :
                     "undefined type"
    fc.msg.time = m.date
    fc.msg.text = m.text || m.caption || ""
    if(m.entities) fc.msg.entities = m.entities
    if(m.is_from_offline) fc.msg.offline = true
    
    //chat
    fc.chat_type = m.chat.type
    
    //pribadi pengirim
    fc.sender = {}
    fc.sender.first_name = m.from.first_name
    fc.sender.username = m.from.username || ""
    fc.sender.id = m.from.id
    fc.sender.lang = m.from.language_code
    fc.sender.isBot = m.from.is_bot
    
    if(m.forward_origin){
        fc.forward = {}
        fc.forward.type = m.forward_origin.type
        
        if(fc.forward.type == "user"){
            fc.forward.sender_id = m.forward_origin.sender_user.id
            fc.forward.sender_isBot = m.forward_origin.sender_user.is_bot
            fc.forward.sender_firstname = m.forward_origin.sender_user.first_name
            fc.forward.sender_username = m.forward_origin.sender_user.username || "undefined"
            fc.forward.sender_send_time = m.forward_origin.date
        } else if(fc.forward.type == "hidden_user"){
            fc.forward.sender_username = m.forward_origin.sender_user_name
            fc.forward.sender_send_time = m.forward_origin.date
        } else if(fc.forward.type == "chat"){
            fc.forward.chat_id = m.forward_origin.sender_chat.id
            fc.forward.chat_title = m.forward_origin.sender_chat.title
            fc.forward.chat_send_time = m.forward_origin.date
        } else if(fc.forward.type == "channel"){
            fc.forward.channel_id = m.forward_origin.chat.id
            fc.forward.channel_title = m.forward_origin.chat.title
            fc.forward.channel_message_id = m.forward_origin.message_id
            fc.forward.channel_send_time = m.forward_origin.date
        } else {
            fc.forward.info = "unknown info"
        }
    }
    
    // jika adalah grup
    fc.isGroup = fc.chat_type != "private" || false
    if(fc.chat_type !== "private"){
        fc.group = {}
        fc.group.id = m.chat.id
        fc.group.name = m.chat.title
        fc.group.username = m.chat.username || ""
    }
    
    temp = getDetail(fc, m)
    fc = { ...fc, ...temp }
    
    
    if(m.reply_to_message){
        const r = m.reply_to_message
        fc.reply = {}
        
        fc.reply.msg = {}
        fc.reply.msg.id = r.message_id
        fc.reply.msg.type = r.photo ? "photo" :
                                r.video ? "video" :
                                r.document ? "document" :
                                r.location ? "location" :
                                r.venue ? "venue" :
                                r.poll ? "polling" :
                                r.contact ? "contact" :
                                r.audio ? "audio" :
                                r.animation ? "animation" :
                                r.sticker ? "sticker" :
                                r.voice ? "voice" : 
                                r.video_note ? "video note" :
                                r.dice ? "dice" :
                                r.text ? "text" :
                                "undefined type"
        fc.reply.msg.time = r.date
        fc.reply.msg.text = r.text || r.caption || ""
        if(r.entities) fc.reply.msg.entities = r.entities
        if(r.is_from_offline) fc.reply.msg.offline = true
        
        
        fc.reply.sender = {}
        fc.reply.sender.id = r.from.id
        fc.reply.sender.first_name = r.from.first_name
        fc.reply.sender.username = r.from.username || ""
        
        
        //kalau reply adalah forward message
        if(r.forward_origin){
            fc.reply.forward = {}
            fc.reply.forward.type = r.forward_origin.type
        
            if(fc.reply.forward.type == "user"){
                fc.reply.forward.sender_id = r.forward_origin.sender_user.id
                fc.reply.forward.sender_isBot = r.forward_origin.sender_user.is_bot
                fc.reply.forward.sender_firstname = r.forward_origin.sender_user.first_name
                fc.reply.forward.sender_username = r.forward_origin.sender_user.username || "undefined"
                fc.reply.forward.sender_send_time = r.forward_origin.date
            } else if(fc.reply.forward.type == "hidden_user"){
                fc.reply.forward.sender_username = r.forward_origin.sender_user_name
                fc.reply.forward.sender_send_time = r.forward_origin.date
            } else if(fc.reply.forward.type == "chat"){
                fc.reply.forward.chat_id = r.forward_origin.sender_chat.id
                fc.reply.forward.chat_title = r.forward_origin.sender_chat.title
                fc.reply.forward.chat_send_time = r.forward_origin.date
            } else if(fc.reply.forward.type == "channel"){
                fc.reply.forward.channel_id = r.forward_origin.chat.id
                fc.reply.forward.channel_title = r.forward_origin.chat.title
                fc.reply.forward.channel_message_id = r.forward_origin.message_id
                fc.reply.forward.channel_send_time = r.forward_origin.date
            } else {
                fc.reply.forward.info = "unknown info"
            }
        }
        
        temp = getDetail(fc.reply, r)
        fc.reply = { ...fc.reply, ...temp }
    }
    
    //kasih fungsi tambahan
    fc.replyMsg = async (isi_pesan, ...entities) => {
        await  myBot.sendMessage(fc.from, isi_pesan, {
            reply_to_message_id: fc.msg.id,
            entities: [ ...entities ]
        })
    }
    
    fc.replyMsgV2 = async (isi_pesan, ...entities) => {
        if(entities.length > 0) console.log("WARNING! entities tidak di support pada replyMsgV2 karena teks dapat terpotong!")
        
        const max_long = 3950
        let teks_temp = isi_pesan
        const teks_group = []
        
        while(teks_temp.length >= 3950 || teks_temp.length> 0){
            teks_group.push(teks_temp.slice(0, max_long))
            teks_temp = teks_temp.slice(max_long)
        }

        let i = 0
        for(let v of teks_group){
            await myBot.sendMessage(fc.from, `${v}\n\nPage: ${i+1}/${teks_group.length}`)
            i++
        }
    }
    
    fc.replyMsgPrivate = async (isi_pesan, ...entities) => {
        await myBot.sendMessage(fc.sender.id, isi_pesan, {
            reply_to_message_id: fc.msg.id,
            entities: [ ...entities ]
        })
    }
    
    return fc
}catch (e){
    throw new Error(e.stack)
}
}

//format array fc, callback, 
function getDetail(fc, m){
    const cb = {}
    
    //kalau pesan adalah foto
    if(fc.msg.type == "photo"){
        cb.photo = {}
        let ses = m.photo[m.photo.length - 1]
        cb.photo.file_id = ses.file_id
        cb.photo.size_byte = ses.file_size
        cb.photo.width = ses.width
        cb.photo.height = ses.height
    }
    
    //kalau pesan adalah video
    if(fc.msg.type == "video"){
        cb.video = {}
        cb.video.duration = m.video.duration
        cb.video.height = m.video.height
        cb.video.width = m.video.width
        cb.video.mime_type = m.video.mime_type
        cb.video.file_id = m.video.file_id
        cb.video.size_byte = m.video.file_size
    }
    
    //kalau pesan itu dokumen
    if(fc.msg.type == "document" || fc.msg.type === "animation"){
        cb.doc = {}
        cb.doc.file_name = m.document.file_name
        cb.doc.mime_type = m.document.mime_type
        cb.doc.file_id = m.document.file_id
        cb.doc.size_byte = m.document.file_size
    }

    //location
    if(fc.msg.type == "location"){
        cb.loc = {}
        cb.loc.latitude = m.location.latitude
        cb.loc.longitude = m.location.longitude
        cb.loc.live = m.location.live_period || 0
    }
    
    if(fc.msg.type === "venue"){
        cb.loc = {}
        cb.loc.latitude = m.venue.location.latitude
        cb.loc.longitude = m.venue.location.longitude
        cb.loc.title = m.venue.title
        cb.loc.address = m.venue.address
    }
    
    //kalau polling
    if(fc.msg.type === "polling"){
        //kosong
    }
    
    //contact
    if(fc.msg.type == "contact"){
        cb.contact = {}
        cb.contact.number = m.contact.phone_number
        cb.contact.first_name = m.contact.first_name
        cb.contact.vcard = m.contact.vcard
        cb.contact.user_id = m.contact.user_id
    }
    
    if(fc.msg.type == "audio"){
        cb.audio = {}
        cb.audio.duration = m.audio.duration
        cb.audio.file_name = m.audio.file_name
        cb.audio.mime_type = m.audio.mime_type
        cb.audio.title = m.audio.title
        cb.audio.performer = m.audio.performer
        cb.audio.file_id = m.audio.file_id
        cb.audio.size_byte = m.audio.file_size
    }
    
    if(fc.msg.type === "sticker"){
        cb.sticker = {}
        cb.sticker.emoji = m.sticker.emoji
        cb.sticker.name = m.sticker.set_name
        cb.sticker.animated = m.sticker.is_animated
        cb.sticker.video = m.sticker.is_video
        cb.sticker.type = m.sticker.type
        cb.sticker.height = m.sticker.height
        cb.sticker.width = m.sticker.width
        cb.sticker.file_id = m.sticker.file_id
        cb.sticker.file_size = m.sticker.file_size
    }
    
    if(fc.msg.type === "voice"){
        cb.voice = {}
        cb.voice.mime_type = m.voice.mime_type
        cb.voice.duration = m.voice.duration
        cb.voice.file_id = m.voice.file_id
        cb.voice.file_size = m.voice.file_size
    }
    
    if(fc.msg.type === "video note"){
        cb.video_note = {}
        cb.video_note.duration = m.video_note.duration
        cb.video_note.file_id = m.video_note.file_id
        cb.video_note.file_size = m.video_note.file_size
    }
    
    if(fc.msg.type === "dice"){
        cb.dice = {}
        cb.dice.emoji = m.dice.emoji
        cb.dice.value = m.dice.value
    }

    return cb
}
