import { body } from 'express-validator';

import { Category } from '../models/Category';

const category = new Category()

export const CategoryValidation = [

  body('name').not().isEmpty().trim().escape().
  withMessage("The Category name is Required!"),

  body('description').not().isEmpty().escape().
  withMessage("The Category description is Required!"),

  body('name').custom( async (value) => {
    // Check if the categoryname exists
    if (await category.categoryNameExist(value)) {
      throw new Error('The Category Already exists; Please choose another Category!');
    }
     // Indicates the success of this synchronous custom validator
     return true;
  }),

]