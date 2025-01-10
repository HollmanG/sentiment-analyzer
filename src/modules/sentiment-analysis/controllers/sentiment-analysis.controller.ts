import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyzeSentimentDto } from '../dtos';
import { SentimentAnalysisService } from '../services';

@ApiTags('Sentiment analisis')
@Controller('sentiment-analysis')
export class SentimentAnalysisController {
  constructor(private readonly _sentimentAnalysisService: SentimentAnalysisService) {}

  @ApiOperation({ summary: 'Analyze sentiment' })
  @ApiResponse({
    status: 200,
    description: 'Analyze the sentiment of the given sentence and stores the result in the database',
    example: { sentence: 'I hate the hot weather!', sentimentScore: -0.800000011920929, sentimentMagnitude: 0.800000011920929 },
  })
  @HttpCode(HttpStatus.OK)
  @Post('analyze-sentiment')
  analyzeSentiment(@Body() analyzeSentimentDto: AnalyzeSentimentDto) {
    return this._sentimentAnalysisService.analyzeSentiment(analyzeSentimentDto);
  }

  @ApiOperation({ summary: 'List analyses' })
  @ApiResponse({
    status: 200,
    description: 'List the previous analyses',
    example: [
      {
        _id: '677dfcde8bfecc27c3babe33',
        createdAt: 'Tue Jan 07 2025',
        sentence: 'I love hamburgers!',
        sentimentScore: 0.8999999761581421,
        sentimentMagnitude: 0.8999999761581421,
      },
      {
        _id: '677dfce98bfecc27c3babe35',
        createdAt: 'Tue Jan 07 2025',
        sentence: 'I hate the hot weather!',
        sentimentScore: -0.800000011920929,
        sentimentMagnitude: 0.800000011920929,
      },
    ],
  })
  @HttpCode(HttpStatus.OK)
  @Get('list-analyses')
  listAnalyses() {
    return this._sentimentAnalysisService.listAnalyses();
  }
}
