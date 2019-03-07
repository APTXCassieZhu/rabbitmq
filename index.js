const express = require('express');

const app = express();

var amqp = require('amqplib/callback_api');
const opt = { credentials: require('amqplib').credentials.plain('admin', 'admin') };

var listen = require('./routes/listen.js');
var speak = require('./routes/speak.js');

app.use('/listen', listen);
app.use('/speak', speak);

//app.use("/script", express.static(__dirname + '/script'));

//app.get('/',function(req,res){
    //res.send('GET route on things.');
//    res.sendFile(path.join(__dirname+'/html/index.html'));
//})

amqp.connect('amqp://130.245.170.104', opt, function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'hw3';

    ch.assertExchange(ex, 'direct', {durable: false});
    console.log("check existence of hw3");
});
});

app.listen(80);

