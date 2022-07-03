import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Articles from "src/Entities/Article";
import Users from "src/Entities/User";
import { IRes, Paginated } from "src/interfaces/global";
import { IsNull, Not, Repository } from "typeorm";
import { approveDto, createArticleDto, queryArticleDto, updateArticleDto } from "./article.dto";

@Injectable()
class ArticleService {
    constructor(
        @InjectRepository(Articles) private ArticleRepo: Repository<Articles>
    ) {}

    async createArticle (author: Users, data: createArticleDto): Promise<IRes<Articles>> {
        try {
            const { title, snippet, content } = data;
            const article = this.ArticleRepo.create({ title, snippet, content });
            article.author = author;

            await this.ArticleRepo.save(article);

            return { message: 'Article created successfully', data: article, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateArticle (author: Users, id: number, data: updateArticleDto): Promise<IRes<Articles>> {
        try {
            const { title, snippet, content } = data;
            const article = await this.ArticleRepo.findOne({ where: { author, id }});

            if (!article) return { message: 'Article not found', status: false }

            await this.ArticleRepo.save({
                ...article,
                ...(title && { title }),
                ...(snippet && { snippet }),
                ...(content && { content })
            });

            return { message: 'Article created successfully', data: article, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteArticle (author: Users, id: number): Promise<IRes<null>> {
        try {
            const article = await this.ArticleRepo.findOne({ where: { author, id }});

            if (!article) return { message: 'Article not found', status: false }

            await this.ArticleRepo.delete(article);
        } catch (error) {
            throw new Error(error)
        }
    }

    async approveArticle (id: number, data: approveDto): Promise<IRes<null>> {
        try {
            const article = await this.ArticleRepo.findOne({ where: { id } });

            if (!article) return { message: 'Article not found', status: false };

            await this.ArticleRepo.save({ ...article, approved: data.approved ? Date.now() : null });

            return { message: `The article has been set ${data.approved ? 'approved' : 'not approved'} successfully`, status: true }
        } catch (error) {
            throw new Error(error);
        }
    }

    async getAllArticles (query: queryArticleDto): Promise<Paginated<Articles[]>> {
        try {
            const { limit = 10, page = 1 } = query;
            const [articles, total]: [Articles[], number] = await this.ArticleRepo.findAndCount({
                where: [
                    { approved: Not(IsNull()) },
                    { approved: Not(IsNull()) },
                ],
                relations: ['author'],
                take: limit,
                skip: (page - 1) * limit
            })

            return { message: 'Articles fetched successfully', data: articles, meta: { limit, total, page }, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async getMyArticles (author: Users, query: queryArticleDto): Promise<Paginated<Articles[]>> {
        try {
            const { limit = 10, page = 1 } = query;
            const [articles, total]: [Articles[], number] = await this.ArticleRepo.findAndCount({
                where: [
                    { author },
                    { author },
                ],
                relations: ['author'],
                take: limit,
                skip: (page - 1) * limit
            })

            return { message: 'Articles fetched successfully', data: articles, meta: { limit, total, page }, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAllApprovedArticles (author: Users, query: queryArticleDto): Promise<Paginated<Articles[]>> {
        try {
            const { limit = 10, page = 1 } = query;
            const [articles, total]: [Articles[], number] = await this.ArticleRepo.findAndCount({
                where: { approved: Not(IsNull()),  },
                relations: ['author'],
                take: limit,
                skip: (page - 1) * limit
            })

            return { message: 'Articles fetched successfully', data: articles, meta: { limit, total, page }, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async getAllUnApprovedArticles (author: Users, query: queryArticleDto): Promise<Paginated<Articles[]>> {
        try {
            const { limit = 10, page = 1 } = query;
            const [articles, total]: [Articles[], number] = await this.ArticleRepo.findAndCount({
                where: { approved: IsNull() },
                relations: ['author'],
                take: limit,
                skip: (page - 1) * limit
            })

            return { message: 'Articles fetched successfully', data: articles, meta: { limit, total, page }, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async getMyApprovedArticles (author: Users, query: queryArticleDto): Promise<Paginated<Articles[]>> {
        try {
            const { limit = 10, page = 1 } = query;
            const [articles, total]: [Articles[], number] = await this.ArticleRepo.findAndCount({
                where: [
                    { approved: Not(IsNull()), author },
                    { approved: Not(IsNull()), author },
                ],
                relations: ['author'],
                take: limit,
                skip: (page - 1) * limit
            })

            return { message: 'Articles fetched successfully', data: articles, meta: { limit, total, page }, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async getMyUnApprovedArticles (author: Users, query: queryArticleDto): Promise<Paginated<Articles[]>> {
        try {
            const { limit = 10, page = 1 } = query;
            const [articles, total]: [Articles[], number] = await this.ArticleRepo.findAndCount({
                where: [
                    { approved: IsNull(), author: { id: author.id } },
                    { approved: IsNull(), author: { id: author.id } },
                ],
                relations: ['author'],
                take: limit,
                skip: (page - 1) * limit
            })

            return { message: 'Articles fetched successfully', data: articles, meta: { limit, total, page }, status: true };
        } catch (error) {
            throw new Error(error)
        }
    }

    async getOneArticle (id: number): Promise<IRes<Articles>> {
        try {
            const article = await this.ArticleRepo.findOne({ where: { id }, relations: ['author']});

            if (!article) return { message: 'Article not found', status: false };

            return { message: 'Article details fetched successully', data: article, status: false }
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default ArticleService;
