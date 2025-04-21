import { IsNotEmpty, IsNumber, IsDateString, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSessionDto {
    @IsNotEmpty()
    @IsNumber()
    studentId: number;

    @IsNotEmpty()
    @IsNumber()
    tutorId: number;

    @IsNotEmpty()
    @IsNumber()
    topicId: number;

    @IsNotEmpty()
    @IsDateString()
    startTime: Date;

    @IsNotEmpty()
    @IsNumber()
    duration_minutes: number;

    @IsOptional()
    @IsString()
    notes: string;

    @IsOptional()
    @IsString()
    status: string;

    @IsDateString()
    schedueled_at: Date;
}
