/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { REPOSITORY_NAME } from 'src/shared/constant/repository-config.constant';
import { User } from 'src/entities/auth/User.entity';
import { ProductRepository } from 'src/repositories/product/product.repository';
import { QueryProductInput } from './dto/query-product.input';
import { SortType } from 'src/shared/enums/common.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryRepository } from 'src/repositories/product/category.repository';
import { isNil } from 'lodash';
import { ProductLikeRepository } from 'src/repositories/product/product-like.repository';
import { Subcategory } from 'src/entities/product/SubCategory.entity';
import { ProductLike } from 'src/entities/product/ProductLike.enity';

@Injectable()
export class ProductService {
  constructor(
    @Inject(REPOSITORY_NAME.PRODUCT_REPOSITORY)
    private productRepository: ProductRepository,
    @Inject(REPOSITORY_NAME.CATEGORY_REPOSITORY)
    private categoryRepository: CategoryRepository,
    @Inject(REPOSITORY_NAME.PRODUCT_LIKE_REPOSITORY)
    private productLikeRepository: ProductLikeRepository,
  ) { }

  async getPaginatedProducts(queryProductDto: QueryProductInput) {
    const { q, page, limit, sortBy, sortType } = queryProductDto;
    const condition: { name?: object } = {};
    if (q) {
      condition.name = { [Op.iLike]: `%${q}%` };
    }
    const orderDefault = [['created_at', SortType.DESC]];
    const order = sortBy ? [sortBy, sortType || SortType.DESC] : [];
    if (order.length > 0) orderDefault.push(order);
    return this.productRepository.findAll({
      include: [
        {
          model: Subcategory,
          attributes: ['id', 'name', 'categoryId'],
        },
        {
          model: ProductLike,
          attributes: ['userId'],
          include: [
            {
              model: User,
              attributes: ['id', 'username', 'email', 'firstName', 'lastName'],
            },
          ],
        },
      ],
      condition,
      order: JSON.parse(JSON.stringify(orderDefault)),
      limit,
      page: page ?? 0,
    });
  }

  async create(payload: CreateProductDto) {
    const { subcategoryId } = payload;
    const newProduct = {
      ...payload,
    };

    if (!isNil(subcategoryId)) {
      const isExisted = await this.categoryRepository.findOne({
        id: subcategoryId,
      });
      if (!isExisted)
        throw new NotFoundException('Category not found');
    }
    const product = await this.productRepository.create(newProduct);
    return product;
  }

  async toggleLike(productId: number, userId: string) {
    const product = await this.productRepository.findOne({ id: productId });
    if (!product) throw new NotFoundException('Product not found');

    const existingLike = await this.productLikeRepository.findOne({
      productId,
      userId,
    });

    if (existingLike) {
      await existingLike.destroy();
      if (product.countLikes > 0)
        await product.decrement('countLikes');
    } else {
      await this.productLikeRepository.create({ productId, userId });
      await product.increment('countLikes');
    }
    return true;
  }
}
