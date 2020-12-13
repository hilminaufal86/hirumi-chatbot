const { Telegraf } = require('telegraf')
BOT_TOKEN = '1466037800:AAEBslgYakxBUEr3DRsTB3oph0UHPawPPf0'

const bot = new Telegraf(BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => 
ctx.reply(
    '\\start: start\n'+
    '\\help: help'))
bot.on('sticker', (ctx) => ctx.reply(''))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()