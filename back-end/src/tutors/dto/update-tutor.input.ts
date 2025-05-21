import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class UpdateTutorInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  certification?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  profilePicture?: string;
}