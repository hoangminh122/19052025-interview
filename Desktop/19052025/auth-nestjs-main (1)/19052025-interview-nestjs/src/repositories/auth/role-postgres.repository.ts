import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { Role } from "src/entities/auth/Role.entity";

@Injectable()
export class RoleGenericRepository extends BaseRepository<Role> {
    constructor() {
        super(Role);
    }
}