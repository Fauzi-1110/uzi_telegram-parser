module.exports = (query) => {
    const q = query.message
    const qfc = {}
    
    qfc.clicker = {}
    qfc.clicker.id = query.from.id
    qfc.clicker.first_name = query.from.first_name
    qfc.clicker.username = query.from.username || ""
    
    qfc.msg = {}
    qfc.msg.id = q.message_id
    qfc.msg.time = q.date
    qfc.msg.type = q.photo ? "photo" :
                   q.video ? "video" :
                   q.document ? "document" :
                   q.audio ? "audio" :
                   q.text ? "text" :
                   "undefined type"
    
    qfc.msg.chat = {}
    qfc.msg.chat.id = q.chat.id
    qfc.msg.chat.type = q.chat.type
    qfc.msg.chat.name = q.chat.first_name || q.chat.title
    qfc.msg.chat.username = q.chat.username || ""
    
    // kalau yang dikirim berupa foto
    if(qfc.msg.type == "photo"){
        const ses = q.photo[q.photo.length -1]
        qfc.msg.photo = {}
        qfc.msg.photo.file_id = ses.file_id
        qfc.msg.photo.size_byte = ses.file_size
        qfc.msg.photo.width = ses.width
        qfc.msg.photo.height = ses.height
    }
    
    if(qfc.msg.type == "video"){
        qfc.msg.video = {}
        qfc.msg.video.duration_s = q.video.duration
        qfc.msg.video.width = q.video.width
        qfc.msg.video.height = q.video.height
        qfc.msg.video.size_byte = q.video.file_size
        qfc.msg.video.name = q.video.file_name
        qfc.msg.video.mime_type = q.video.mime_type
        qfc.msg.video.file_id = q.video.file_id
    }
    
    if(qfc.msg.type == "document"){
        qfc.msg.document = {}
        qfc.msg.document.name = q.document.file_name
        qfc.msg.document.mime_type = q.document.mime_type
        qfc.msg.document.file_id = q.document.file_id
        qfc.msg.document.size_byte = q.document.file_size
    }
    
    if(qfc.msg.type == "audio"){
        qfc.msg.audio = {}
        qfc.msg.audio.name = q.audio.file_name
        qfc.msg.audio.performer = q.audio.performer
        qfc.msg.audio.duration_s = q.audio.duration
        qfc.msg.audio.mime_type = q.audio.mime_type
        qfc.msg.audio.file_id = q.audio.file_id
        qfc.msg.audio.size_byte = q.audio.file_size
    }
    
    qfc.query = {}
    qfc.query.id = query.id
    qfc.query.instance = query.chat_instance
    qfc.query.data = query.data
    
    return qfc
}