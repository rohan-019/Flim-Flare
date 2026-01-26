import jwt from 'jsonwebtoken'
import User from '../models/user.js';

const adminAuth = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.json({
            success: false,
            message: 'Not Authorized. Login Again',
        })
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decodedToken.id) {
            req.body = req.body || {};    // since req.body is undefined initialize it with empty object
            req.body.userId = decodedToken.id;
            const user=await User.findById(req.body.userId);
            // console.log(user);
            if(user.role !== 'admin'){
                return  res.json({
                success: false,
                message: 'Your are not admin',
            })
            }
        }
        else {
            return res.json({
                success: false,
                message: 'Not Authorized. Login Again',
            })
        }
        next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,

        })
    }
}

export default adminAuth;