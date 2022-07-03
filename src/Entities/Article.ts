import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Users from "./User";


@Entity()
class Articles {
    constructor(id: number) {
        this.id = id;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    content: string;

    @Column({ type: 'text', nullable: false })
    snippet: string;

    @Column({ type: 'timestamp', nullable: true })
    approved: Date;

    @ManyToOne(() => Users)
    author: Users;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;
}

export default Articles;
