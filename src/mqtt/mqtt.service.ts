import { Injectable, OnModuleInit } from '@nestjs/common';
import * as aedes from 'aedes';
import { IPublishPacket } from 'mqtt-packet';
import { createServer } from 'net';

@Injectable()
export class MqttService implements OnModuleInit {
  private broker: aedes.default; // Store the broker instance

  constructor() {
    this.broker = aedes.createBroker(); // Initialize the broker
  }

  onModuleInit() {
    const server = createServer(this.broker.handle);

    const port = 1883;
    server.listen(port, function () {
      console.log(`MQTT broker running on port ${port}`);
    });

    // Event listeners (client connect/disconnect, publish, subscribe)
    this.initializeEventListeners();
  }

  private initializeEventListeners() {
    this.broker.on('client', (client) => {
      console.log(`Client Connected: ${client.id}`);
    });

    this.broker.on('clientDisconnect', (client) => {
      console.log(`Client Disconnected: ${client.id}`);
      // Here, you can add any additional logic you need to handle on client disconnect
    });

    this.broker.on('publish', (packet, client) => {
      if (client) {
        console.log(
          `Message from ${client.id}: ${packet.topic} - ${packet.payload.toString()}`,
        );
      }
    });

    this.broker.on('subscribe', (subscriptions, client) => {
      console.log(
        `Client ${client.id} subscribed to: ${subscriptions.map((s) => s.topic).join(', ')}`,
      );
    });
  }

  public async sendMessage(topic: string, message: string) {
    const packet: IPublishPacket = {
      cmd: 'publish',
      qos: 2, // Adjust QoS as needed
      dup: false,
      topic: topic,
      payload: Buffer.from(message, 'utf-8'),
      retain: false,
      messageId: 0,
    };

    console.log('Sending: ', packet);

    this.broker.publish(packet, (err) => {
      if (err) {
        console.error(`Failed to publish message: ${err.message}`);
      }
    });
  }
}
