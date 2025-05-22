import { CacheInterceptor, CACHE_KEY_METADATA, CACHE_MANAGER, CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CACHE_PREFIX } from '../constant/cache-auth.constant';

@Injectable()
export class BlackListInterceptor extends CacheInterceptor {

  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      return `${cacheKey}-${request._parsedUrl.query}`;
    }

    return super.trackBy(context);
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const cacheKey = this.reflector.get(
      CACHE_MANAGER,
      context.getHandler(),
    );
    return next.handle();
  }
}