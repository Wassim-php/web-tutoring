import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @IsNumber()
    @IsNotEmpty()
    chat_id: number;

    @IsBoolean()
    is_read: boolean;
}
