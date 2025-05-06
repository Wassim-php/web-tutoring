import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from 'src/messages/messages.service';
import { UnauthorizedException } from '@nestjs/common';
@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
        }
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    server: Server;

    constructor(
        private messageService: MessagesService,
        private jwtService: JwtService
    ){}

    async handleConnection(client: Socket) {
        try{
            const token = client.handshake.auth.token;
            if(!token) throw new UnauthorizedException();
            const payload = this.jwtService.verify(token);
            client.data.user = payload;
            client.join(`user_${payload.id}`);
        }catch(error){
            client.disconnect();
        }
    }
    handleDisconnect(client: Socket) {
        console.log('Client disconnected: ', client.id);

    }
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: {
        content: string,
        sessionId: number,
        userId: number
    }){
        const message = await this.messageService.create({
            content: payload.content,
            session_id: payload.sessionId,
            user_id: payload.userId,
            is_read: false
        });
        this.server.to(`user_${payload.sessionId}`).emit('newMessage', message);
        return message;
    }
    @SubscribeMessage('joinSession')
    handleJoinSession(client: Socket, sessionId: number){
        client.join(`session_${sessionId}`)
    }
    @SubscribeMessage('leaveSession')
    handleSLeaveSession(client: Socket, sessionId:  number){
        client.leave(`session_${sessionId}`);
    }
}