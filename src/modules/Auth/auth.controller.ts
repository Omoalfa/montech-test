import { BadRequestException, Body, Controller, HttpCode, Patch, Post, Req, Res } from "@nestjs/common";
import { NextFunction, Response } from "express";
import { Middleware, UseMiddleware } from "src/decorators/middleware";
import Users from "src/Entities/User";
import { Reqs } from "src/interfaces/global";
import { createUserDto, loginDto, updateUserDto } from "./auth.dto";
import AuthService from "./auth.service";


@Controller('users')
class AuthController {
    constructor(
        private readonly AuthService: AuthService
    ) {}

    @Middleware
    async verifyToken (req: Reqs, res: Response, next: NextFunction) {
        await this.AuthService.userAuth(req, res);
    }

    @Post('/')
    async createUser (@Body() data: createUserDto, @Res() res: Response) {
        const result = await this.AuthService.createUser(data);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }

    @Post('/login')
    @HttpCode(200)
    async LoginUser (@Body() data: loginDto) {
        const result = await this.AuthService.userLogin(data);

        if (!result.status) throw new BadRequestException(result.message);

        return result;
    }

    @Patch('/')
    @UseMiddleware('verifyToken')
    async editUser(
        @Req() req: Reqs,
        @Res() res: Response,
        @Body() data: updateUserDto
    ) {
        const result = await this.AuthService.editUser(req.user as Users, data);

        if (!result.status) throw new BadRequestException(result.message);

        return res.status(200).json(result);
    }
}

export default AuthController;
