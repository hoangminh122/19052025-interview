import { Module } from '@nestjs/common/decorators';
import { databaseProvider } from './database.provider';
import { TransactionWork } from './UnitOfWork';

@Module({
  providers: [databaseProvider, TransactionWork],
  exports: [databaseProvider, TransactionWork],
})
export class DatabaseModule {}
