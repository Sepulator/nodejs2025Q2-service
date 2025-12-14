import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body } = request;

    this.logger.log(`Incoming Request: ${method} ${url} Query: ${JSON.stringify(query)} Body: ${JSON.stringify(body)}`);

    return next.handle().pipe(
      tap((data) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(`Response: ${method} ${url} ${statusCode} ${contentLength || ''} - ${Date.now() - now}ms`);
        this.logger.log(`Response Body: ${JSON.stringify(data)}`);
      }),
    );
  }
}
