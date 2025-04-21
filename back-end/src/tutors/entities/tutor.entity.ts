import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { Session } from '../../session/entities/session.entity';
@Entity()
export class Tutor {
  @PrimaryColumn()
  id: number;

  @Column('text')
  bio: string;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @Column('varchar', { length: 255 })
  certifications: string;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  joinedDate: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @Column({type: 'text', nullable: true})
  profilePicture: string;

  @ManyToMany(() => Topic, topic => topic.tutors)
  @JoinTable({
    name: 'tutor_topics',
    joinColumn: {
      name: 'tutor_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'topic_id',
      referencedColumnName: 'id'
    }
  })
  topics: Topic [];

  @OneToMany (() => Session, session => session.tutor)
  sessions: Session[];
}
