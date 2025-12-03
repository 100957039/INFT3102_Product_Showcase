import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-must-be-changed-in-production';
const TOKEN_EXPIRY = '7d'; //7 days

const users = [
    {
        id: '1',
        email: 'admin@dc.ca',
        password: '$2b$10$GbTmkGSo1sjIo03uAu1NUOgaH8TrN5YJFXTc3nDLxP8DWUOnGOSjG',
        role: 'admin'
    },
    {
        id: '2',
        email: 'vendorA@dc.ca',
        password: '$2b$10$uDiPa.dU3/A1aWKpzuhf2e.goyie4a3zGaGHtjOfMgARbQSaCNbli',
        role: 'vendor'
    },
    {
        id: '3',
        email: 'vendorB@dc.ca',
        password: '$2b$10$MBBDafKSw7Qt2IAO/lDQfePLjMUtLqE6V3/cwInZps5Exphsc2SZ6',
        role: 'vendor'
    },
    {
        id: '4',
        email: 'vendorC@dc.ca',
        password: '$2b$10$M/9nwOKoVTKIHeIUoRftPeMm7cVi9kKh7b98QGjq7QwRizPOOg1Ni',
        role: 'vendor'
    }
];

export function hashPassword(password){
    return bcrypt.hashSync(password, 10);
}

export function verifyPassword(input, hashed){
    return bcrypt.compareSync(input, hashed);
}

export function generateToken(user){
    return jwt.sign(
        { userId: user.id, email: user.email, role: user.role},
        JWT_SECRET,
        {expiresIn: TOKEN_EXPIRY}
    );
}

export function verifyToken(token){
    try{
        return jwt.verify(token, JWT_SECRET);
    }catch(err){
        return null;
    }
}

export function findUserByEmail(email){
    return users.find(user => user.email === email);
}