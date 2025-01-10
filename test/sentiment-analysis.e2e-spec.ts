import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

import mongoose from 'mongoose';

jest.setTimeout(60_000);

describe('SentimentAnalysisController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await mongoose.connect(process.env.MONGO_URI);

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await mongoose.connection.collection('SentimentAnalyses').deleteMany({});
  });

  describe('analyzeSentiment', () => {
    it('should return the sentiment analysis and save the result to the database', async () => {
      const sentence = 'I love programming!';

      const response = await request(app.getHttpServer())
        .post('/sentiment-analysis/analyze-sentiment')
        .send({ sentence })
        .expect(200);

      expect(response.body).toMatchSnapshot({
        sentence: expect.any(String),
        sentimentScore: expect.any(Number),
        sentimentMagnitude: expect.any(Number),
      });

      const savedAnalysis = await mongoose.connection.collection('SentimentAnalyses').findOne();

      expect(savedAnalysis).toMatchObject({
        sentence,
        sentimentScore: response.body.sentimentScore,
        sentimentMagnitude: response.body.sentimentMagnitude,
      });
    });

    it('should return a 400 error for invalid input', async () => {
      await request(app.getHttpServer()).post('/sentiment-analysis/analyze-sentiment').send({}).expect(400);
    });
  });

  describe('listAnalyses', () => {
    it('should return an array on analysis', async () => {
      await request(app.getHttpServer()).post('/sentiment-analysis/analyze-sentiment').send({ sentence: 'Yesterday was fun' });

      const analyses = await request(app.getHttpServer()).get('/sentiment-analysis/list-analyses').expect(200);

      analyses.body.forEach((analysis) => {
        expect(analysis).toMatchSnapshot({
          _id: expect.any(String),
          sentence: expect.any(String),
          createdAt: expect.any(String),
          sentimentScore: expect.any(Number),
          sentimentMagnitude: expect.any(Number),
        });
      });
    });
  });
});
