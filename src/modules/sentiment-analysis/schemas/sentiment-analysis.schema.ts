import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SentimentAnalysisDocument = HydratedDocument<SentimentAnalysis>;

@Schema({ collection: 'SentimentAnalyses', timestamps: true })
export class SentimentAnalysis {
  @Prop({ required: true, type: String })
  sentence: string;

  @Prop({ required: true, type: Number })
  sentimentMagnitude: number;

  @Prop({ required: true, type: Number })
  sentimentScore: number;

  @Prop()
  createdAt: Date;
}

export const SentimentAnalysisSchema = SchemaFactory.createForClass(SentimentAnalysis);
