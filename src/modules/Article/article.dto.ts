import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class createArticleDto {
    @IsString() @IsNotEmpty() title: string;
    @IsString() @IsNotEmpty() content: string;
    @IsString() @IsNotEmpty() snippet: string;
}

export class updateArticleDto {
    @IsOptional() @IsString() @IsNotEmpty() title: string;
    @IsOptional() @IsString() @IsNotEmpty() content: string;
    @IsOptional() @IsString() @IsNotEmpty() snippet: string;
}

export class approveDto {
    @IsBoolean() approved: boolean;
}

export class queryArticleDto {
    @IsOptional() @IsNumberString() page: number;
    @IsOptional() @IsNumberString() limit: number;
}

export class paramDto {
    @IsNumberString() id: number;
}
