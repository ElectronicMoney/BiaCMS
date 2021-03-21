import {
    BaseEntity, 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToOne,
    OneToMany,
    JoinColumn
} from "typeorm";
import { Category } from "./Category";
import { Comment } from "./Comment";
import { CommentReply } from "./CommentReply";
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
    author!: Promise<User>;

    @ManyToOne(() => Category, category => category.posts)
    category!: Promise<Category>;

    @OneToMany(() => Comment, comment => comment.post)
    @JoinColumn()
    comments!: Promise<Comment[]>;


    // Create Category
    async createPost(postPaylaod: any): Promise<Post> {
        // Create the instance of a post
        const post    = new Post()
        post.postId   = postPaylaod.postId;
        post.title    = postPaylaod.title;
        post.body     = postPaylaod.body;
        post.mediaUrls = postPaylaod.mediaUrls;
        post.author = postPaylaod.author;
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

        if(postPayload.title) {
            post!.title = postPayload.title
        }

        if(postPayload.body) {
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

    // Get All Comments
    async  getPostComments(postId:string) {

        let postComments: any[] = []

        //get post
        let post = await this.getPost(postId);
        let comments = await post.comments

        for(let comment of comments) {

            if(comment.hasReply) {
                const commentReplies = await comment.commentReplies
                let replies: any[] = []
                // get the author for each comment reply
                for(let reply of commentReplies) {
                    const user = await reply.user
                    replies.push({
                        commentReplyIf: reply.commentReplyId,
                        body: reply.body,
                        mediaUrls: reply.mediaUrls,
                        status: reply.status,
                        totalLike: reply.totalLike,
                        createdAt: reply.createdAt,
                        updatedAt: reply.updatedAt,
                        commentReplyUser: {
                            userId: user.userId,
                            name: `${user.firstName} ${user.lastName}`,
                            avatarUrl: (await user.profile).avatarUrl
                        }
                    })
                }

                postComments.push({
                    commentId: comment.commentId,
                    body: comment.body,
                    mediaUrls: comment.mediaUrls,
                    status: comment.status,
                    totalLike: comment.totalLike,
                    hasReply: comment.hasReply,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,

                    commentUser: {
                        userId: (await comment.user).userId,
                        name: `${(await comment.user).firstName} ${(await comment.user).lastName}`,
                        avatarUrl:  (await (await comment.user).profile).avatarUrl
                    },

                    commentReplies: replies
                })
            } else {
                postComments.push({
                    commentId: comment.commentId,
                    body: comment.body,
                    mediaUrls: comment.mediaUrls,
                    status: comment.status,
                    totalLike: comment.totalLike,
                    hasReply: comment.hasReply,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,

                    commentUser: {
                        userId: (await comment.user).userId,
                        name: `${(await comment.user).firstName} ${(await comment.user).lastName}`,
                        avatarUrl:  (await (await comment.user).profile).avatarUrl
                    },

                    commentReplies: []
                })
            }
        };

        return postComments
    }

}
