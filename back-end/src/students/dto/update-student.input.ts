import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class UpdateStudentInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  Major?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  enrolledDate?: Date;
}