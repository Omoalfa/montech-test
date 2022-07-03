import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { Middleware, UseMiddleware } from "src/decorators/middleware";
import Users from "src/Entities/User";
import { Reqs } from "src/interfaces/global";
import AuthService from "../Auth/auth.service";
import { approveDto, createArticleDto, paramDto, queryArticleDto, updateArticleDto } from "./article.dto";
import ArticleService from "./article.service";


@Controller('article')
class ArticleController {
    constructor(
        private readonly ArticleService: ArticleService,
        private readonly AuthService: AuthService
    ) {}

    @Middleware
    async verifyToken (req: Reqs, res: Response, next: NextFunction) {
        await this.AuthService.userAuth(req, res);
    }

    @Middleware
    async allowEditor (req: Reqs, res: Response, next: NextFunction) {
        await this.AuthService.allowEditor(req, res);
    }

    @Post('/')
    @UseMiddleware('verifyToken')
    async createArticle (
        @Res() res: Response,
        @Req() req: Reqs,
        @Body() data: createArticleDto
    ) {
        const result = await this.ArticleService.createArticle(req.user as Users, data);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(201).json(result);
    }

    @Patch('/:id')
    @UseMiddleware('verifyToken')
    async editArticle (
        @Req() req: Reqs,
        @Res() res: Response,
        @Body() data: updateArticleDto,
        @Param() param: paramDto,
    ) {
        const result = await this.ArticleService.updateArticle(req.user as Users, param.id, data);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Delete('/:id')
    @UseMiddleware('verifyToken')
    async deleteArticle (
        @Res() res: Response,
        @Req() req: Reqs,
        @Param() param: paramDto,
    ) {
        const result = await this.ArticleService.deleteArticle(req.user as Users, param.id);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Patch('/approved/:id')
    @UseMiddleware('verifyToken', 'allowEditor')
    async approveArticle (
        @Param() param: paramDto,
        @Body() data: approveDto,
        @Res() res: Response,
        @Req() req: Reqs
    ) {
        const result = await this.ArticleService.approveArticle(param.id, data);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Get('/')
    async GetAllArticles (@Query() query: queryArticleDto) {
        const result = await this.ArticleService.getAllArticles(query);

        if (!result.status) throw new BadRequestException(result.message);

        return result;
    }

    @Get('/me')
    @UseMiddleware('verifyToken')
    async GetMyArticles (
        @Query() query: queryArticleDto,
        @Res() res: Response,
        @Req() req: Reqs
    ) {
        const result = await this.ArticleService.getMyArticles(req.user as Users, query);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Get('/approved')
    @UseMiddleware('verifyToken', 'allowEditor')
    async GetAllApprovedArticles (
        @Query() query: queryArticleDto,
        @Res() res: Response,
        @Req() req: Reqs
    ) {
        const result = await this.ArticleService.getAllApprovedArticles(req.user as Users, query);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Get('/unapproved')
    @UseMiddleware('verifyToken', 'allowEditor')
    async GetAllUnApprovedArticles (
        @Query() query: queryArticleDto,
        @Res() res: Response,
        @Req() req: Reqs
    ) {
        const result = await this.ArticleService.getAllUnApprovedArticles(req.user as Users, query);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Get('/me/approved')
    @UseMiddleware('verifyToken')
    async GetMyApprovedArticles (
        @Query() query: queryArticleDto,
        @Res() res: Response,
        @Req() req: Reqs
    ) {
        const result = await this.ArticleService.getMyApprovedArticles(req.user as Users, query);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Get('/me/unapproved')
    @UseMiddleware('verifyToken')
    async GetMyUnApprovedArticles (
        @Query() query: queryArticleDto,
        @Res() res: Response,
        @Req() req: Reqs
    ) {
        const result = await this.ArticleService.getMyUnApprovedArticles(req.user as Users, query);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Get('/:id')
    async getArticleDetails (@Param() param: paramDto ) {
        const result = await this.ArticleService.getOneArticle(param.id);

        if (!result.status) throw new BadRequestException(result.message);

        return result;
    }
}

export default ArticleController;
