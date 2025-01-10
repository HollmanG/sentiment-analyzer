import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentAnalysisModule } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SentimentAnalysisModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService) => ({
        uri: configService.get('MONGO_URI'),
      }),
    }),
  ],
})
export class AppModule {}
