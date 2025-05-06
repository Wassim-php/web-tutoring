import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionGateway } from '../gateways/session.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { JwtModule} from '@nestjs/jwt';
@Module({
  imports: [
     TypeOrmModule.forFeature([Session]),
     JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1d'},
     }),
],
  controllers: [SessionController],
  providers: [SessionService, SessionGateway],
  exports: [SessionService],
})
export class SessionModule {}
