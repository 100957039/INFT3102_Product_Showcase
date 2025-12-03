import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-must-be-changed-in-production';
const TOKEN_EXPIRY = '7d'; //7 days

const users = [
    {
        id: '1',
        email: 'admin@dc.ca',
        password: '$2b$10$Q3fFcxSjBufrCuH19MrAKu4awXj2.hoLemrfWg.Ve10F4p/fVdL.i',
        role: 'admin'
    },
    {
        id: '2',
        email: 'vendor@dc.ca',
        password: '$2b$10$hLoRMSGjOaahxxYkbcS7ZeY/mKPSJToSyT0/htByOIZYs.ZLueXnG',
        role: 'author'
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