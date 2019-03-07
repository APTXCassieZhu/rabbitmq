#!/usr/bin/env node
var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('admin', 'admin') };


amqp.connect('amqp://130.245.170.104', opt, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'hw3';
    var args = process.argv.slice(2);
    //var msg = args.slice(1).join(' ') || 'Hello World!';
    var data = [{msg: 'Hello world'}];
    var severity = (args.length > 0) ? args[0] : '';

    ch.assertExchange(ex, 'direct', {durable: true});
    ch.publish(ex, severity, new Buffer(JSON.stringify(data)));
    var msg = JSON.stringify(data);
    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

