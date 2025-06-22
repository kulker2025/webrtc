import Router from 'express'
const router = Router()

import AuthController from '../controllers/authcontroller.js';
import UserController from '../controllers/usercontroller.js';
import verifyToken from '../middlewares/authjwt.js';
 
router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/users', [verifyToken], UserController.index)
 
export default router
