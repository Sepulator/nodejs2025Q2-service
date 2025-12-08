import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'node:fs/promises';
import * as yaml from 'js-yaml';
import { join } from 'path';

import { LoggingService } from './logging/logging.service';
import { LoggingInterceptor } from './logging/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  app.useGlobalPipes(new ValidationPipe());

  const logger = app.get(LoggingService);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const document = yaml.load(await fs.readFile(join(process.cwd(), 'doc/api.yaml'), 'utf8')) as any;

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
