import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopicsService } from './topics.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from './entities/topic.entity';

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly topicsService: TopicsService,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>,
  ) {}

  @Post()
  create(@Body() createTopicDto: CreateTopicDto) {
    return this.topicsService.create(createTopicDto);
  }

  @Get()
  findAll() {
    return this.topicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
    return this.topicsService.update(+id, updateTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.topicsService.remove(+id);
  }

  @Get(':id/tutors')
  async findTutors(@Param('id') id: string) {
    const topic = await this.topicRepository.findOne({
      where: { id: +id },
      relations: ['tutors', 'tutors.user'],
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${id} not found`);
    }

    // Map the tutors to include user information
    return topic.tutors.map(tutor => ({
      id: tutor.id,
      name: tutor.user.name,
      hourlyRate: tutor.hourlyRate,
      bio: tutor.bio,
      certifications: tutor.certifications
    }));
  }
}
