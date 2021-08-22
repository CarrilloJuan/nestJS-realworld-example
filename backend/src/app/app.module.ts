import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { ArticlesModule } from 'src/articles/articles.module';

@Module({
  imports: [AuthModule, UsersModule, DatabaseModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
