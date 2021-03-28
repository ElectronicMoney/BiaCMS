import { body } from 'express-validator';

import { Adverticement } from '../models/Adverticement';

const advert = new Adverticement()

export const AdvertValidation = [

  body('name').not().isEmpty().trim().escape().
  withMessage("The Adverticement name is Required!"),

  body('name').custom( async (value) => {
    // Check if the advertname exists
    if (await advert.advertNameExist(value)) {
      throw new Error(`The Adverticement ${value} Already exists; Please choose another Adverticement!`);
    }
     // Indicates the success of this synchronous custom validator
     return true;
  }),

  body('advertUrl').not().isEmpty().
  withMessage("The Adverticement Url is Required!"),

]