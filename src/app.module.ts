import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import  { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import AuthModule from './modules/Auth/auth.module';
import ArticleModule from './modules/Article/article.module';

config();

const SYNC:boolean = true;


const dbConfig: TypeOrmModuleOptions = {
  url: process.env.DATABASE_URL,
  ssl: process.env.VER === 'local' ? false : { rejectUnauthorized: false },
  type: 'postgres',
  entities: [__dirname + '/Entities/*.{js,ts}'],
  subscribers: [__dirname + '/subscribers/*.js'],
  synchronize: SYNC,
} as TypeOrmModuleOptions;

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
