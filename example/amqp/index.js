'use strict';
/* eslint-disable no-console */

let CloudStorm = require('../../index');
let token = require('../config.json').token;

let bot = new CloudStorm.Client(token, {
    initialPresence: { status: 'online', game: { name: 'Wolking on Sunshine' } },
    firstShardId: 0,
    lastShardId: 0,
    shardAmount: 1,
    intents: 4609
});

let amqp = require('amqp');
let startup = async () => {
    let connection = amqp.createConnection({ host: 'localhost' });
    connection.on('error', (e) => {
        console.error(e);
    });
    connection.on('ready', async () => {
        await bot.connect();
        bot.on('event', (event) => {
            console.log(event.t);
            //connection.publish('test-pre-cache', event);
            // Event was sent to amqp queue, now you can use it somewhere else
        });
    });
    bot.on('ready', () => {
        console.log('Bot is ready');
    });
};
startup().catch(e => {
    console.error('Error on startup!');
    console.error(e);
});

