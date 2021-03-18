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

    @Column('text', {nullable: true})
    mediaUrls!: string;

    @Column({default: true})
    status!: boolean;

    @Column({default: 0})
    totalLike!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.posts,
        { onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    author!: User;

    @ManyToOne(() => Category, category => category.posts)
    category!: Category;


    // Create Category
    async createPost(postPaylaod: any): Promise<Post> {
        // Create the instance of a post
        const post    = new Post()
        post.postId   = postPaylaod.postId;
        post.title    = postPaylaod.title;
        post.body     = postPaylaod.body;
        post.mediaUrls = postPaylaod.mediaUrls;
        post.category = postPaylaod.category;
        const newPost = await post.save();
        return newPost; 
    }

    // Get All Posts
    async getPosts(): Promise<Post[]> {
        const categories = await Post.find();
        return categories; 
    }

    // get A Post
    async getPost(postId: string): Promise<Post> {

        const post = await Post.findOne({where: {postId: postId} });
        return post!; 
    }


    // Update A Post
    async updatePost(postId: string, postPayload: any): Promise<Post> {

        const post = await Post.findOne({where: {postId: postId} });

        if(postPayload.name) {
            post!.title = postPayload.title
        }

        if(postPayload.description) {
            post!.body  = postPayload.body
        }
        const updatedPost = await post!.save();
        return updatedPost; 
    }

    // Delete A Post
    async deletePost (postId: string): Promise<Post> {
        const post = await Post.findOne({where: {postId: postId} });
        const deletedPost = await post!.remove();
        return deletedPost
    }

}
