import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import environment from './environment/environment';
import { Logger } from '@nestjs/common';


function beforeInitCheck(): boolean {
  try {

    // Check node
    if (environment.node.name == "") throw "Node name is empty";
    if (environment.node.cpu_limit <= 0) throw "Node cpu limit is less than 0";
    if (environment.node.memory_limit <= 0) throw "Node memory limit is less than 0";
    if (environment.node.disk_df_path == "") throw "Node disk df path is empty";

    // Check bot
    if (environment.bot.name == "") throw "Bot name is empty";
    if (environment.bot.token == "") throw "Bot token is empty";
    if (environment.bot.token.length < 10) throw "Bot token is invalid";
    if (environment.bot.token.length > 100) throw "Bot token is invalid";

    // Check proxy
    if (environment.proxy.host == "") throw "Proxy host is empty";
    if (environment.proxy.port && environment.proxy.port <= 0) throw "Proxy port is less than 0";
    if (environment.proxy.port && environment.proxy.port > 65535) throw "Proxy port is greater than 65535";

    // Check admin
    if (environment.admin.length == 0) Logger.warn("Admin list is empty");

    return true;
  } catch (error) {
    Logger.error(error);
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