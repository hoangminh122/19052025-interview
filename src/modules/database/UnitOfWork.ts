import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transaction } from "sequelize";
@Injectable()
export class TransactionWork {
  constructor(
    @Inject(forwardRef(() => 'SequelizeInstance'))
    private readonly sequelizeInstance,
  ) {}

  async scope<T>(callback: () => Promise<T>): Promise<T> {
    const isolationLevel = Transaction.ISOLATION_LEVELS.SERIALIZABLE;

    return new Promise<T>((resolve, reject) => {
      this.sequelizeInstance
        .transaction({ isolationLevel }, callback)
        .then(value => {
          resolve(value);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}