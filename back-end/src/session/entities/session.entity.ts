import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Tutor } from '../../tutors/entities/tutor.entity';
import { Topic } from '../../topics/entities/topic.entity';

@Entity()
export class Session {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'studentId' })
    student: User;

    @Column()
    studentId: number;

    @ManyToOne(() => Tutor, { eager: true })
    @JoinColumn({ name: 'tutorId' })
    tutor: Tutor;

    @Column()
    tutorId: number;

    @ManyToOne(() => Topic, { eager: true })
    @JoinColumn({ name: 'topicId' })
    topic: Topic;

    @Column()
    topicId: number;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column()
    duration_minutes: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ default: 'false' })
    status: string;

    @CreateDateColumn()
    schedueled_at: Date;
}
