import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

function beforeInitCheck(): boolean {
  try {
    // Check Node
    if (!process.env.NODE_NAME || process.env.NODE_NAME.trim() === '')
      throw 'NODE_NAME is empty';

    if (!process.env.CPU_LIMIT || Number(process.env.CPU_LIMIT) <= 0)
      throw 'CPU_LIMIT is missing or less than or equal to 0';

    if (!process.env.MEMORY_LIMIT || Number(process.env.MEMORY_LIMIT) <= 0)
      throw 'MEMORY_LIMIT is missing or less than or equal to 0';

    if (!process.env.DISK_DF_PATH || process.env.DISK_DF_PATH.trim() === '')
      throw 'DISK_DF_PATH is empty';

    // Check Bot
    if (!process.env.BOT_NAME || process.env.BOT_NAME.trim() === '')
      throw 'BOT_NAME is empty';

    if (!process.env.BOT_TOKEN || process.env.BOT_TOKEN.trim() === '')
      throw 'BOT_TOKEN is empty';

    if (process.env.BOT_TOKEN.length < 10 || process.env.BOT_TOKEN.length > 100)
      throw 'BOT_TOKEN is invalid';

    // Check Proxy 
    const port = Number(process.env.PROXY_PORT);
    const host = process.env.PROXY_HOST;
    if (!(
      (host && port && host.trim() != "" && (port > 0 || port < 65535)) ||
      (!host && !port)
    )) throw 'Check PROXY_HOST or PROXY_PORT';

    // Check Admins
    const admins = process.env.ADMINS?.split(',').map(a => a.trim()).filter(a => a);
    if (!admins || admins.length === 0) Logger.warn('ADMINS list is empty');

    return true;
  } catch (error) {
    Logger.error(`Initialization check failed: ${error}`);
    return false;
  }
}

async function bootstrap() {
  // // Create standalone application
  await NestFactory.createApplicationContext(AppModule);

  // // Create Http server
  // const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);
}

if (beforeInitCheck())
  bootstrap();
else
  Logger.error("Please fix the errors above and try again");