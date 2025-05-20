import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { TypeRole } from "src/shared/enums/role-enum";

export class RoleCreateDTO {
    @ApiProperty()
    @IsArray()
    // @IsEnum(UserTypeRole, { each: true })
    roles: TypeRole[]
}