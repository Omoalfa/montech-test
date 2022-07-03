import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { IsEmail } from 'class-validator'

@Entity()
class Users {
    constructor(id: number) {
        this.id = id;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({ type: 'enum', enum: ['author', 'editor'], default: 'author' })
    role: 'author' | 'editor';

    @Column({ type: 'text', select: false, nullable: false })
    password: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;

    @DeleteDateColumn({type: 'timestamp'})
    deletedAt: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;
}

export default Users;
