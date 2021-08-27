import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class TransformerUserResponse implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.replace(
      jwtConstants.scheme,
      '',
    );
    return next.handle().pipe(map((data) => ({ user: { token, ...data } })));
  }
}
