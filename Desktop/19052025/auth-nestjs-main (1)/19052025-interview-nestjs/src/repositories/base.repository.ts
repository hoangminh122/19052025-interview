import { IGenericRepository, IOption, IPaginate } from "./base-repository.interface";

import { Model } from "sequelize-typescript";
import { Attributes, BulkCreateOptions, CreationAttributes, Transaction, WhereOptions } from "sequelize";
import { MakeNullishOptional } from "sequelize/types/utils";
import { userSchemaRedis } from "src/entities/redis-om/User.redis-entity";
import { client } from "src/shared/config/redis-om.config";

// Type `ModelType` would basically wrap & satisfy the 'this' context of any sequelize helper methods
type Constructor<T> = new (...args: any[]) => T;
type ModelType<T extends Model<T>> = Constructor<T> & typeof Model;


export class BaseRepository<T extends Model<T>> implements IGenericRepository<T>  {
  constructor(protected _repository: ModelType<T>) {
  }

  findOne(
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    options?: IOption
  ): Promise<T> {
    const {include, attributes, order, transaction } = options || {};
    try {
        return this._repository.findOne({
          where: condition,
          include: include ,
          attributes: attributes,
          order: order,
          transaction
        });
  
        // if (model) {
        //   model = model.get({ plain: true });
        // }
  
      } catch (e) {
        throw e;
      }
  }
  findAll({ 
    page,
    limit,
    condition,
    include,
    attributes,
    order = [['id', 'DESC']],
    transaction
  }: IPaginate & IOption & {condition?: WhereOptions<Attributes<T & Model<{}, {}>>>}): Promise<{ rows: T[]; count: number }> {
    try {
    /** Option to query */
      let options: any = {
        order,
        where: condition,
        include,
        attributes,
        transaction,
        distinct: true,
      };

      if (limit && page) {
        options.limit = limit;
        options.offset = (page - 1) * limit;
      }

      return this._repository.findAndCountAll(options);
    } catch(e) {
      throw e;
    }
  }
   
  create(attributes: MakeNullishOptional<(T & Model<{}, {}>)>, transaction?: Transaction): Promise<T> {
    try {
      attributes.createdAt = new Date();
      return this._repository.create(attributes, { transaction });
    } catch (e) {
      throw e;
    }
  }

  update(
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    attributes: MakeNullishOptional<(T & Model<{}, {}>)>,
    transaction?: Transaction
  ): Promise<[affectedCount: number]> {
    try {
      attributes.updatedAt = new Date();
      return this._repository.update(attributes, { where: condition, transaction });
    } catch (e) {
      throw e;
    }
  }

  delete(
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    transaction?: Transaction
  ): Promise<number> {
    try {
      return this._repository.destroy({
        where: condition,
        transaction
      });
    }
    catch(e){
      throw e;
    }
  }

  bulkCreate(
    records: ReadonlyArray<CreationAttributes<T>>,
    options?: BulkCreateOptions<Attributes<T>>
  ): Promise<T[]> {
    try {
      return this._repository.bulkCreate(records, options);
    } catch (e) {
      throw e;
    }
  }

  findOrCreate({
    condition,
    record,
    transaction
  }: {
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    record: MakeNullishOptional<(T & Model<{}>)>,
    transaction?: Transaction
  }) {
    try {
      record.createdAt = new Date();
      return this._repository.findOrCreate({
        where: condition,
        defaults: record,
        transaction
      });
    } catch (error) {
      throw error;
    }
  }
    
}

// Redis om repository
export class BaserRedisOmRepository  {
  private repository;
  constructor(_userSchemaRedis) {
    this.repository = client.fetchRepository(userSchemaRedis);

  }

  cloneUserId(data) {
    Object.keys(data).forEach((key, index) => {
      data[key] = typeof data[key] == 'string' ? data[key]?.replace(/[\/.@,!?-]/g, '\\$&') : data[key];
    }); 
    return data;
  }

  async createAndSave(data) {
    return this.repository.createAndSave(data);
  }

  mapQueryString(query:any) {
    const queryClone = this.cloneUserId({...query});
    let queryString = '';
    Object.keys(queryClone).forEach((key) => {
      queryString += `(@${key}:{${queryClone[key]}})`;
    });
    return queryString;
  }

  async getOne(query: string) {
    return this.repository.searchRaw(query).return.first();
  }

  public getAllRedis(query?: string, options?: any) {
    let searchEntity: any = this.repository.searchRaw(query || '*');
    Object.keys(options?.sort ?? {}).forEach((field) => {
      searchEntity = searchEntity.sortBy(
        field,
        options.sort[field] > 0 ? 'ASC' : 'DESC'
      );
    });

    if (options?.limit) {
      return searchEntity.returnPage(options.skip ?? 0, options.limit);
    } else {
      return searchEntity.return.all();
    }
  }

  async update(data) {
    const entity = await this.repository.fetch(data.entityId);
    const entityId = await this.repository.save(data);
    return { entityId, entity }
  }

  
  async detele(entityId: string) {
    return this.repository.remove(entityId);
  }
}