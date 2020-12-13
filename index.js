const { Telegraf } = require('telegraf')
const { Composer } = require('micro-bot')
const axios = require('axios');

// const bot = new Telegraf('1466037800:AAEBslgYakxBUEr3DRsTB3oph0UHPawPPf0')
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

    // console.log("cekresi api key "+process.env.CEKRESI_API_KEY)

    ctx.reply("hi "+firstname+" "+lastname)
    // ctx.reply(process.env.CEKRESI_API_KEY)
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

    let res = 'empty';
    tracker(kurir,resi)
    .then((result) => {
        console.log(result);
        ctx.reply(result);
        res = result;
        console.log("in tracker",res)
    })
    console.log("after tracker",res)
    ctx.reply(res)
})

async function tracker(kurir,resi) {
    console.log("cekresi api key "+process.env.CEKRESI_API_KEY)
    let val = '';
    try {
        let url = "https://api.binderbyte.com/v1/track";
    
        let result = await axios.get(url, {
            params: {
                api_key : process.env.CEKRESI_API_KEY,
                // api_key : "a0030456a14b21ddeb89d061697de877f8921eb0b53d7f75b0250cceadc392be",
                courier : kurir,
                awb : resi
            }
        })
        // console.log(result.data)

        if (result.status == 200) {
            console.log(result.data.data.summary)
            let res = result.data;
            console.log("pass before info")
            val = 'No. Resi : ' + res.data.summary.awb +'\n' +
                       'Kurir : ' + res.data.summary.courier + '\n' +
                       'Layanan : ' + res.data.summary.service + '\n' +
                       'Asal : ' + res.data.detail.origin + '\n' +
                       'Tujuan : ' + res.data.detail.destination + '\n' +
                       'Pengirim : ' + res.data.detail.shipper + '\n' +
                       'Penerima : ' + res.data.detail.receiver + '\n' +
                       'Status : ' + res.data.summary.status + '\n' +
                       'Deskripsi : ' + res.data.history[0].desc;
            
            // ctx.reply(info);
            console.log("pass after info")
            // return info;
        }
        else {
            // res = result.data
            // ctx.reply(res.message);
            val = "Data not found";
        }
        console.log("pass before catch")
    } catch(e) {
        console.log("Error occured",e)
    } finally {
        return val
    }
}
// bot.launch()
module.exports = bot
