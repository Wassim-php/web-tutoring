import { Module } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { TutorsController } from './tutors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from './entities/tutor.entity';
import { Topic } from 'src/topics/entities/topic.entity';
import { TutorsResolver } from './tutors.resolver';

@Module({
  controllers: [TutorsController],
  providers: [TutorsService, TutorsResolver],
  imports: [TypeOrmModule.forFeature([Tutor, Topic])],
  exports: [TutorsService]

})
export class TutorsModule {}
