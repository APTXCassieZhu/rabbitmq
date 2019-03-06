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


result = channel.queue_declare(exclusive=True)
queue_name = result.method.queue
print('queue name: %r' % queue_name)

severities = sys.argv[1:]

if not severities:
    sys.stderr.write("Usage: %s [binding_key]...\n" % sys.argv[0])
    sys.exit(1)

for severity in severities:
    print('bind queue with exchange')
    channel.queue_bind(exchange='hw3',
    		       queue=queue_name,
                       routing_key=severity)

def callback(ch, method, properties, body):
    data = json.loads(body)
    print("msg: {}".format(data['msg']))
    #print(" [x] %r:%r" % (method.routing_key, body))



channel.basic_consume(callback,
                      queue=queue_name,
                      no_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()

