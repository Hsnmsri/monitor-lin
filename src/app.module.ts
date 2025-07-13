import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './core/modules/telegram/telegram.module';
import { TelegramService } from './services/telegram/telegram.service';
import { CpuService } from './services/cpu/cpu.service';
import { MemoryService } from './services/memory/memory.service';
import { DiskService } from './services/disk/disk.service';
import { ConfigModule } from '@nestjs/config';
import { SettingService } from './services/setting/setting.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService, TelegramService, CpuService, MemoryService, DiskService, SettingService],
})
export class AppModule { }
