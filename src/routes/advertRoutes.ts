import {Router, Request, Response, NextFunction} from 'express'
import {AdvertValidation} from '../validations/AdvertValidation';
import {auth} from '../middlewares/Auth';
import { AdvertController } from '../controllers/AdvertController'

// Create the Instance of AdvertController
const advertController = new AdvertController()

const advertRoutes = Router()

// Create User Route
advertRoutes.post('/', AdvertValidation, auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await advertController.createAdverticement(req, res, next))
});

// Get All Users Route
advertRoutes.get('/', async (req: Request, res: Response, next: NextFunction) => {
    res.send(await advertController.getAdverticements(req, res, next))
});

// Get All Users Route
advertRoutes.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    res.send(await advertController.getAdverticement(req, res, next))
});

// Get All Users Route
advertRoutes.put('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.send(await advertController.updateAdverticement(req, res, next))
});

// Create User Route
advertRoutes.delete('/:id', auth, async (req: Request, res: Response, next: NextFunction) => {
    res.status(204).send(await advertController.deleteAdverticement(req, res, next))
});


export default advertRoutes


