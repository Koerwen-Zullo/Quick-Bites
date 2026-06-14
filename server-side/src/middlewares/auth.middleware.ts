import { Response, Request, NextFunction } from "express";
import { jwtVerify, errors } from "jose";
import { getJwtSecret } from "../utils/auth.utils.js";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, Token is required" });
    }

    try {
        const { payload } = await jwtVerify(token, getJwtSecret(), {
            algorithms: ["HS256"],
        });

        if (typeof payload.id !== "number") {
            return res.status(401).json({ message: "Unauthorized, Invalid token" });
        }

        req.userId = payload.id;
        next();
    } catch (error) {
        if (error instanceof errors.JOSEError) {
            return res.status(401).json({ message: "Unauthorized, Invalid token" });
        }
        next(error);
    }
};
