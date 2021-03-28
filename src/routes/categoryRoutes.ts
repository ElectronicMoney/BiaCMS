import {Router, Request, Response, NextFunction} from 'express'
import {CategoryValidation} from '../validations/CategoryValidation';
import {auth} from '../middlewares/Auth';
import { CategoriesController } from '../controllers/CategoriesController'

// Create the Instance of CategoriesController
const categoryController = new CategoriesController()

const categoryRoutes = Router()

// Create User Route
categoryRoutes.post('/', CategoryValidation, auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await categoryController.createCategory(req, res, next))
});

// Get All Users Route
categoryRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.send(await categoryController.getCategories(req, res, next))
});

// Get All Users Route
categoryRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    res.send(await categoryController.getCategory(req, res, next))
});

// Get All Users Route
categoryRoutes.put('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await categoryController.updateCategory(req, res, next))
});

// Create User Route
categoryRoutes.delete('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).send(await categoryController.deleteCategory(req, res, next))
});


export default categoryRoutes


