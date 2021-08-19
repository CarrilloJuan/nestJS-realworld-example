import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    let request = context.switchToHttp().getRequest();
    const { user: userPayload } = request.body;
    if (userPayload) {
      request.body = userPayload;
    }
    return super.canActivate(context);
  }
}
