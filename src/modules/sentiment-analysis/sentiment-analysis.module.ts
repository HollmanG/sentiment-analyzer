import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { SentimentAnalysisService } from './services';
import { SentimentAnalysisController } from './controllers';
import { MongooseModule } from '@nestjs/mongoose';
import { SentimentAnalysis, SentimentAnalysisSchema } from './schemas';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: SentimentAnalysis.name, schema: SentimentAnalysisSchema }]),
  ],
  controllers: [SentimentAnalysisController],
  providers: [SentimentAnalysisService],
})
export class SentimentAnalysisModule {}
