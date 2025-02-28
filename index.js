require('dotenv').config();
const path = require('path');
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.BOT_API);

const data = require('./data');

const imagePath = path.join(__dirname, './assets/pic.png')

/**
 * Вызов бота и добавление двух кнопок 
 *
 */
bot.start((ctx) => { // Бот стартует
    ctx.reply('Выберите язык / Choose a language', Markup.inlineKeyboard([
        [Markup.button.callback('Русский', 'lang_ru'), Markup.button.callback('English', 'lang_en')]
    ]));
});

/**
 * 
 * Действие бота при нажатии на кнопку на русском языке
 */
bot.action('lang_ru', (ctx) => {
    ctx.reply('Из списка выберите необходимую толщину основного металла', Markup.inlineKeyboard([
        [Markup.button.callback('Выбрать толщину', 'show_thikness_ru')]
    ]));
});

/**
 * Действие бота при нажатии на кнопку на английском языке
 */
bot.action('lang_en', (ctx) => {
    ctx.reply('Choose the required base metal thickness from the list', Markup.inlineKeyboard([
        [Markup.button.callback('Choose thickness', 'show_thikness_en')]
    ]));
});

/**
 * Смапить данные и сделать поиск по толщине для русского языка
 */
bot.action('show_thikness_ru', (ctx) => {
    const buttons = data.map(item => Markup.button.callback(item.thickness, `thickness_ru_${item.thickness}`));
    const keyboard = Markup.inlineKeyboard(buttons, { columns: 6 });
    ctx.reply('Выберите значение толщины:', keyboard);
});

data.forEach(item => {
    bot.action(`thickness_ru_${item.thickness}`, (ctx) => {
        const response = `
            *Ширина растяжения*: ${item.widthStretching}
*Длина растяжения*: ${item.lengthStretching}
*Ширина изгиба*: ${item.widthBend}
*Длина изгиба*: ${item.lengthBend}
        `;
        ctx.replyWithPhoto({ source: imagePath }, { caption: response, parse_mode: 'Markdown' });
    });
});

/**
 * Смапить данные и сделать поиск по толщине для английского языка
 */
bot.action('show_thikness_en', (ctx) => {
    const buttons = data.map(item => Markup.button.callback(item.thickness, `thickness_en_${item.thickness}`));
    const keyboard = Markup.inlineKeyboard(buttons, { columns: 6 });
    ctx.reply('Choose the thickness value:', keyboard);
});

data.forEach(item => {
    bot.action(`thickness_en_${item.thickness}`, (ctx) => {
        const response = `
            *Width Stretching*: ${item.widthStretching}
*Length Stretching*: ${item.lengthStretching}
*Width Bend*: ${item.widthBend}
*Length Bend*: ${item.lengthBend}
        `;
        ctx.replyWithPhoto({ source: imagePath }, { caption: response, parse_mode: 'Markdown' });
    });
});

bot.launch();