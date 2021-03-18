import {Router, Request, Response, NextFunction} from 'express'
import {auth} from '../middlewares/Auth';
import {POSTS_UPLOAD} from '../config'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';
import { PostController } from '../controllers/PostController';
import {checkFileExtention} from '../utils/helpers';
import {PostValidation} from '../validations/PostValidation';


// Create the Instance of UserController
const postController = new PostController()

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
    res.send(await postController.getPosts(req, res, next))
});

// Get Post Route
postRoutes.delete('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).send(await postController.deletePost(req, res, next))
});

export default postRoutes


