import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne,
    JoinColumn,
    OneToMany
} from "typeorm";
import { CommentReply } from "./CommentReply";
import { Post } from "./Post";
import {User} from './User';


@Entity({'name': 'comments'})
export class Comment extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    commentId!: string;

    @Column('text')
    body!: string

    @Column('text', {nullable: true})
    mediaUrls!: string;

    @Column({default: true})
    status!: boolean;

    @Column({default: 0})
    totalLike!: number;

    @Column({default: false})
    hasReply!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.comments,
    { onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    user!: Promise<User>;

    @ManyToOne(() => Post, post => post.comments,
        { onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    post!: Promise<Post>;

    @OneToMany(() => CommentReply, commentReply => commentReply.comment)
    @JoinColumn()
    commentReplies!: Promise<CommentReply[]>;


    // Create Category
    async createComment(commentPaylaod: any): Promise<Comment> {
        // Create the instance of a comment
        const comment      = new Comment()
        comment.commentId  = commentPaylaod.commentId;
        comment.body       = commentPaylaod.body;
        comment.mediaUrls  = commentPaylaod.mediaUrls;
        comment.user       = commentPaylaod.user;
        comment.post       = commentPaylaod.post;
        const newComment   = await comment.save();
        return newComment; 
    }

    // Get All Comments
    async getComments(): Promise<Comment[]> {
        const categories = await Comment.find();
        return categories; 
    }

    // get A Comment
    async getComment(commentId: string): Promise<Comment> {

        const comment = await Comment.findOne({where: {commentId: commentId} });
        return comment!; 
    }


    // Update A Comment
    async updateComment(commentId: string, commentPayload: any): Promise<Comment> {

        const comment = await Comment.findOne({where: {commentId: commentId} });

        if(commentPayload.body) {
            comment!.body  = commentPayload.body
        }
        const updatedComment = await comment!.save();
        return updatedComment; 
    }

    // Delete A Comment
    async deleteComment (commentId: string): Promise<Comment> {
        const comment = await Comment.findOne({where: {commentId: commentId} });
        const deletedComment = await comment!.remove();
        return deletedComment
    }

}
