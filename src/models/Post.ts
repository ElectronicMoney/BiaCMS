import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne
} from "typeorm";
import { Category } from "./Category";
import {User} from './User';


@Entity({'name': 'posts'})
export class Post extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    postId!: string;
    
    @Column({ length: 200})
    title!: string;

    @Column('text')
    body!: string

    @Column()
    mediaUrl!: string;

    @Column({default: true})
    status!: boolean;

    @Column({default: 0})
    totalLike!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.posts,
        { onUpdate: 'CASCADE', onDelete: "CASCADE", eager: true}
    )
    user!: User;

    @ManyToOne(() => Category, category => category.posts)
    category!: Category;
}
