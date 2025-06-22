import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { readJson } from '../../tools/readjson.js'

const config = await readJson('config/default.json')

const AuthController = {
    async register(req, res) {        
        var clientError = false;
        try {
            if(!req.body.name ||
                !req.body.email ||
                !req.body.password ||
                !req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! Bad request data!')
            }
            if(req.body.password != req.body.password_confirmation) {
                clientError = true
                throw new Error('Error! The two password is not same!')
            }
            const user = await User.findOne({
                where: { name: req.body.name }
            })
            if(user) {
                clientError = true
                throw new Error('Error! User already exists: ' + user.name)
            }
            AuthController.tryRegister(req, res)
        } catch (error) {
            if (clientError) {
                res.status(400)
            }else {
                res.status(500)
            }            
            await res.json({
                success: false,
                message: 'Error! User creation failed!',
                error: error.message
            })            
        }
    },
    async tryRegister(req, res) {
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password)
        }
        await User.create(user)
        .then( result => {
            res.status(201)
            res.json({
                succes: true,
                data: result
            })
        })
    },
    async login(req, res) {
        
        try {
            if(!req.body.name || !req.body.password) {
               res.status(400)
               throw new Error('Error! Bad name or password!')
            }
            const user = await User.findOne({
                where: { name: req.body.name }
            })

            if(!user) {
                res.status(404)
                throw new Error('Error! User not found!')
            }
            var passwordIsValid = await bcrypt.compare(
                req.body.password,
                user.dataValues.password
            );
            if(!passwordIsValid) {
                res.status(401)
                throw new Error('Error! Password is not valid!')
            }
            AuthController.tryLogin(req, res, user)

        } catch (error) {
            res.json({
                success: false,
                message: 'Error! The login is failed!',
                error: error.message
            })
        }
    },
    async tryLogin(req, res, user) {
        var token = jwt.sign({ id: user.id }, config.app.key, {
            expiresIn: 86400 //24 óra
        })
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token
        })            
    }
}
 
export default AuthController
