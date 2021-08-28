import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { tokenPayload } from './models/token-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(jwtConstants.scheme),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /*
    Passport first verifies the JWT's signature and decodes the JSON. It then
    invokes our validate() method passing the decoded JSON as its single
    parameter. Passport will build a user object based on the return value of
    our validate() method, and attach it as a property on the Request object. 
  */
  async validate(payload: tokenPayload) {
    return { userId: payload.sub };
  }
}
