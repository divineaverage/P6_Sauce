import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authorize = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
        if (req.body.userId && req.body.userId !== userId) {
            throw "User ID is not found.";
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            message: "Token is not valid."
        });
    }
};

export default authorize;