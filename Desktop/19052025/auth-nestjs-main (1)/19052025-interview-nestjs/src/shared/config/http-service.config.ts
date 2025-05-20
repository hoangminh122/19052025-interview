import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { config } from 'dotenv';
import { IAuthConfig } from './interfaces/auth-config.interface';
config();

export const authConfig: IAuthConfig = {
  development: {
    host: process.env.AUTH_HOSTNAME || '',
    endpoint: process.env.AUTH_ENDPOINT || '',
  },
  production: {
    host: process.env.AUTH_HOSTNAME || '',
    endpoint: process.env.AUTH_ENDPOINT || '',
  },
};

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: Number(process.env.HTTP_TIMEOUT) || 5000,
      maxRedirects: Number(process.env.HTTP_MAX_REDIRECTS) || 5,
    };
  }
}
