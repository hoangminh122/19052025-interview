import { Attributes, BulkCreateOptions, CreationAttributes, FindAttributeOptions, Includeable, Model, Transaction, WhereOptions } from "sequelize"
import { MakeNullishOptional } from "sequelize/types/utils";

abstract class IGenericRepository<T> {
  abstract findAll({
    page,
    limit,
    condition = {},
    include = [],
    attributes,
    order = [['id', 'DESC']]
  }: IPaginate & IOption & {condition: WhereOptions<Attributes<T & Model<{}, {}>>>}): Promise<{ rows: T[]; count: number }>;

  abstract findOne(
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    options?: IOption
  ): Promise<T>;

  abstract create(
    attributes: MakeNullishOptional<(T & Model<{}, {}>)>,
    transaction?: Transaction
  ): Promise<T>;

  abstract update(condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    attributes: MakeNullishOptional<(T & Model<{}, {}>)>,
    transaction?: Transaction
  ): Promise<[affectedCount: number]>;

  abstract delete(
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    transaction?: Transaction
  ): Promise<number>;

  abstract bulkCreate(
    records: ReadonlyArray<CreationAttributes<T & Model<{}, {}>>>,
    options?: BulkCreateOptions<Attributes<T & Model<{}, {}>>>
  ): Promise<T[]>

  abstract findOrCreate({
    condition,
    record,
    transaction
  }: {
    condition: WhereOptions<Attributes<T & Model<{}, {}>>>,
    record: MakeNullishOptional<(T & Model<{}>)>,
    transaction?: Transaction
  }): Promise<[T, boolean]>;
}

interface IOption {
  include?: Includeable | Includeable[],
  attributes?: FindAttributeOptions,
  order?: string[] | any,
  transaction?: Transaction
}

interface IPaginate {
  page?: number,
  limit?: number,
}


export {
  IGenericRepository,
  IOption,
  IPaginate
}