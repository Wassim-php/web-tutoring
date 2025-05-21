import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { StudentsResolver } from './students.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student])
  ],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsResolver],
  exports: [StudentsService]
})
export class StudentsModule {}
