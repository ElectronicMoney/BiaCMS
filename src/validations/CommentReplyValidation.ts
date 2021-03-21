import { body, param } from 'express-validator';

export const CommentReplyValidation = [
  param('commentId').not().isEmpty().trim().escape().
  withMessage("The Comment Id parameter is Required!"),

  body('body').not().isEmpty().
  withMessage("The Comment Body is Required!")
]