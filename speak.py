#!/usr/bin/env python
import pika
import sys
import json

credentials = pika.PlainCredentials('admin', 'admin')

connection = pika.BlockingConnection(pika.ConnectionParameters('130.245.170.104', 5672, '/', credentials))
channel = connection.channel()

channel.exchange_declare(exchange='hw3',
                         exchange_type='direct',
			 durable=True)

#channel.queue_declare(queue='hw3Queue')

severity = sys.argv[1]

#message = 'Hello world!'
data = {"msg":"hello world!"}
message = json.dumps(data)

channel.basic_publish(exchange='hw3',
                      routing_key=severity,
                      body=message)

print(" [x] Sent %r:%r" % (severity, message))
connection.close()


