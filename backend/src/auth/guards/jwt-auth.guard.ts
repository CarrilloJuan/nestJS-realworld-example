import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(ctx: ExecutionContext) {
    const methodKey = ctx.getHandler().name;
    if (methodKey === 'findArticles' || methodKey === 'findAllComments')
      return true;
    return super.canActivate(ctx);
  }
}
