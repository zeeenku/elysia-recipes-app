import { Elysia, env } from 'elysia'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

// Authentication macro


export const generateAuthToken = (userId: number) => {
    const secret = env.JWT_SECRET_KEY;
    return jwt.sign({ userId }, secret, { expiresIn: '24h' });
}


export const checkGuest = (req, callback) => {

    if (req.headers && req.headers['authorization']) {
        return { status: 401, message: 'You must be unauthanticated to access this route' }
    }

    return callback();
}


export const checkAuth = (req) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        return { status: 401, message: 'Authorization token missing' }
    }

    try {
        const secret = env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secret)
        req.user = decoded
    } catch (err) {
        return { status: 401, message: 'Invalid or expired token' }
    }

}


export const checkauthorization = (req , role : UserRole) => {
    if(req.user.role !== role){
        return { status: 401, message: 'Request Unauthorized' }
    }
}
