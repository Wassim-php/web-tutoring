import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateTutorDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  profilePicture?: string; 
}
