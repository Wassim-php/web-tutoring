import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateChatDto {
    @IsNumber()
    @IsNotEmpty()
    user1_id: number;

    @IsNumber()
    @IsNotEmpty()
    user2_id: number;
}