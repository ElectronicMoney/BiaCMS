import {Router, Request, Response, NextFunction} from 'express'
import {auth} from '../middlewares/Auth';
import {POSTS_UPLOAD} from '../config'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import { PostController } from '../controllers/PostController';
import {checkFileExtention} from '../utils/helpers';
import {PostValidation} from '../validations/PostValidation';
import {CommentValidation} from '../validations/CommentValidation';
import {CommentReplyValidation} from '../validations/CommentReplyValidation';
import { CommentController } from '../controllers/CommentController';
import { CommentReplyController } from '../controllers/CommentReplyController';


// Create the Instance of Controllers
const postController   = new PostController()
const commentController = new CommentController()
const commentReplyController = new CommentReplyController()

const postRoutes = Router()

let fileName = "";

// File Storage Engine
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${POSTS_UPLOAD}`)
    },
    filename: (req, file, cb) => {
        // Create fileName for the uploaded file
        fileName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, `${fileName}`)
    }
})

//Initialize the upload
const upload = multer({
    storage: fileStorageEngine ,
    limits: {fileSize: 1000000},
    fileFilter: (req, file, cb) => {
        checkFileExtention(file, cb)
    }
})


// Create Post Route
postRoutes.post('/', PostValidation, auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await postController.createPost(req, res, next))
});

// Create Post Route
postRoutes.post('/uploads', auth, upload.array('mediaUrls', 12), async (req: Request, res: Response, next: NextFunction) => {
    res.send(await postController.uploadPostMedias(req, res, next))
});

// Get All Posts Route
postRoutes.get('/', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await postController.getPosts(req, res, next))
});

// Update Post Route
postRoutes.put('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await postController.updatePost(req, res, next))
});

// Get Post Route
postRoutes.get('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await postController.getPost(req, res, next))
});

// Get Post Route
postRoutes.delete('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).send(await postController.deletePost(req, res, next))
});

// Create Comment Route
postRoutes.post('/:postId/comments', CommentValidation, auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentController.createComment(req, res, next))
});

// Get Comments Route
postRoutes.get('/:postId/comments', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentController.getComments(req, res, next))
});

// Get Comment Route
postRoutes.get('/:postId/comments/:commentId', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentController.getComment(req, res, next))
});

// Update Comment Route
postRoutes.put('/:postId/comments/:commentId', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentController.updateComment(req, res, next))
});

// Delete Comment Route
postRoutes.delete('/:postId/comments/:commentId', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).send(await commentController.deleteComment(req, res, next))
});


// Upload Comment Media Route
postRoutes.post('/:postId/comments/uploads', auth, upload.array('mediaUrls', 12), async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentController.uploadCommentMedias(req, res, next))
});


// Create Comment Route
postRoutes.post('/comments/:commentId/replies', CommentReplyValidation, auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentReplyController.createComment(req, res, next))
});

// Get Comments Route
postRoutes.get('/comments/:commentId/replies', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentReplyController.getComments(req, res, next))
});

// Get Comment Route
postRoutes.get('/comments/:commentId/replies/replyId', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentReplyController.getComment(req, res, next))
});

// Update Comment Route
postRoutes.put('/comments/:commentId/replies/:replyId', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentReplyController.updateComment(req, res, next))
});

// Delete Comment Route
postRoutes.delete('/comments/:commentId/replies/:replyId', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).send(await commentReplyController.deleteComment(req, res, next))
});

// Upload Comment Media Route
postRoutes.post('/comments/:commentId/replies/uploads', auth, upload.array('mediaUrls', 12), async (req: Request, res: Response, next: NextFunction) => {
    res.send(await commentReplyController.uploadCommentMedias(req, res, next))
});


export default postRoutes


