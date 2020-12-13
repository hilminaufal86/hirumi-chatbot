// const { Telegraf } = require('telegraf')
// BOT_TOKEN = '1466037800:AAEBslgYakxBUEr3DRsTB3oph0UHPawPPf0'
const { Composer } = require('micro-bot')
const bot = new Composer

// const bot = new Telegraf(BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome!'))
bot.help((ctx) => 
ctx.reply(
    '\\start: start\n'+
    '\\help: help'))
bot.on('sticker', (ctx) => ctx.reply(''))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
// bot.launch()
module.exports = bot

// server-id  : lit-beyond-85890
// server-add : https://lit-beyond-85890.herokuapp.com/