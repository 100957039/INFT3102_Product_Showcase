import {verifyToken} from "@/lib/auth";

export default function handler(req, res){

    // STEP 1: Look for the httpOnly cookie that we set during successful login
    const token = req.cookies.token;

    // STEP 2: If there is no cookie -> user is not logged in
    if(!token){
        return res.status(401).json({message: 'No token  - user not logged in'});
    }

    // STEP 3: Decode and verify the JWT  (JSON Web Token) - check its signature and its expiry
    const payload = verifyToken(token);

    // STEP 4: If the token is invalid or expired -> reject
    if(!payload){
        return res.status(401).json({message: 'Invalid or expired token'});
    }

    // STEP 5: Token is Good. Send back only the user data to the frontend
    // NEVER send back the password or raw token
    res.status(200).json({
        user: {
            id: payload.id,
            email: payload.email,
            role: payload.role
        }
    });

}