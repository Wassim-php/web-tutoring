import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>
  ) {}

  async create(createSessionDto: CreateSessionDto) {
    const session = this.sessionRepository.create(createSessionDto);
    return await this.sessionRepository.save(session);
  }

  async findAll() {
    return await this.sessionRepository.find({
      relations: ['student', 'tutor', 'topic']
    });
  }

  async findAccepted(tutorId: number) {
    const sessions = await this.sessionRepository.find({
      where: {status: 'accepted' , tutorId: tutorId},
      relations: ['student', 'tutor', 'topic', 'tutor.user']
    });
    return sessions;
  }
  async findStAccepted(studentId: number){
    const sessions = await this.sessionRepository.find({
      where: {status: 'accepted', studentId: studentId},
      relations: ['student', 'tutor', 'topic', 'tutor.user']
    });
    return sessions;
  }

  async findOne(id: number) {
    const session = await this.sessionRepository.findOne({
      where: { id },
      relations: ['student', 'tutor', 'topic']
    });

    if (!session) {
      throw new NotFoundException(`Session with ID ${id} not found`);
    }

    return session;
  }

  async findByTutor(tutorId: number) {
    return await this.sessionRepository.find({
      where: { tutorId },
      relations: ['student', 'topic']
    });
  }

  async findByStudent(studentId: number) {
    return await this.sessionRepository.find({
      where: { studentId },
      relations: ['tutor', 'topic']
    });
  }

  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const session = await this.findOne(id);
    Object.assign(session, updateSessionDto);
    return await this.sessionRepository.save(session);
  }

  async remove(id: number) {
    const session = await this.findOne(id);
    return await this.sessionRepository.remove(session);
  }

  async updateStatus(id: number, status: string) {
    const session = await this.findOne(id);
    session.status = status;
    return await this.sessionRepository.save(session);
  }
}
