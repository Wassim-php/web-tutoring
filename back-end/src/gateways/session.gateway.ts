import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
})
export class SessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        throw new UnauthorizedException();
      }
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  notifyNewSession(tutorId: number) {
    this.server.emit('newSessionRequest', { tutorId });
  }

  notifySessionUpdate(tutorId: number) {
    this.server.emit('sessionStatusUpdate', { tutorId });
  }
}