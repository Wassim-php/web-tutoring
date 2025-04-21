import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Express } from 'express';
import { Multer } from 'multer'; // Add this import
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tutor } from './entities/tutor.entity';
import { Topic } from '../topics/entities/topic.entity'; 

@Controller('tutors')
export class TutorsController {
  constructor(
    private readonly tutorsService: TutorsService,
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
    @InjectRepository(Topic)
    private topicRepository: Repository<Topic>
  ) {}

  @Post()
  create(@Body() createTutorDto: CreateTutorDto) {
    return this.tutorsService.create(createTutorDto);
  }

  @Get()
  findAll() {
    return this.tutorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const tutor = await this.tutorRepository.findOne({
      where: { id: +id },
      relations: ['topics', 'user'],
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${id} not found`);
    }

    return {
      id: tutor.id,
      name: tutor.user.name,
      bio: tutor.bio,
      certifications: tutor.certifications,
      hourlyRate: tutor.hourlyRate,
      joinedDate: tutor.joinedDate,
      profilePicture: tutor.profilePicture,
      topics: tutor.topics  // Add this line to include topics in response
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profile_picture'))
  async update(
    @Param('id') id: string, 
    @Body() updateTutorDto: UpdateTutorDto,
    @UploadedFile() file?: Multer.File  // Change this line
  ) {
    console.log('Received update data:', updateTutorDto);
    console.log('Received file:', file);

    if (!updateTutorDto && !file) {
      throw new BadRequestException('No data provided for update');
    }

    // If file was uploaded, add it to the DTO
    if (file) {
      updateTutorDto.profilePicture = file.filename;
    }

    const updatedTutor = await this.tutorsService.update(+id, updateTutorDto);
    return {
      id: updatedTutor.id,
      name: updatedTutor.user.name,
      bio: updatedTutor.bio,
      certifications: updatedTutor.certifications,
      hourlyRate: updatedTutor.hourlyRate,
      joinedDate: updatedTutor.joinedDate,
      profilePicture: updatedTutor.profilePicture
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tutorsService.remove(+id);
  }

  @Post(':id/topics')
  @UseGuards(JwtAuthGuard)
  async addTopic(
    @Param('id') tutorId: string,
    @Body('topicId') topicId: number
  ) {
    const tutor = await this.tutorRepository.findOne({
      where: { id: +tutorId },
      relations: ['topics']
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${tutorId} not found`);
    }

    const topic = await this.topicRepository.findOne({
      where: { id: topicId }
    });

    if (!topic) {
      throw new NotFoundException(`Topic with ID ${topicId} not found`);
    }

    tutor.topics = [...tutor.topics, topic];
    return this.tutorRepository.save(tutor);
  }

  @Delete(':id/topics/:topicId')
  @UseGuards(JwtAuthGuard)
  async removeTopic(
    @Param('id') tutorId: string,
    @Param('topicId') topicId: string
  ) {
    const tutor = await this.tutorRepository.findOne({
      where: { id: +tutorId },
      relations: ['topics']
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor with ID ${tutorId} not found`);
    }

    tutor.topics = tutor.topics.filter(topic => topic.id !== +topicId);
    return this.tutorRepository.save(tutor);
  }
}
