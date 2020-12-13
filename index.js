// const { Telegraf } = require('telegraf')
const { Composer } = require('micro-bot')
const axios = require('axios');

const bot = new Composer

bot.help((ctx) => ctx.reply(
    '/hi : say hi to hirumi\n' +
    '/help : show list of available command\n'+
    '/track : track your package delivery\n' +
    '/ktp : see information of someone by nik (cooming soon)'
    ))

bot.command('hi', (ctx) => {
    let firstname = ctx.chat.first_name
    let lastname = ctx.chat.last_name

    ctx.reply("hi "+firstname+" "+lastname)
})

bot.command('track', (ctx) => {
    // console.log(ctx.message)
    let messageArray = ctx.message.text.trim().split(" ");
    if (messageArray.length == 2) {
        if (messageArray[1]=="list") {
            ctx.reply("kurir list : jne, pos, jnt, sicepat, tiki, anteraja, wahana, ninja\n")
        }
        if (messageArray[1]=="help") {
            ctx.reply("for tracking, try /track [kurir] [no. resi]\n" + 
                      "to see list of available courier, try /track list");
        }
        return 0;
    }
    if (messageArray.length != 3) {
        ctx.reply("for tracking information and argument, see /track help");
        return 0;
    }
    
    let kurir = messageArray[1].toLowerCase();
    let resi = messageArray[2].toUpperCase();
    let url = "https://api.binderbyte.com/v1/track";

    axios.get(url, {
        params: {
            api_key : process.env.CEKRESI_API_KEY,
            courier : kurir,
            awb : resi
        }
    })
    .then((result) => {
        if (result.status == 200) {
            // console.log(result.data.data.summary)
            res = result.data;
            let info = 'No. Resi : ' + res.data.summary.awb +'\n' +
                       'Kurir : ' + res.data.summary.courier + '\n' +
                       'Layanan : ' + res.data.summary.service + '\n' +
                       'Asal : ' + res.data.detail.origin + '\n' +
                       'Tujuan : ' + res.data.detail.destination + '\n' +
                       'Pengirim : ' + res.data.detail.shipper + '\n' +
                       'Penerima : ' + res.data.detail.receiver + '\n' +
                       'Status : ' + res.data.summary.status + '\n' +
                       'Deskripsi : ' + res.data.history[0].desc;
            
            ctx.reply(info);
        }
        else {
            res = result.data
            ctx.reply(res.message);
        }
    })
    .catch((error) => ctx.reply("Data not found"))

})
// bot.launch()
module.exports = bot
