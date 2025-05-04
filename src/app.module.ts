import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './core/modules/telegram/telegram.module';
import { TelegramService } from './services/telegram/telegram.service';
import { CpuService } from './services/cpu/cpu.service';
import { MemoryService } from './services/memory/memory.service';

@Module({
  imports: [TelegramModule],
  controllers: [AppController],
  providers: [AppService, TelegramService, CpuService, MemoryService],
})
export class AppModule { }
