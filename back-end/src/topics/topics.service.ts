import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private topicsRepository: Repository<Topic>,
  ) {}

  async findAll() {
    return await this.topicsRepository.find();
  }

  async findOne(id: number) {
    return await this.topicsRepository.findOne({ where: { id } });
  }

  async create(createTopicDto: CreateTopicDto) {
    const topic = this.topicsRepository.create(createTopicDto);
    return await this.topicsRepository.save(topic);
  }

  async update(id: number, updateTopicDto: UpdateTopicDto) {
    await this.topicsRepository.update(id, updateTopicDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.topicsRepository.delete(id);
  }
}
