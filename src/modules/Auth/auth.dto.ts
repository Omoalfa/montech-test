import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { IsEqualTo } from "src/decorators/match.decorator";


export class createUserDto {
    @IsString() @IsNotEmpty() name: string;
    @IsEmail() email: string;
    @IsOptional() @IsEnum(['author', 'editor']) role: 'author' | 'editor';
    @IsString() @MinLength(8) password: string;
    @IsEqualTo<createUserDto>('password') cPassword: string;
}

export class updateUserDto {
    @IsOptional() @IsString() @IsNotEmpty() name: string;
    @IsOptional() @IsEnum(['author', 'editor']) role: 'author' | 'editor';
}

export class loginDto {
    @IsEmail() email: string;
    @IsString() @MinLength(8) password: string;
}

export class updatePasswordDto {
    @IsString() oldPassword: string;
    @IsString() @MinLength(8) password: string;
    @IsEqualTo<createUserDto>('password') cPassword: string;
}

export class tokenDto {
    email: string;
    id: number;
}
