import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { MqttModule } from './mqtt/mqtt.module';

@Module({
  imports: [TelegramModule, MqttModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
