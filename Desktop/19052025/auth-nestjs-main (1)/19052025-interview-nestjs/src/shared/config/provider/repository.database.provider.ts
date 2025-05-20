import { RoleGenericRepository } from "src/repositories/auth/role-postgres.repository";
import { UserGenericRepository } from "src/repositories/user/user-postgres.repository";
import { REPOSITORY_NAME } from "src/shared/constant/repository-config.constant";

const userRepository = {
  provide: REPOSITORY_NAME.USER_REPOSITORY,
  useClass: UserGenericRepository
}

const roleRepository = {
  provide: REPOSITORY_NAME.ROLE_REPOSITORY,
  useClass: RoleGenericRepository
}

export {
  userRepository,
  roleRepository
}
