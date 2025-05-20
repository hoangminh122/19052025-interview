import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { Permission } from "src/entities/auth/Permission.entity";

@Injectable()
export class PermissionGenericRepository extends BaseRepository<Permission> {
    constructor() {
        super(Permission);
    }
}