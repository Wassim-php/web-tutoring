import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Session } from 'src/session/entities/session.entity';

@ObjectType()
@Entity()
export class Student {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  gradeLevel: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  major?: string;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  enrolledDate: Date;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => Session, session => session.student)
  sessions: Session[];
}


