import {Request, Response, NextFunction} from 'express'
import {Adverticement } from '../models/Adverticement';
import { v4 as uuidv4 } from 'uuid';
import {ApiError} from '../errors/ApiError'
import { validateRequestPayload } from '../validations';


export class AdvertController {
    // Declear the properies here
    advert: Adverticement;
    isAuthorized: boolean;

    constructor() {
        this.isAuthorized = false;
        this.advert = new Adverticement()
    }


    // Create Adverticement
    async createAdverticement (req: Request, res: Response, next: NextFunction) {
        try {
            // Call the validation output here
            const validateRequest = validateRequestPayload(req, res)
            // Check if we have any errors
            if(validateRequest!.hasErrors) {
                return validateRequest!.errorBody
            }

            const advertPayload = {
                advertId: uuidv4(),
                name:       req.body.name,
                advertUrl: req.body.advertUrl,
            }

            if(await req.user.isAdmin()){
                // Return Adverticement
                this.isAuthorized = true;
            }

            //Check if the update permision is true
            if(this.isAuthorized) {
                const advert = await this.advert.createAdverticement(advertPayload) 
                // Return CategcreateAdverticement
                return advert

            } else {
                next(ApiError.forbidden("You don't have the permision to create this advert resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }

    }

    
    // Get All CategcreateAdverticements
    async getAdverticements(req: Request, res: Response, next: NextFunction) {
        
        try {
         
            const adverts = await this.advert.getAdverticements()

            if (!adverts) {
                next(ApiError.notFound('No Adverticement Found!'));
                return;
            } 
            // Return adverts
            return adverts
           

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }


    // Get Adverticement
    async getAdverticement(req: Request, res: Response, next: NextFunction) {
        try {
            // Get the advert object
            const advert  = await this.advert.getAdverticement(req.params.id)
            // Check if we have advert
            if(!advert){
                next(ApiError.notFound('No Adverticement Found for the given advertId!'));
                return;
            }
            // return the advert
            return advert
            
          } catch (err) {
            next(ApiError.internalServer(err.message));
            return
          }
    }


    // Update Adverticement
    async updateAdverticement (req: Request, res: Response, next: NextFunction) {

        let advertPayload: any = {};

        try {
     
            if (!req.params.id) {
                next(ApiError.badRequest('The Adverticement Id Is Required!'));
                return;
            }
            // Get the advert usings its id
            let advert = await this.advert.getAdverticement(req.params.id)
             // Check if we have advert
             if(!advert){
                next(ApiError.notFound('No Adverticement Found for the given advertId!'));
                return;
            }

            if(await req.user.isAdmin()){
                // Return Adverticement
                this.isAuthorized = true;
           } 

            //Check if the update permision is true
            if(this.isAuthorized) {
                if(req.body.name){
                    advertPayload.name = req.body.name
                }
                if(req.body.advertUrl){
                    advertPayload.advertUrl = req.body.advertUrl
                }
                advert = await advert.updateAdverticement(req.params.id, advertPayload)
                // Return Adverticement
                return advert
            } else {
                next(ApiError.forbidden("You don't have the permision to update this advert resource!"));
                return;
            }

        } catch(err){
            next(ApiError.internalServer(err.message));
            return
          }

    }
    
    // Delete A advert
    async deleteAdverticement(req: Request, res: Response, next: NextFunction) {

        try {

            if (!req.params.id) {
                next(ApiError.badRequest('The Adverticement Id Is Required!'));
                return;
            }

            // Get the advert usings its id
            let advert = await this.advert.getAdverticement(req.params.id)

            // Check if we have advert
            if(!advert){
                next(ApiError.notFound('No Adverticement Found for the given advertId!'));
                return;
            }
            
            if(await req.user.isAdmin()){
                // Return Adverticement
                this.isAuthorized = true;
            }

            //Check if the update permision is true
            if(this.isAuthorized) {
                await this.advert.deleteAdverticement(req.params.id)
                // return null
                return null
            } else {
                next(ApiError.forbidden("You don't have the permision to delete this advert resource!"));
                return;
            }
      
        } catch(err){
            next(ApiError.internalServer(err.message));
            return
        }
    }

}