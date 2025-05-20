import { Module } from '@nestjs/common'
import { NotiSlack } from 'src/shared/config/slack.config'
import { LoggerService } from './logger.service'

@Module({
  providers: [LoggerService, NotiSlack],
  exports: [LoggerService],
})
export class LoggerModule {}