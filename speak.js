#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('admin', 'admin') };

amqp.connect('amqp://130.245.170.104', opt, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
