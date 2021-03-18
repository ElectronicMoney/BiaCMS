import { body, query } from 'express-validator';

export const PostValidation = [
  query('categoryId').not().isEmpty().trim().escape().
  withMessage("The Category Id query string is Required!"),

  body('title').not().isEmpty().trim().escape().
  withMessage("The Post Title is Required!"),

  body('body').not().isEmpty().
  withMessage("The Post Body is Required!")
]