import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Topic } from '../../topics/entities/topic.entity';
import { Session } from '../../session/entities/session.entity';
@ObjectType()
@Entity()
export class Tutor {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column('text')
  bio: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  @Column('varchar', { length: 255, nullable: true })
  certifications?: string;

  @Field({ nullable: true })
  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true
  })
  joinedDate?: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

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
