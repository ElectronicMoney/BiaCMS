import {Request, Response, NextFunction} from 'express'
import {User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from '../errors/ApiError'
import {API_URL} from '../config';
import { validateRequestPayload } from '../validations';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';


export class CommentController {
    // Declear the properies here

    isAuthorized: boolean;
    user: User;
    post: Post;
    comment: Comment;
    postComments: any[]

    constructor() {
        this.isAuthorized = false;
        this.user = new User()
        this.post = new Post()
        this.comment = new Comment()
        this.postComments = []
    }


    // Create Comment
    async createComment (req: Request, res: Response, next: NextFunction) {
        try {
            let mediaUrls: any = [];
            // Call the validation output here
            const validateRequest = validateRequestPayload(req, res)
            // Check if we have any errors
            if(validateRequest!.hasErrors) {
                return validateRequest!.errorBody
            }

            // Get the user object
            const post  = await this.post.getPost(req.params.postId)

            // Get the media names if it is not empty
            if(req.body.mediaMetadata) {
                req.body.mediaMetadata.forEach((metadata: any) => {
                    // use regular expretion to change originalName 
                    // in the comment body to the generatedName
                    mediaUrls.push(`${API_URL}/static/images/posts/${metadata.generatedName}`);
                });
            }

            const commentPayload = {
                commentId: uuidv4(),
                body:   req.body.body,
                mediaUrls: mediaUrls.toString(), 
                user: req.user,
                post: post
            } 
            // Return comment
            return await this.comment.createComment(commentPayload) 

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }


    // Create Comment
    async uploadCommentMedias (req: Request, res: Response, next: NextFunction) {
        try {
            // req.files is array of `mediaUrls` files
            // req.body will hold the text fields, if there were any
            const files = req.files
            // Return mediaUrs
            return files

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }

    
    // Get All Comments
    async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            // Get 
            return await this.post.getPostComments(req.params.postId)
        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }


    // Get Comment
    async getComment(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the user object
            const comment  = await this.comment.getComment(req.params.id)
            // Check if we have user
            if(!comment){
                next(ApiError.notFound('No Comment Found for the given comment Id!'));
                return;
            }

            return comment;
        
          } catch (err) {
            next(ApiError.internalServer(err.message));
            return
          }
    }


    // Update Comment
    async updateComment (req: Request, res: Response, next: NextFunction) {

        let commentPayload: any = {};

        try {
     
            if (!req.params.commentId) {
                next(ApiError.badRequest('The Comment Id Is Required!'));
                return;
            }
            // Get the comment usings its id
            let comment = await this.comment.getComment(req.params.commentId)
             // Check if we have comment
             if(!comment){
                next(ApiError.notFound('No Comment Found for the given comment Id!'));
                return;

            } else if(req.user.id  === (await comment.user).id) {
                //Check if the auth user is the one that made the comment
                this.isAuthorized = true;
            } else {
                this.isAuthorized = false;
            }

            //Check if the update permision is true
            if(this.isAuthorized) {
                if(req.body.body){
                    commentPayload.body = req.body.body
                }
                comment = await comment.updateComment(req.params.commentId, commentPayload)
                // Return User
                return {...comment, user: await comment.user}
            } else {
                next(ApiError.forbidden("You don't have the permision to update this comment resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
          }

    }
    
    // Delete A Comment
    async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {

            if (!req.params.commentId) {
                next(ApiError.badRequest('The User Id Is Required!'));
                return;
            }
            // Get the comment usings its id
            let comment = await this.comment.getComment(req.params.commentId)
            // Check if we have comment
            if(!comment){
                next(ApiError.notFound('No Comment Found for the given comment Id!'));
                return;
            }
            
            if(await req.user.isAdmin()){
                // Return User
                this.isAuthorized = true;

            } else if(req.user.id  === (await comment.user).id) {
                //Check if the auth user is the one that made the comment
                this.isAuthorized = true;
           } else {
                this.isAuthorized = false;
           }

            //Check if the update permision is true
            if(this.isAuthorized) {
                await comment.deleteComment(req.params.commentId)
                // return null
                return null
            } else {
                next(ApiError.forbidden("You don't have the permision to delete this comment resource!"));
                return;
            }
      
        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }

}