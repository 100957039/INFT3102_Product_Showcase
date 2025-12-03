import {verifyToken} from "@/lib/auth";

export default function handler(req, res){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: 'No token  - user not logged in'});
    }

    const payload = verifyToken(token);

    if(!payload){
        return res.status(401).json({message: 'Invalid or expired token'});
    }

    res.status(200).json({
        user: {
            id: payload.id,
            email: payload.email,
            role: payload.role
        }
    });

}