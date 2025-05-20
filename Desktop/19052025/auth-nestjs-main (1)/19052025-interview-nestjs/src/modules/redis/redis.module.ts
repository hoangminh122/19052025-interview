import { Module } from '@nestjs/common'
import { NotiSlack } from 'src/shared/config/slack.config'

@Module({
  providers: [],
  exports: [],
})
export class RedisModule {}