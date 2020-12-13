// const { Telegraf } = require('telegraf')
const { Composer } = require('micro-bot')
const axios = require('axios');

const bot = new Composer

bot.help((ctx) => ctx.reply(
    '/help: show list of available command\n'+
    '/track: track your package delivery'
    ))

bot.command('track', (ctx) => {
    let messageArray = ctx.message.text.split();
    if (messageArray.length == 2) {
        if (messageArray[1]=="list") {
            ctx.reply("kurir list : jne, pos, jnt, sicepat, tiki, anteraja, wahana, ninja\n")
        }
        if (messageArray[1]=="help") {
            ctx.reply("tracking  : /track [kurir] [no. resi]\n" + 
                      "list kurir: /track list");
        }
    }
    if (messageArray.length != 3) {
        ctx.reply("for tracking information: /track help");
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
            let info = 'No. Resi : ' + result.data.summary.awb +'\n' +
                       'Kurir    : ' + result.data.summary.corier + '\n' +
                       'Layanan  : ' + result.data.summary.service + '\n' +
                       'Asal     : ' + result.data.detail.origin + '\n' +
                       'Tujuan   : ' + result.data.detail.destination + '\n' +
                       'Pengirim : ' + result.data.detail.shipper + '\n' +
                       'Penerima : ' + result.data.detail.receiver + '\n' +
                       'Status   : ' + result.data.summary.status;
            
            ctx.reply(info);
        }
        else if (result.status == 400) {
            ctx.reply("No. resi tidak ditemukan");
        }
        else {
            ctx.reply("Error found, please try again later");
        }
    })

})

module.exports = bot
