import { body, param } from 'express-validator';

export const CommentValidation = [
  param('postId').not().isEmpty().trim().escape().
  withMessage("The Post Id parameter is Required!"),

  body('body').not().isEmpty().
  withMessage("The Comment Body is Required!")
]