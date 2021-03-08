import {Request, Response, NextFunction} from 'express'
import {Category } from '../models/Category';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from '../errors/ApiError'
import { validateRequestPayload } from '../validations';


export class CategoriesController {
    // Declear the properies here
    category: Category;
    isAuthorized: boolean;

    constructor() {
        this.isAuthorized = false;
        this.category = new Category()
    }


    // Create Category
    async createCategory (req: Request, res: Response, next: NextFunction) {
        try {
            // Call the validation output here
            const validateRequest = validateRequestPayload(req, res)
            // Check if we have any errors
            if(validateRequest!.hasErrors) {
                return validateRequest!.errorBody
            }

            const categoryPayload = {
                categoryId: uuidv4(),
                name:       req.body.name,
                description: req.body.description,
            }

            if(await req.user.isAdmin()){
                // Return Category
                this.isAuthorized = true;
            }

            //Check if the update permision is true
            if(this.isAuthorized) {
                const category = await this.category.createCategory(categoryPayload) 
                // Return CategcreateCategory
                return category

            } else {
                next(ApiError.forbidden("You don't have the permision to create this category resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }

    
    // Get All CategcreateCategorys
    async getCategories(req: Request, res: Response, next: NextFunction) {
        
        try {
         
            const categorys = await this.category.getCategories()

            if (!categorys) {
                next(ApiError.notFound('No Category Found!'));
                return;
            } 
            // Return categorys
            return categorys
           

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }


    // Get Category
    async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the category object
            const category  = await this.category.getCategory(req.params.id)
            // Check if we have category
            if(!category){
                next(ApiError.notFound('No Category Found for the given categoryId!'));
                return;
            }
            // return the category
            return category
            
          } catch (err) {
            next(ApiError.internalServer(err.message));
            return
          }
    }


    // Update Category
    async updateCategory (req: Request, res: Response, next: NextFunction) {

        let categoryPayload: any = {};

        try {
     
            if (!req.params.id) {
                next(ApiError.badRequest('The Category Id Is Required!'));
                return;
            }
            // Get the category usings its id
            let category = await this.category.getCategory(req.params.id)
             // Check if we have category
             if(!category){
                next(ApiError.notFound('No Category Found for the given categoryId!'));
                return;
            }

            if(await req.user.isAdmin()){
                // Return Category
                this.isAuthorized = true;
           } 

            //Check if the update permision is true
            if(this.isAuthorized) {
                if(req.body.name){
                    categoryPayload.name = req.body.name
                }
                if(req.body.description){
                    categoryPayload.description = req.body.description
                }
                category = await category.updateCategory(req.params.id, categoryPayload)
                // Return Category
                return category
            } else {
                next(ApiError.forbidden("You don't have the permision to update this category resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
          }

    }
    
    // Delete A category
    async deleteCategory(req: Request, res: Response, next: NextFunction) {

        try {

            if (!req.params.id) {
                next(ApiError.badRequest('The Category Id Is Required!'));
                return;
            }
            // Get the category usings its id
            let category = await this.category.getCategory(req.params.id)

            // Check if we have category
            if(!category){
                next(ApiError.notFound('No Category Found for the given categoryId!'));
                return;
            }
            
            if(await req.user.isAdmin()){
                // Return Category
                this.isAuthorized = true;
            }

            //Check if the update permision is true
            if(this.isAuthorized) {
                await this.category.deleteCategory(req.params.id)
                // return null
                return null
            } else {
                next(ApiError.forbidden("You don't have the permision to delete this category resource!"));
                return;
            }
      
        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }

}