import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTutorDto {
    @IsNotEmpty()
    @IsString()
    bio: string;

    @IsNotEmpty()
    @IsNumber()
    hourlyRate: number;

    @IsOptional()
    @IsString({ each: true })
    certifications: string[];

    joinedDate: Date = new Date();

   
    @IsString() 
    profilePicture: string;
}