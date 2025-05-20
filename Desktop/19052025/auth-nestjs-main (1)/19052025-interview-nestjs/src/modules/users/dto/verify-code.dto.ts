import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyCodeDTO {
    @ApiProperty()
    @IsString()
    code: string;
}