import { Module } from '@nestjs/common';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { TelegrafModule } from 'nestjs-telegraf';
import environment from 'src/environment/environment';
import { Telegraf } from 'telegraf';

let telegrafConfig: Partial<Telegraf.Options<any>> = {};
// Check if the proxy is set in the environment
if (environment.proxy.host && environment.proxy.port) {
    telegrafConfig = {
        telegram: {
            agent: new HttpsProxyAgent(`http://${environment.proxy.host}:${environment.proxy.port}`)
        }
    }
}

@Module({
    imports: [
        TelegrafModule.forRoot({
            botName: environment.bot.name,
            token: environment.bot.token,
            options: telegrafConfig
        })
    ]
})
export class TelegramModule { }
