import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { jwtConstants } from 'src/auth/constants/constants';

export interface userResponse<T> {
  user: T;
}

@Injectable()
export class TransformerUserResponse<T>
  implements NestInterceptor<T, userResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<userResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.replace(
      jwtConstants.scheme,
      '',
    );
    return next.handle().pipe(
      map(({ profile = {}, ...data }) => {
        return { user: { token, ...data, ...profile } };
      }),
    );
  }
}
