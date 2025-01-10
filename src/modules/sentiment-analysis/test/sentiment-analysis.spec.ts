import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AnalyzeSentimentDto } from '../dtos';
import { SentimentAnalysis } from '../schemas';
import { SentimentAnalysisService } from '../services';
import { SentimentAnalysisController } from '../controllers';

const mockMongooseModel = jest.fn().mockImplementation(function (this: any, data: any) {
  Object.assign(this, data);
  this.save = jest.fn().mockResolvedValue(this);
}) as any;

mockMongooseModel.find = jest.fn().mockReturnThis();
mockMongooseModel.exec = jest.fn().mockResolvedValue([
  {
    sentence: 'I love hamburgers!',
    sentimentMagnitude: 0.8999999761581421,
    sentimentScore: 0.8999999761581421,
    createdAt: new Date('2025-01-08T04:19:42.508Z'),
    _id: '677dfcde8bfecc27c3babe33',
  },
]);

const mockConfigService = {
  get: jest.fn().mockReturnValue('FAKE_GOOGLE_API_KEY'),
};

jest.mock('@google-cloud/language', () => {
  return {
    LanguageServiceClient: jest.fn().mockImplementation(() => ({
      analyzeSentiment: jest
        .fn()
        .mockResolvedValue([
          { sentences: [{ text: { content: 'I love programming!' }, sentiment: { score: 0.9, magnitude: 0.9 } }] },
        ]),
    })),
  };
});

describe('SentimentAnalysis', () => {
  let sentimentAnalysisController: SentimentAnalysisController;
  let sentimentAnalysisService: SentimentAnalysisService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SentimentAnalysisController],
      providers: [
        SentimentAnalysisService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getModelToken(SentimentAnalysis.name), useValue: mockMongooseModel },
      ],
    }).compile();

    sentimentAnalysisService = moduleRef.get<SentimentAnalysisService>(SentimentAnalysisService);
    sentimentAnalysisController = moduleRef.get<SentimentAnalysisController>(SentimentAnalysisController);
  });

  describe('listAnalyses', () => {
    it('should return an array of SentimentAnalysis', async () => {
      const expectedResult = [
        {
          _id: '677dfcde8bfecc27c3babe33',
          sentence: 'I love hamburgers!',
          sentimentScore: 0.8999999761581421,
          createdAt: '2025-01-08T04:19:42.508Z',
          sentimentMagnitude: 0.8999999761581421,
        },
      ];

      jest.spyOn(sentimentAnalysisService, 'listAnalyses').mockResolvedValue(expectedResult);

      const result = await sentimentAnalysisController.listAnalyses();

      expect(result).toEqual(expectedResult);
    });
  });

  describe('analyzeSentiment', () => {
    it('should analyze sentiment and save the result to the database', async () => {
      const sentence = 'I love programming!';
      const analyzeSentimentDto: AnalyzeSentimentDto = { sentence };
      const expected = { sentence, sentimentScore: 0.9, sentimentMagnitude: 0.9 };

      const result = await sentimentAnalysisController.analyzeSentiment(analyzeSentimentDto);

      expect(mockMongooseModel).toHaveBeenCalledWith(expected);

      expect(result).toEqual(expected);
    });
  });
});
