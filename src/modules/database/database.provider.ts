// import * as cls from 'continuation-local-storage';
import * as cls from 'cls-hooked';
import { Sequelize } from 'sequelize-typescript';
import { Op } from 'sequelize';
import { databaseConfig } from 'src/shared/config/database';
import { client, connectClient } from 'src/shared/config/redis-om.config';
import { userSchemaRedis } from 'src/entities/redis-om/User.redis-entity';
import { Permission } from 'src/entities/auth/Permission.entity';
import { RolePermission } from 'src/entities/auth/RolePermission.entity';
import { User } from 'src/entities/auth/User.entity';
import { UserRole } from 'src/entities/auth/UserRole.entity';
import { Role } from 'src/entities/auth/Role.entity';
import { Product } from 'src/entities/product/Product.entity';
import { Category } from 'src/entities/product/Category.entity';
import { ProductLike } from 'src/entities/product/ProductLike.enity';
import { Subcategory } from 'src/entities/product/SubCategory.entity';

const namespace = cls.createNamespace('ENROLMENT_APPLICANTS_SERVICE');

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col,
};

export const databaseProvider = {
  provide: 'SequelizeInstance',
  useFactory: async () => {
    let config;
    switch (process.env.NODE_ENV) {
      case 'prod':
      case 'production':
        config = databaseConfig.production;
      case 'dev':
      case 'development':
        config = databaseConfig.development;
      default:
        config = databaseConfig.development;
    }
    (Sequelize as any).__proto__.useCLS(namespace);

    const sequelize = new Sequelize({ ...config, operatorsAliases });
    sequelize.addModels([Role, User, UserRole, Permission, RolePermission, Product, Category, ProductLike, Subcategory]);

    //redis om entity
    connectClient();      //connect redis om
    const personRepository = client.fetchRepository(userSchemaRedis)    /* use the client to create a Repository just for Persons */
    await personRepository.createIndex();     /* create the index for Person */

    return sequelize.sync({ force: false });
  },
};
