import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { Tutor } from './entities/tutor.entity';
import { Topic } from '../topics/entities/topic.entity';

@Injectable()
export class TutorsService {
  constructor(
    @InjectRepository(Tutor)
    private tutorsRepository: Repository<Tutor>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>
  ) {}

  async create(createTutorDto: CreateTutorDto): Promise<Tutor> {
    try {
      // First create the tutor instance
      const tutor = new Tutor();
      
      // Assign the DTO properties
      Object.assign(tutor, {
        ...createTutorDto,
        joinedDate: new Date()
      });

      // Save and return the tutor
      return await this.tutorsRepository.save(tutor);
    } catch (error) {
      console.error('Error creating tutor:', error);
      throw new BadRequestException('Failed to create tutor profile');
    }
  }

  async findAll(): Promise<Tutor[]> {
    return await this.tutorsRepository.find({
      relations: ['user'], // Include user relation
    });
  }

  async findOne(id: number): Promise<Tutor> {
    const tutor = await this.tutorsRepository.findOne({
      where: { id },
      relations: ['user', 'topics'], 
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${id} not found`);
    }

    return tutor;
  }

  async update(id: number, updateTutorDto: UpdateTutorDto): Promise<Tutor> {
    console.log('Updating tutor with data:', updateTutorDto);

    const tutor = await this.tutorsRepository.findOne({
      where: { id },
      relations: ['user']
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${id} not found`);
    }

    // Convert hourly_rate to hourlyRate if needed
    const parsedData = {
      bio: updateTutorDto.bio,
      hourlyRate: updateTutorDto.hourlyRate ? parseFloat(updateTutorDto.hourlyRate.toString()) : undefined,
      profilePicture: updateTutorDto.profilePicture
    };

    console.log('Parsed update data:', parsedData);

    // Only update fields that are provided and valid
    if (parsedData.bio !== undefined && parsedData.bio !== null) {
      tutor.bio = parsedData.bio;
    }
    if (parsedData.hourlyRate !== undefined && !isNaN(parsedData.hourlyRate)) {
      tutor.hourlyRate = parsedData.hourlyRate;
    }
    if (parsedData.profilePicture !== undefined && parsedData.profilePicture !== null) {
      tutor.profilePicture = parsedData.profilePicture;
    }

    console.log('Tutor to be saved:', tutor);
    return await this.tutorsRepository.save(tutor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.tutorsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Tutor with ID ${id} not found`);
    }
  }

  async addTopic(tutorId: number, topicId: number) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
      relations: ['topics']
    });
    
    const topic = await this.topicRepository.findOne({
      where: { id: topicId }
    });

    if (!tutor || !topic) {
      throw new NotFoundException('Tutor or topic not found');
    }

    tutor.topics.push(topic);
    return this.tutorsRepository.save(tutor);
  }

  async removeTopic(tutorId: number, topicId: number) {
    const tutor = await this.tutorsRepository.findOne({
      where: { id: tutorId },
      relations: ['topics']
    });
    
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    tutor.topics = tutor.topics.filter(topic => topic.id !== topicId);
    return this.tutorsRepository.save(tutor);
  }
}
export default TutorsService;
