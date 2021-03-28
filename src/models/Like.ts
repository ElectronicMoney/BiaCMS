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
import { CommentReply } from "./CommentReply";
import { Post } from "./Post";
import {User} from './User';


@Entity({'name': 'likes'})
export class Like extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ length: 64, unique: true })
    likeId!: string;

    @Column({default: true})
    isActive!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @ManyToOne(() => User, user => user.likes,
    { onUpdate: 'CASCADE', onDelete: "CASCADE"}
    )
    user!: Promise<User>;

    @ManyToOne(() => Post, post => post.likes,
        { onUpdate: 'CASCADE', onDelete: "CASCADE", nullable: true}
    )
    post!: Promise<Post>;

    @ManyToOne(() => Comment, comment => comment.likes,
    { onUpdate: 'CASCADE', onDelete: "CASCADE", nullable: true}
    )
    comment!: Promise<Comment>;

    @ManyToOne(() => CommentReply, commentReply => commentReply.likes,
    { onUpdate: 'CASCADE', onDelete: "CASCADE", nullable: true}
    )
    commentReply!: Promise<CommentReply>;


    // Check if the user already liked the content
    async userLikedContent(user: any, content:any): Promise<boolean> {
        let likes = await content.likes;

        let likeStatus = false;

        for(let like of likes ) {
            // Loop through the likes and find if any user match
            if((await like.user.userId) === user.userId) {
                likeStatus = true
            }
        }

        return likeStatus;
    }

    // Create Like
    async createLike(likePaylaod: any): Promise<any> {
        // Create the instance of a comment
        let like = new Like()
        let post = likePaylaod.post

        like.likeId = likePaylaod.likeId;
        like.user   = likePaylaod.user;
        like.post   = post;

        if(likePaylaod.hasOwnProperty('comment')){
            // Increement comment like
            let comment = likePaylaod.comment
            const userLikedContent = await this.userLikedContent(like.user, comment)
            //  Check if the user already liked the content
            if (!userLikedContent) {
                // Increement comment like
                comment.totalLike += 1
                comment = await comment.save()
            }

            like.comment = comment
            await like.save();
            // Return the comment
            return {
                commentId: comment.commentId,
                body: comment.body,
                mediaUrls: comment.mediaUrls,
                totalLike: comment.totalLike,
                hasReply: comment.hasReply,
                status: comment.status,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt
            }

        }else if(likePaylaod.hasOwnProperty('commentReply')){

            // Increement commentReply like
            let commentReply = likePaylaod.commentReply
            const userLikedContent = await this.userLikedContent(like.user, commentReply)
            //  Check if the user already liked the content
            if (!userLikedContent) {
                // Increement comment like
                commentReply.totalLike += 1
                commentReply = await commentReply.save()
            }

            like.commentReply = commentReply
            await like.save();

            // Return the comment reply
            return {
                commentReplyId: commentReply.commentReplyId,
                body: commentReply.body,
                mediaUrls: commentReply.mediaUrls,
                totalLike: commentReply.totalLike,
                hasReply: commentReply.hasReply,
                status: commentReply.status,
                createdAt: commentReply.createdAt,
                updatedAt: commentReply.updatedAt
            }

        } else {
            let contentPost= await like.post 
            const userLikedContent = await this.userLikedContent(like.user, contentPost)
            //  Check if the user already liked the content
            if (!userLikedContent) {
                // Increement post like
                post.totalLike += 1
                post = await post.save()
            }
            like.post = post
            like = await like.save();
            // Return the like
            return {
                postId: post.postId,
                title: post.title,
                body: post.body,
                status: post.status,
                mediaUrls: post.mediaUrls,
                totalLike: post.totalLike,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
            }
        }
  
    }

    // Delete A Comment
    async deleteLike (likeId: string, content: any): Promise<Like> {
        content.totalLike -= 1;
        content = await content.save()
        
        const like = await Like.findOne({where: {likeId: likeId} });
        const deletedLike = await like!.remove();
        return deletedLike
    }

}
