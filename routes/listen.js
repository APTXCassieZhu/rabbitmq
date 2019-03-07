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
router.post('/', jsonParser, function(req, res) {
  amqp.connect('amqp://130.245.170.104', opt, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = 'hw3';

      ch.assertExchange(ex, 'direct', {durable: false});

      ch.assertQueue('', {exclusive: true}, function(err, q) {
	data = req.body;
        keys = data.keys;
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
	console.log("keys:  "+keys)
        keys.forEach(function(severity) {
          ch.bindQueue(q.queue, ex, severity);
        });

        ch.consume(q.queue, function(msg) {
          console.log(" [x] routing-key %s: '%s'", msg.fields.routingKey, msg.content.toString());
          // returns message as { msg: }
          res.json({"msg":msg.content.toString()});
          //}, {noAck: true});
	});
      });
    });
  });
});
module.exports = router;


