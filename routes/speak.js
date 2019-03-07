#!/usr/bin/env node
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
const path = require('path');
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('admin', 'admin') };

router.post('/', jsonParser, function(req, res) {
 //data = req.body;
  amqp.connect('amqp://130.245.170.104', opt, function(err, conn) {
    conn.createChannel(function(err, ch) {
      var ex = 'hw3';
      var data = req.body;
      //var data = [{msg: 'Hello world'}];
      //var severity = (args.length > 0) ? args[0] : '';
      var severity = data.key;
      var msg = data.msg;

      ch.assertExchange(ex, 'direct', {durable: false});

      ch.publish(ex, severity, new Buffer(msg));
      console.log(" [x] Sent %s: '%s'", severity, msg);
      res.json({'status':'OK'});
    });

    //setTimeout(function() { conn.close(); process.exit(0) }, 500);
  });
});

module.exports = router;


