import {Request, Response, NextFunction} from 'express'
import {User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from '../errors/ApiError'
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { Like } from '../models/Like';
import { CommentReply } from '../models/CommentReply';


export class LikeController {
    // Declear the properies here

    isAuthorized: boolean;
    user: User;
    post: Post;
    comment: Comment;
    commentReply: CommentReply;
    like: Like;
    postComments: any[]

    constructor() {
        this.isAuthorized = false;
        this.user = new User()
        this.post = new Post()
        this.comment = new Comment()
        this.commentReply = new CommentReply()
        this.like = new Like()
        this.postComments = []
    }


    // Create Comment
    async createLike (req: Request, res: Response, next: NextFunction) {
        try {

            // Get the user object
            const post  = await this.post.getPost(req.params.postId)

            const likePayload: any = {
                likeId: uuidv4(),
                user: req.user,
                post: post
            } 

            console.log(req.query);

            if (req.query.commentId) {
                likePayload.comment = await this.comment.getComment(String(req.query.commentId))
            }

            if (req.query.commentReplyId) {
                likePayload.commentReply = await this.commentReply.getCommentReply(String(req.query.commentReplyId))
            }

            // Return like
            return await this.like.createLike(likePayload) 

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }


    
}