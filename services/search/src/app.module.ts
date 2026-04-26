import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { appConfig, databaseConfig } from './config';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    SearchModule,
  ],
})
export class AppModule {}
