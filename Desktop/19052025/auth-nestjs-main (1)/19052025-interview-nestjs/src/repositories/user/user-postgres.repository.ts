import { Injectable } from "@nestjs/common";
import { userSchemaRedis } from "src/entities/redis-om/User.redis-entity";
import { BaseRepository, BaserRedisOmRepository } from "../base.repository";
import { User } from "src/entities/auth/User.entity";

@Injectable()
export class UserGenericRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }
}

@Injectable()
export class UserRedisOmRepository extends BaserRedisOmRepository {
  constructor() {
    super(userSchemaRedis);
  }
}