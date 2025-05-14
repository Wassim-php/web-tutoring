import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Session } from 'src/session/entities/session.entity';

@Entity()
export class Student {
  @PrimaryColumn()
  id: number;

  @Column({ length: 20 })
  gradeLevel: string;

  @Column({ 
    type: 'timestamp', 
    default: () => 'CURRENT_TIMESTAMP' 
  })
  enrolledDate: Date;

  @Column({ length: 20 })
  major: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id' })
  user: User;

  @OneToMany(() => Session, session => session.student)
  sessions: Session[];
}


