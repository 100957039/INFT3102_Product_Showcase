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
        password: '$2b$10$3vuHLQGEjgnnA7H6J60/zOER9nySmVrTg4oKSMTp3mgB.eW7dokme',
        role: 'vendor'
    },
    {
        id: '3',
        email: 'vendorB@dc.ca',
        password: '$2b$10$xScAttt8tFCrrGXkKpkawOAinrGNZk8TaerAOUupCyWV.5pMaGFWS',
        role: 'vendor'
    },
    {
        id: '4',
        email: 'vendorC@dc.ca',
        password: '$2b$10$K3cNwlMwE9u/XCnaKgR6BO6kaI7qmoklMY4o7cjW6EnaWPAgX10cm',
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