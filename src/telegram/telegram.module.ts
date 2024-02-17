import { Module } from '@nestjs/common';
import { MqttModule } from 'src/mqtt/mqtt.module';

import { TelegramService } from './telegram.service';

@Module({
  imports: [MqttModule],
  providers: [TelegramService],
})
export class TelegramModule {}
