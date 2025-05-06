import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      const message = this.messagesRepository.create(createMessageDto);
      return await this.messagesRepository.save(message);
    } catch (error) {
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

  async findBySession(sessionId: number): Promise<Message[]> {
    try {
      return await this.messagesRepository.find({
        where: { session_id: sessionId },
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
