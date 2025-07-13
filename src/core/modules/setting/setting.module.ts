import { Module } from '@nestjs/common';
import { SettingService } from 'src/services/setting/setting.service';

@Module({
    providers: [SettingService],
    exports: [SettingService],
})
export class SettingModule { }
