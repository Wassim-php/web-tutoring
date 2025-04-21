import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    gradeLevel: string;

    @IsNotEmpty()
    @IsString()
    major: string;

    enrollmentDate: Date = new Date();
}
