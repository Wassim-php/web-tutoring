import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from 'src/messages/messages.service';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST'],
        allowedHeaders: ['authorization', 'Content-Type']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    namespace: 'chat',
    allowEIO3: true
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private messagesService: MessagesService,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                throw new Error('No token provided');
            }

            // Clean token - remove Bearer prefix if it exists
            const cleanToken = token.replace('Bearer ', '');

            const secret = this.configService.get<string>('JWT_SECRET');
            
            // Add debug logging
            console.log('JWT_SECRET loaded:', !!secret);

            if (!secret) {
                throw new Error('JWT_SECRET not configured');
            }

            try {
                const payload = await this.jwtService.verifyAsync(cleanToken, {
                    secret: secret
                });
                
                client.data.user = payload;
                console.log('Client authenticated:', client.id);
                
            } catch (jwtError) {
                console.error('JWT verification failed:', jwtError.message);
                throw new Error('Invalid token');
            }

        } catch (error) {
            console.error('Authentication error:', error.message);
            client.emit('error', { message: 'Authentication failed' });
            client.disconnect(true);
        }
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected: ', client.id);

    }
    @SubscribeMessage('sendMessage')
    async handleMessage(client: Socket, payload: {
        content: string,
        chat_id: number,
        user_id: number
    }) {
        try {
            const message = await this.messagesService.create({
                content: payload.content,
                chat_id: payload.chat_id,
                user_id: payload.user_id,
                is_read: false
            });

            // Emit to all clients in the chat room
            this.server.to(`chat_${payload.chat_id}`).emit('newMessage', message);
            return message;
        } catch (error) {
            console.error('Error creating message:', error);
            throw new WsException('Failed to create message');
        }
    }

    @SubscribeMessage('joinSession')
    handleJoinSession(client: Socket, chat_id: number) {
        if (!chat_id) {
            throw new WsException('No chat ID provided');
        }
        
        client.join(`chat_${chat_id}`);
        console.log(`Client ${client.id} joined chat ${chat_id}`);
    }

    @SubscribeMessage('leaveSession')
    handleSLeaveSession(client: Socket, chat_id:  number){
        client.leave(`session_${chat_id}`);
    }
}