import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import Articles from "src/Entities/Article";
import AuthModule from "../Auth/auth.module";
import ArticleController from "./article.controller";
import ArticleService from "./article.service";


@Module({
    imports: [TypeOrmModule.forFeature([Articles]), AuthModule],
    providers: [ArticleService],
    controllers: [ArticleController],
    exports: [ArticleService]
})
export default class ArticleModule {};
