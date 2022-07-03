import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import GlobalExceptionFilter from './decorators/ExcetionFilter';

async function bootstrap() {

  
  let app: NestExpressApplication;

  app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  (global as typeof global & { app: any }).app = app;

  const PORT = process.env.PORT || 1720;
  await app.listen(PORT, () => {
    console.log('server is listening on port ', PORT);
  });
}
bootstrap();
