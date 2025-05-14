import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatsService {
    constructor(
        @InjectRepository(Chat)
        private chatsRepository: Repository<Chat>
    ) {}

    async create(createChatDto: CreateChatDto): Promise<Chat> {
        // Check if chat already exists between these users
        const existingChat = await this.chatsRepository.findOne({
            where: [
                { user1_id: createChatDto.user1_id, user2_id: createChatDto.user2_id },
                { user1_id: createChatDto.user2_id, user2_id: createChatDto.user1_id }
            ]
        });

        if (existingChat) {
            return existingChat;
        }

        const chat = this.chatsRepository.create(createChatDto);
        return await this.chatsRepository.save(chat);
    }

    async findAll(): Promise<Chat[]> {
        return await this.chatsRepository.find({
            relations: ['user1', 'user2']
        });
    }

    async findOne(id: number): Promise<Chat> {
        const chat = await this.chatsRepository.findOne({
            where: { id },
            relations: ['user1', 'user2']
        });

        if (!chat) {
            throw new NotFoundException(`Chat #${id} not found`);
        }

        return chat;
    }

    async findByUser(userId: number): Promise<Chat[]> {
        return await this.chatsRepository.find({
            where: [
                { user1_id: userId },
                { user2_id: userId }
            ],
            relations: ['user1', 'user2']
        });
    }

    async update(id: number, updateChatDto: UpdateChatDto): Promise<void> {
        await this.chatsRepository.update(id, updateChatDto);
    }

    async remove(id: number): Promise<void> {
        await this.chatsRepository.delete(id);
    }
}
