import { RoleGenericRepository } from "src/repositories/auth/role-postgres.repository";
import { CategoryRepository } from "src/repositories/product/category.repository";
import { ProductLikeRepository } from "src/repositories/product/product-like.repository";
import { ProductRepository } from "src/repositories/product/product.repository";
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

const productRepository = {
  provide: REPOSITORY_NAME.PRODUCT_REPOSITORY,
  useClass: ProductRepository
}

const categoryRepository = {
  provide: REPOSITORY_NAME.CATEGORY_REPOSITORY,
  useClass: CategoryRepository
}

const productLikeRepository = {
  provide: REPOSITORY_NAME.PRODUCT_LIKE_REPOSITORY,
  useClass: ProductLikeRepository
}

export {
  userRepository,
  roleRepository,
  productRepository,
  categoryRepository,
  productLikeRepository
}
