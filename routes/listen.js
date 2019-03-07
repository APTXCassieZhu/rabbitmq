//#!/usr/bin/env node
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const path = require('path');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('admin', 'admin') };

//var args = process.argv.slice(2);

//if (args.length == 0) {
//  console.log("Usage: listen.js [key array]");
//  process.exit(1);
//}

amqp.connect('amqp://130.245.170.104', opt, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'hw3';

    ch.assertExchange(ex, 'direct', {durable: true});


    ch.assertQueue('', {exclusive: true}, function(err, q) {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(severity) {
        ch.bindQueue(q.queue, ex, severity);
      });

      ch.consume(q.queue, function(msg) {
	msg = JSON.parse(msg.content);
        console.log(" [x] routing-key: '%s'", msg);
      }, {noAck: true});
    });
  });
});

module.exports = router;

