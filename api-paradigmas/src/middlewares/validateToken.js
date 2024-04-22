import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js'

export const authRequired = (req, res, next) => {
    const { token } = req.cookies;
    if (!token)
        return res.status(401).json({
            msg: "No token, authorization denied"
        });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Invalid token" });
        console.table(user);
        next();
    });
}