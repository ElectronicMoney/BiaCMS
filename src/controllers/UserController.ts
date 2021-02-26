import {Request, Response, NextFunction} from 'express'
import {User } from '../models/User';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from '../errors/ApiError'

export class UserController {
    // Declear the properies here
    user: User;

    constructor() {
        this.user = new User()
    }
  
    
    // Get All Users
    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.user.getUsers()

            if (!users) {
                next(ApiError.notFound('No User Found!'));
                return;
            }
            
            // Return users
            return users

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }


    // Get User
    async getUser(req: Request, res: Response, next: NextFunction) {

        try {
            const user  = await this.user.getUser(req.params.id)
            if (!user) {
                next(ApiError.notFound('No User Found!'));
                return;
            }
            // Return User
            return user
            
          } catch (err) {
            next(ApiError.internalServer(err.message));
            return
          }
    }


    // Create User
    async createUser (req: Request, res: Response, next: NextFunction) {

        try {
            const userPayload = {
                userId:    uuidv4(),
                firstName: req.body.firstName,
                lastName:  req.body.lastName,
                email:     req.body.email,
                username:  req.body.username,
                password:  req.body.password
            }

            // Check if username exist
            if (await this.user.usernameExist(userPayload.username)){

                next(ApiError.conflict('The Username Already exists; Please choose another username!'));
                return;
            }

            // Check if Email exist
            if (await this.user.emailExist(userPayload.email)){

                next(ApiError.conflict('Email Conflict: The Email Already exists; Please choose another email!'));
                return;
            
            }

            const user = await this.user.createUser(userPayload) 
            // Return User
            return user

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }


    // Update User
    async updateUser (req: Request, res: Response, next: NextFunction) {

        try {
            const userPayload = {
                firstName : req.body.firstName,
                lastName  : req.body.lastName
            }
           
            if (!req.params.id) {
                next(ApiError.badRequest('The User Id Is Required!'));
                return;
            }

            const user = await this.user.updateUser(
                req.params.id, 
                userPayload
            )  
            // Return User
            return user

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
          }

    }
    
    // Delete A user
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {

            if (!req.params.id) {
                next(ApiError.badRequest('The User Id Is Required!'));
                return;
            }

            await this.user.deleteUser(req.params.id)
            // return null
            return null

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }

}