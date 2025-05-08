import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TelegrafModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => {
                const proxyHost = config.get<string>('PROXY_HOST');
                const proxyPort = config.get<string>('PROXY_PORT');
                const telegrafConfig: any = {};

                if (proxyHost && proxyPort) {
                    telegrafConfig.telegram = {
                        agent: new HttpsProxyAgent(`http://${proxyHost}:${proxyPort}`),
                    };
                }

                return {
                    botName: config.get<string>('BOT_NAME')!,
                    token: config.get<string>('BOT_TOKEN')!,
                    options: telegrafConfig,
                };
            },
        }),
    ],
})
export class TelegramModule { }
