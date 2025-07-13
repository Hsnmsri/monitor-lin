import { Module } from '@nestjs/common';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { TelegrafModule } from 'nestjs-telegraf';
import { SettingService } from 'src/services/setting/setting.service';
import { SettingModule } from '../setting/setting.module';

@Module({
    imports: [
        SettingModule,
        TelegrafModule.forRootAsync({
            imports: [SettingModule],
            inject: [SettingService],
            useFactory: async (config: SettingService) => {
                const proxyHost = config.getProxy()?.host;
                const proxyPort = config.getProxy()?.port;
                const telegrafConfig: any = {};

                if (proxyHost && proxyPort) {
                    telegrafConfig.telegram = {
                        agent: new HttpsProxyAgent(`http://${proxyHost}:${proxyPort}`),
                    };
                }

                return {
                    botName: config.getBotName()!,
                    token: config.getBotToken()!,
                    options: telegrafConfig,
                };
            },
        }),
    ],
})
export class TelegramModule { }
