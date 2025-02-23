import { env } from 'elysia'
import jwt from 'jsonwebtoken'
import { PrismaClient, UserRole } from '@prisma/client'

// Authentication macro
const prisma = new PrismaClient()


export const generateAuthToken = (userId: number) => {
    const secret = env.JWT_SECRET_KEY;
    return jwt.sign({ userId }, secret, { expiresIn: '24h' });
}


export const checkGuest = (req, callback) => {

    if (req.headers['authorization']) {
        return { status: 401, message: 'You must be unauthanticated to access this route' }
    }

    return callback();
}





export const checkAuth = async (req,  callback) => {
    const token = req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return { status: 401, message: 'Authentication token missing' }
    }

    try {
        const secret = env.JWT_SECRET_KEY;
        const decoded = jwt.verify(token, secret)
        req.user = await prisma.user.findUnique({ where: { id:decoded.userId } })
    } catch (err) {
        return { status: 401, message: 'Invalid or expired token' }
    }

    return callback();
}


export const checkAuthorization = (req , role : UserRole, callback) => {

    return checkAuth(req, ()=>{
        if(req.user.role !== role){
            return { status: 401, message: 'Request Unauthorized' }
        }

        return callback();
    })

}
