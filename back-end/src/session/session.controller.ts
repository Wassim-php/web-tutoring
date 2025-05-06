import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionGateway } from '../gateways/session.gateway';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateSessionStatusDto } from '../session/dto/update-session.dto';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly sessionGateway: SessionGateway
  ) {}

  @Post()
  async createSession(@Body() createSessionDto: CreateSessionDto) {
    const session = await this.sessionService.create(createSessionDto);
    this.sessionGateway.notifyNewSession(session.tutorId);
    return session;
  }

  @Get()
  findAll() {
    return this.sessionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionService.findOne(+id);
  }
  
  @Get('accepted/:tutorId')
    async findAccepted(@Param('tutorId')tutorId: string){
      return this.sessionService.findAccepted(+tutorId);
 }

  @Get('stAccepted/:studentId')
  async findStAccepted(@Param('studentId')studentId: string){
    return this.sessionService.findStAccepted(+studentId);
  }

  @Get('tutor/:tutorId')
  findByTutor(@Param('tutorId') tutorId: string) {
    return this.sessionService.findByTutor(+tutorId);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.sessionService.findByStudent(+studentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionService.update(+id, updateSessionDto);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const session = await this.sessionService.updateStatus(+id, { status });
    this.sessionGateway.notifySessionUpdate(session.tutorId);
    return session;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionService.remove(+id);
  }
}
