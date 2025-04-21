import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Tutor } from '../../tutors/entities/tutor.entity';
@Entity()
export class Topic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    is_active: boolean;

    @ManyToMany (() => Tutor, tutor => tutor.topics)
    tutors: Tutor[];

}
