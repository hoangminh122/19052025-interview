import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UserDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    username: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsString()
    password: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    avatarId: string;

}

export class UserUpdateDTO {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;


    @ApiPropertyOptional()
    @IsOptional()
    socketIds?: string[];

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsBoolean()
    // isActive: boolean;

    // @ApiPropertyOptional()
    // @IsOptional()
    // @IsString()
    // username: string;
}

export class UserWithTokenMicroDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    socketUserId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    token: string;
}

export class MemberMicroDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    memberId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    socketId: string;
}
