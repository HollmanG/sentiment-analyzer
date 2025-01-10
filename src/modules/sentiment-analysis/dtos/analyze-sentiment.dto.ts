import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AnalyzeSentimentDto {
  @ApiProperty({ description: 'The sentence to be analyzed', example: 'Yesterday I won a tournament' })
  @IsString()
  @MinLength(5)
  sentence: string;
}
