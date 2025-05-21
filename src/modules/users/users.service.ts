/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { UserDTO, UserUpdateDTO } from './dto/user.dto';
import { TransactionWork } from '../database/UnitOfWork';
import { Op } from 'sequelize';
import { QueryUserInput } from './dto/query-user.input';
import { UserGenericRepository, UserRedisOmRepository } from 'src/repositories/user/user-postgres.repository';
import { getHash } from 'src/shared/utils/bcrypt';
import { REPOSITORY_NAME } from 'src/shared/constant/repository-config.constant';
import { WorkerPool } from 'src/shared/config/worker';
import { UserEntity } from 'src/entities/redis-om/User.redis-entity';
import { User } from 'src/entities/auth/User.entity';

const pool = (new WorkerPool).getWorkerPoolIns();

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY_NAME.USER_REPOSITORY)
    private userRepository: UserGenericRepository,
    @Inject(TransactionWork)
    private readonly unitOfWork: TransactionWork,

    //redis om
    @Inject('UserRedisOmRepository')
    private userRedisOmRepository: UserRedisOmRepository,
  ) { }

  async getAll(filter: QueryUserInput) {
    const condition =
    {
      [Op.and]: [
        filter.email ? { 'email': { [Op.iLike]: `%${filter.email}%` } } : {},
        filter.name ? {
          [Op.or]:
            [
              {
                'first_name': { [Op.iLike]: `%${filter.name}%` }
              },
              {
                'last_name': { [Op.iLike]: `%${filter.name}%` }
              }
            ]
        }
          : {},
      ]
    };

    // Order
    const orderDefault = [['created_at', 'DESC']];
    const order = filter.sortBy ? [filter.sortBy, filter.sortType || 'DESC'] : [];
    if (order.length > 0)
      orderDefault.push(order);

    return this.userRepository.findAll({
      order: JSON.parse(JSON.stringify(orderDefault)),
      condition,
      limit: filter.limit,
      page: filter.page ? filter.page : 0,
    });
  }

  async findById(id: string): Promise<User> {
    const queryString = this.userRedisOmRepository.mapQueryString({ _id: id });
    let user = await this.userRedisOmRepository.getOne(queryString);
    if (!user) {
      const user = await this.userRepository.findOne({ id });
      if (user)
        throw new HttpException(
          {
            success: false,
            error: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      //update to cache redis
      const userRedis = this.mapUserEntity(user);
      this.userRedisOmRepository.createAndSave(userRedis);
    }

    // user.password = undefined;
    return user;
  }

  mapUserEntity(user: User) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      isVerify: user.isVerify,
      isActive: user.isActive,
      password: user.password,
      socketIds: user.socketIds
    }
  }

  async findUser(email: string, username?: string, phone?: string, isActive?: boolean): Promise<UserEntity> {
    const cond: any = this.filterAttribute({ email, username, phone, isActive });
    //find redis
    const queryString = this.userRedisOmRepository.mapQueryString(cond);
    let user = await this.userRedisOmRepository.getOne(queryString);
    if (!user) {
      const userDb = await this.userRepository.findOne(cond);
      //update to cache redis
      if (userDb) {
        const userRedis = this.mapUserEntity(userDb);
        return this.userRedisOmRepository.createAndSave(userRedis);
      }
    }
    return user;
  }

  filterAttribute({ username, phone, email, isActive }: IUserAtributeFilter) {
    const cond: any = {};
    // email
    if (email) cond.email = email;

    // username
    if (username) cond.username = username;

    // phone
    if (phone) cond.phone = phone;

    // isActive
    if (isActive) cond.isActive = isActive;

    return cond;
  }

  async isUserExisted(email: string, username?: string, phone?: string): Promise<Boolean> {
    const searchObj = this.userRedisOmRepository.cloneUserId({ email, username, phone });
    const queryString = `(@email:{${searchObj.email}})|(@username:{${searchObj.username}})|(@phone:{${searchObj.phone}})`;
    const userRedisFind = await this.userRedisOmRepository.getOne(queryString);
    if (userRedisFind) return true;
    //Find user
    const cond = {
      [Op.or]: [
        !username ? {} : { username },       // username input 
        !phone ? {} : { phone },                // phone input 
        { email },
      ]
    };

    const user = await this.userRepository.findOne(
      cond
    );

    if (user) {
      const userRedis = this.mapUserEntity(user);
      this.userRedisOmRepository.createAndSave(userRedis);
      return true;
    }
    return false;

  }

  async create(data: UserDTO): Promise<UserEntity> {
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      username: data.username,
      phone: data.phone,
      password: await getHash(data.password),
      createdAt: new Date()
    };
    const user = await this.userRepository.create(newUser);
    return this.userRedisOmRepository.createAndSave(user);
  }

  async update(id: string, data: UserUpdateDTO): Promise<boolean> {
    return this.unitOfWork.scope(async () => {
      const todo = await this.userRepository.findOne({ id });
      if (!todo) {
        throw new HttpException(
          {
            success: false,
            message: 'NOT_FOUND',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      //Map data
      let userJson = todo.toJSON();
      const userUpdate = Object.assign(userJson, data);

      await this.userRepository.update({ id }, userUpdate);
      return true;
    })
  }

  async isExistedSocketId(_id: string, socketId: string): Promise<boolean> {
    return pool.createTask(async (data: { _id: string, socketId: string }) => {
      require('reflect-metadata');
      const { connectClient } = require('src/shared/config/redis-om.config');
      const { UserRedisOmRepository } = require('src/repositories/user/user-postgres.repository');

      connectClient();
      const userRedisOmRepository = new UserRedisOmRepository();
      const queryString = userRedisOmRepository.mapQueryString({ _id: data._id });
      const user = await userRedisOmRepository.getOne(queryString);
      if (!user) return false;
      return !!user?.socketIds?.includes(data.socketId);
    }).runAsync({ _id, socketId });
  }

  async isExistedUser(ids: string[]): Promise<boolean> {
    const query = `@_id:{${ids.join(' | ').replace(/\-/gm, '\\-')}}`;
    const user = await this.userRedisOmRepository.getAllRedis(query);
    return user?.length === ids.length;
  }

  async updateRedisOm(_id: string, data: UserUpdateDTO): Promise<any> {
    const queryString = this.userRedisOmRepository.mapQueryString({ _id });
    const userEntity = await this.userRedisOmRepository.getOne(queryString);
    if (!userEntity) {
      throw new HttpException(
        {
          success: false,
          message: 'NOT_FOUND',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    //update socketIds
    if (userEntity.socketIds?.length)
      data.socketIds = [...userEntity.socketIds, ...data.socketIds]
    const userUpdate = Object.assign(userEntity, data);
    return this.userRedisOmRepository.update(userUpdate);
  }

  async cleanAllCacheRedis(): Promise<boolean> {
    const users = await this.userRedisOmRepository.getAllRedis();
    await Promise.all(users?.map((user: UserEntity) => {
      return this.userRedisOmRepository.detele(user.entityId);
    }));
    return true;
  }

  async destroy(id: string): Promise<boolean> {
    await Promise.all([
      this.userRedisOmRepository.detele(id),
      this.userRepository.delete({ id })
    ]);
    return true;
  }

  async syncUserRedisToDb(): Promise<boolean> {
    const users = await this.userRedisOmRepository.getAllRedis();
    // await this.userRepository.bulkCreate([{id:""}])
    return true;
  }
}
