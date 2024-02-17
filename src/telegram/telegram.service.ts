import { Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { MqttService } from 'src/mqtt/mqtt.service';

const TELEGRAM_TOKEN = '6981178287:AAFFcl-1jsS_w5D-wfdM4sdhkLGJ3zphcVI';

@Injectable()
export class TelegramService {
  private readonly bot: TelegramBot;
  private logger: Logger;
  constructor(private mqttService: MqttService) {
    this.logger = new Logger(TelegramService.name);
    this.bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

    this.bot.on('message', this.OnMessageReceive.bind(this));
  }

  async OnMessageReceive(msg: any) {
    if (msg.text === '/wake') {
      console.log(msg.text);
      await this.mqttService.sendMessage('wake', 'wake');
    }
  }
}
