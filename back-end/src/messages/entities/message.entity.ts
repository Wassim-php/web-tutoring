import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Chat } from '../../chats/entities/chat.entity';
import { User } from '../../users/entities/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column()
    chat_id: number;

    @Column()
    user_id: number;

    @CreateDateColumn()
    sent_at: Date;

    @Column({ default: false })
    is_read: boolean;

    @ManyToOne(() => Chat)
    @JoinColumn({ name: 'chat_id' })
    chat: Chat;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
