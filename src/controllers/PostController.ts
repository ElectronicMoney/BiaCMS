import {Request, Response, NextFunction} from 'express'
import {User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from '../errors/ApiError'
import {API_URL} from '../config';
import { validateRequestPayload } from '../validations';
import { Post } from '../models/Post';
import { Category } from '../models/Category';
import { postParser } from '../utils/helpers';


export class PostController {
    // Declear the properies here

    isAuthorized: boolean;
    user: User;
    post: Post;
    category: Category;

    constructor() {
        this.isAuthorized = false;
        this.user = new User()
        this.post = new Post()
        this.category = new Category()
    }


    // Create Post
    async createPost (req: Request, res: Response, next: NextFunction) {
        try {
            let mediaUrls: any = [];
            // Call the validation output here
            const validateRequest = validateRequestPayload(req, res)
            // Check if we have any errors
            if(validateRequest!.hasErrors) {
                return validateRequest!.errorBody
            }

            // get category using the categoryId
            const catId:string = String(req.query.categoryId)
            const category  = await this.category.getCategory(catId)

            // Get the media names if it is not empty
            if(req.body.mediaMetadata) {
                req.body.mediaMetadata.forEach((metadata: any) => {
                    // use regular expretion to change originalName 
                    // in the post body to the generatedName
                    mediaUrls.push(`${API_URL}/static/images/posts/${metadata.generatedName}`);
                });
            }

            // Parsing the post body
            let postBody = postParser(req.body)

            const postPayload = {
                postId: uuidv4(),
                title:  req.body.title,
                body:   postBody,
                mediaUrls: mediaUrls.toString(), 
                author: req.user,
                category: category
            }
                   
            if(await req.user.isAdmin() || await req.user.isAuthor() ){
                // Return User
                this.isAuthorized = true;
            }
            //Check if the update permision is true
            if(this.isAuthorized) {
                const post = await this.post.createPost(postPayload) 
                // Return User
                return post
            } else {
                next(ApiError.forbidden("You don't have the permision to create this post resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }


    // Create Post
    async uploadPostMedias (req: Request, res: Response, next: NextFunction) {
        try {
            // req.files is array of `mediaUrls` files
            // req.body will hold the text fields, if there were any
            const files = req.files
                   
            if(await req.user.isAdmin() || await req.user.isAuthor() ){
                // Return User
                this.isAuthorized = true;
            }
            //Check if the update permision is true
            if(this.isAuthorized) {
                // Return mediaUrs
                return files
            } else {
                next(ApiError.forbidden("You don't have the permision to upload any post media resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }

    
    // Get All Posts
    async getPosts(req: Request, res: Response, next: NextFunction) {
        
        try {
            const posts = await this.post.getPosts()

            if (!posts) {
                next(ApiError.notFound('No Post Found!'));
                return;
            } 
            // Return posts
            return posts
        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }


    // Get Post
    async getPost(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the user object
            const post  = await this.post.getPost(req.params.id)
            // Check if we have user
            if(!post){
                next(ApiError.notFound('No Post Found for the given post Id!'));
                return;
            }

            return post;
        
          } catch (err) {
            next(ApiError.internalServer(err.message));
            return
          }
    }


    // Update Post
    async updatePost (req: Request, res: Response, next: NextFunction) {

        let postPayload: any = {};

        try {
     
            if (!req.params.id) {
                next(ApiError.badRequest('The Post Id Is Required!'));
                return;
            }
            // Get the post usings its id
            let post = await this.post.getPost(req.params.id)
             // Check if we have post
             if(!post){
                next(ApiError.notFound('No Post Found for the given post Id!'));
                return;
            }

            if(await req.user.isAdmin() || await req.user.isEditor()){
                // Return Post
                this.isAuthorized = true;
           } else if(await req.user.isAuthor()) {
                //Check if the auth user is the author of the post
                if(req.user.id  ===  (await post.author).id){
                    this.isAuthorized = true;
                } 
           } else {
                this.isAuthorized = false;
           }

            //Check if the update permision is true
            if(this.isAuthorized) {
                if(req.body.title){
                    postPayload.title = req.body.title
                }
                if(req.body.body){
                    postPayload.body = req.body.body
                }
                post = await post.updatePost(req.params.id, postPayload)
                // Return User
                return post
            } else {
                next(ApiError.forbidden("You don't have the permision to update this post resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
          }

    }
    
    // Delete A Post
    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {

            if (!req.params.id) {
                next(ApiError.badRequest('The User Id Is Required!'));
                return;
            }
            // Get the post usings its id
            let post = await this.post.getPost(req.params.id)

            // Check if we have post
            if(!post){
                next(ApiError.notFound('No Post Found for the given post Id!'));
                return;
            }
            
            if(await req.user.isAdmin()){
                // Return User
                this.isAuthorized = true;

            } else if(await req.user.isAuthor()) {
                //Check if the auth user is the author of the post
                if(req.user.id  === (await post.author).id){
                    this.isAuthorized = true;
                } 
           } else {
                this.isAuthorized = false;
           }

            //Check if the update permision is true
            if(this.isAuthorized) {
                await this.user.deleteUser(req.params.id)
                // return null
                return null
            } else {
                next(ApiError.forbidden("You don't have the permision to delete this post resource!"));
                return;
            }
      
        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }

}