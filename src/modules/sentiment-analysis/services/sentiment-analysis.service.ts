import { LanguageServiceClient } from '@google-cloud/language';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnalyzeSentimentDto } from '../dtos';
import { SentimentAnalysis } from '../schemas';

@Injectable()
export class SentimentAnalysisService {
  private _languageServiceClient: LanguageServiceClient;

  constructor(
    @InjectModel(SentimentAnalysis.name) private _sentimentAnalysisModel: Model<SentimentAnalysis>,
    private readonly _configService: ConfigService,
  ) {
    this._languageServiceClient = new LanguageServiceClient({ apiKey: this._configService.get('GOOGLE_API_KEY') });
  }

  async analyzeSentiment(analyzeSentimentDto: AnalyzeSentimentDto) {
    try {
      const type = 'PLAIN_TEXT' as const;
      const document = { content: analyzeSentimentDto.sentence, type };

      const sentimentAnalysis = await this._languageServiceClient.analyzeSentiment({ document });

      const analysis = sentimentAnalysis[0].sentences[0];
      const sentence = analysis.text.content;
      const sentimentScore = analysis.sentiment.score;
      const sentimentMagnitude = analysis.sentiment.magnitude;

      this._saveSentimentAnalysis(sentence, sentimentScore, sentimentMagnitude);

      return { sentence, sentimentScore, sentimentMagnitude };
    } catch (error) {
      console.error(error);
    }
  }

  async listAnalyses() {
    try {
      const analyses = await this._sentimentAnalysisModel.find().exec();

      return analyses.map((analysis) => {
        const { sentence, sentimentMagnitude, sentimentScore, createdAt, _id } = analysis;

        return { _id: _id.toString(), createdAt: createdAt.toDateString(), sentence, sentimentScore, sentimentMagnitude };
      });
    } catch (error) {}
  }

  private async _saveSentimentAnalysis(sentence: string, sentimentScore: number, sentimentMagnitude: number) {
    try {
      const createdSentimentAnalysis = new this._sentimentAnalysisModel({ sentence, sentimentScore, sentimentMagnitude });

      await createdSentimentAnalysis.save();
    } catch (error) {
      console.error(error);
    }
  }
}
