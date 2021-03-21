import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne
} from "typeorm";
import { Comment } from "./Comment";
import {User} from './User';


@Entity({'name': 'comment_replies'})
export class CommentReply extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    commentReplyId!: string;

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

    @ManyToOne(() => User, user => user.comments,
    { onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    user!: Promise<User>;

    @ManyToOne(() => Comment, comment => comment.commentReplies,
        { onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    comment!: Promise<Comment>;
    

    // Create Category
    async createCommentReply(commentReplyPaylaod: any): Promise<CommentReply> {
        // Create the instance of a comment
        const commentReply      = new CommentReply()
        commentReply.commentReplyId  = commentReplyPaylaod.commentReplyId;
        commentReply.body       = commentReplyPaylaod.body;
        commentReply.mediaUrls  = commentReplyPaylaod.mediaUrls;
        commentReply.user       = commentReplyPaylaod.user;
        commentReply.comment       = commentReplyPaylaod.comment;
        const newCommentReply   = await commentReply.save();
        // update the comment hasReply field
        let postComment       = commentReplyPaylaod.comment;
        postComment.hasReply = true;
        await postComment.save();

        return newCommentReply; 
    }

    // Get All CommentReplys
    async getCommentsReply(): Promise<CommentReply[]> {
        const categories = await CommentReply.find();
        return categories; 
    }

    // get A CommentReply
    async getCommentReply(commentReplyId: string): Promise<CommentReply> {

        const commentReply = await CommentReply.findOne({where: {commentReplyId: commentReplyId} });
        return commentReply!; 
    }


    // Update A CommentReply
    async updateCommentReply(commentReplyId: string, commentReplyPayload: any): Promise<CommentReply> {

        const commentReply = await CommentReply.findOne({where: {commentReplyId: commentReplyId} });

        if(commentReplyPayload.body) {
            commentReply!.body  = commentReplyPayload.body
        }
        const updatedCommentReply = await commentReply!.save();
        return updatedCommentReply; 
    }

    // Delete A CommentReply
    async deleteCommentReply (commentReplyId: string): Promise<CommentReply> {
        const commentReply = await CommentReply.findOne({where: {commentReplyId: commentReplyId} });
        const deletedCommentReply = await commentReply!.remove();
        return deletedCommentReply
    }

}
