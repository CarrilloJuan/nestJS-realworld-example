import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ArticlesModule } from 'src/articles/articles.module';
import { CommentsModule } from 'src/comments/comments.module';
import { validate } from './config/env.validation';
import { enviroments } from './config/enviroments';

const env = process.env.NODE_ENV || 'dev';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[env],
      validate,
      isGlobal: true,
    }), //The forRoot() method registers the ConfigService provider, which provides a get() method for reading configuration variables.
    DatabaseModule,
    AuthModule,
    UsersModule,
    ArticlesModule,
    CommentsModule,
  ],
})
export class AppModule {}
