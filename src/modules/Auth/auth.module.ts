import { forwardRef, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "dotenv";
import Users from "src/Entities/User";
import AuthController from "./auth.controller";
import AuthService from "./auth.service";

config()

const jwtConfig = JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '7d' },
  });

@Module({
    imports: [
        TypeOrmModule.forFeature([Users]),
        jwtConfig,
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export default class AuthModule {};

