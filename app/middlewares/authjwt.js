import jwt from 'jsonwebtoken';
import { readJson } from '../../tools/readjson.js'

const config = await readJson('config/default.json')

const verifyToken = (req, res, next) => {
    let authData = req.headers.authorization;
    if(!authData) {
        return res.status(403).send({
            message: 'No token provided!'
        })
    }
    let token = authData.split(' ')[1];
 
    jwt.verify(token, config.app.key, (err, decoded) => {
        if(err) {
            return res.status(401).send({
                message: "Unauthorized!"
            })
        }
        req.userId = decoded.id;
        next()
    })
};

export default verifyToken