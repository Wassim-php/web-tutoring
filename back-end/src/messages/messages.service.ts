import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>
  ) {}

  async create(messageData: {
    content: string;
    chat_id: number;
    user_id: number;
    is_read: boolean;
  }): Promise<Message> {
    if (!messageData.chat_id) {
      throw new BadRequestException('chat_id is required');
    }

    try {
      const message = this.messagesRepository.create(messageData);
      const savedMessage = await this.messagesRepository.save(message);
      console.log('Message saved:', savedMessage); // Add this for debugging
      return savedMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  async findAll(): Promise<Message[]> {
    try {
      return await this.messagesRepository.find({
        relations: ['user', 'session']
      });
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Message> {
    try {
      const message = await this.messagesRepository.findOne({
        where: { id },
        relations: ['user', 'session']
      });
      if (!message) {
        throw new NotFoundException(`Message #${id} not found`);
      }
      return message;
    } catch (error) {
      throw new Error(`Failed to fetch message: ${error.message}`);
    }
  }

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    try {
      await this.findOne(id); // Verify message exists
      await this.messagesRepository.update(id, updateMessageDto);
      return this.findOne(id);
    } catch (error) {
      throw new Error(`Failed to update message: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.messagesRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Message #${id} not found`);
      }
    } catch (error) {
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  async findBySession(chatId: number): Promise<Message[]> {
    try {
      return await this.messagesRepository.find({
        where: { chat_id: chatId },
        relations: ['user'],
        order: { sent_at: 'ASC' }
      });
    } catch (error) {
      throw new Error(`Failed to fetch session messages: ${error.message}`);
    }
  }

  async markAsRead(id: number): Promise<Message> {
    try {
      await this.messagesRepository.update(id, { is_read: true });
      return this.findOne(id);
    } catch (error) {
      throw new Error(`Failed to mark message as read: ${error.message}`);
    }
  }
}
