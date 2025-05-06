import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Session } from '../../session/entities/session.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    session_id: number;

    @Column()
    user_id: number;

    @Column()
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    sent_at: Date;

    @Column({ default: false })
    is_read: boolean;

    @ManyToOne(() => Session)
    @JoinColumn({ name: 'session_id' })
    session: Session;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
