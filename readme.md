# uzi_telegram-parser
module ini digunakan untuk mempermudah berbagai kegunaan dari event pesan yang ada di Telegram, bukan hanya parser saja, tetapi banyak fungsi lain yang masih bisa anda coba!

## Daftar Isi
- [cara install](#cara-menginstal)
- [penggunaan parse](#penggunaan-parse)
  - [event message](#event-message)
  - [event query](#event-query)
- [membuat entities]()
  - [entities biasa]()
  - [entities text_link]()
  - [entities text_mention]()
- [reply message]()
  - [dengan entities]()
  - [tanpa entities]()

## cara menginstal
``` javascript
npm i uzi_telegram-parser
```

## penggunaan parse
module ini memiliki beberapa parse, yaitu:
- event .on("message")
- event .on("callback_query")
- event .on("channel_post")

## event message
disini pada bagian .on("message") kamu bisa memanggilnya dengan cara:
```
const parser = require("uzi_telegram-parser")
const botApi = require("node-telegram-bot-api")
const Client = new botApi(YOUR_TOKEN, {polling: true})

Client.on("message", async (m) => {
    const fc = await parser.mParsing(Client, m) //menyimpan return dari fungsi mParsing ke dalan variabel fc
    
    console.log(JSON.stringify(fc, null, 4)) //log untuk melihat semua isi data
})
```

Contoh Ouput (jika tipe text): 
```javascript
{
    from: 123456789,
    message: {
        id: 3,
        type: "text",
        time: 392738282,
        text: "hello, ini adalah package parser",
    }
    chatType: "private",
    user: {
        first_name: "Uzi",
        username: "uziDev",
        id: 87654321,
        lang: "id",
        is_bot: false,
    }
}
```

Contoh diatas merupakan pemanggilan fungsi dasar pada event .on("message") yang dapat mempermudah. Tetapi apakah package ini memberikan semua type chat? Tidak!
Type chat yang akan ada dalam callback diantaranya adalah: 

1. photo
2. video
3. document
4. contact
5. audio
6. text

Lalu bagaimana dengan sisanya? Sisanya akan masuk ke dalam tipe "undefined type"

## event Query
Pada bagian parser ini, terdapat 2 jenis, yaitu simple dan lengkap.
contoh simple: 
```
Client.on("callback_query", async(m) => {
    const qfc = await parser.queryParsingSimple(m)
    
    console.log(JSON.stringify(qfc, null, 4))
})
```
contoh Output: 
```
{
    clicker: {
        id: 8765321,
        first_name: "uzi",
        username: "uziDev"
    },
    msg: {
        id: 34,
        time: 32168373
    },
    query: {
        id: 287474839292873,
        instance: 0122819332,
        data: "callback datanya"
    }
}
```

atau ingin lebih lengkap?, maka kamu bisa gunakan:
```
const qfc = await qParsing(m)
```

Bukan hanya ada **parser** saja, tetapi ada berbagai function yang dapat mempermudah kamu! diantaranya:

## membuat entities
Pada function ini dapat mempermudah kamu dalam membuat entities
function yang ada disini untuk membuat entities terbagi menjadi 3 jenis, yaitu
1. membuat entities biasa
2. membuat entities dengan jenis text link
3. membuat entities dengan jenis teks mention

#### membuat entities biasa
disini kanu bisa membuat entities biasa (tidak memerlukan properti tambahan), tetapi tidak semua jenis entities bisa dibuat disini! Yuk simak tabel berikut yang jenisnyandapat digunakan disini!