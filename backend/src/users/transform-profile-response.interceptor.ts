import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface userResponse<T> {
  profile: T;
}

@Injectable()
export class TransformerProfileResponse<T>
  implements NestInterceptor<T, userResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<userResponse<T>> {
    return next.handle().pipe(map((data) => ({ profile: { ...data } })));
  }
}
