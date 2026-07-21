import type { NextFunction, Request, Response } from "express";
import { jwtVerify } from "jose";
import { getJwtSecret } from "../utils/auth.utils.ts";
import { rotateRefreshToken } from "../services/auth.services.ts";
import {
    clearAuthCookies,
    setAccessTokenCookie,
    setRefreshTokenCookie,
} from "../utils/authCookies.ts";

const tryRefreshSession = async (
    req: Request,
    res: Response,
): Promise<number | null> => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        return null;
    }

    const tokens = await rotateRefreshToken(refreshToken);

    if (!tokens) {
        clearAuthCookies(res);
        return null;
    }

    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return tokens.userId;
};

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const accessToken = req.cookies?.token;

    if (accessToken) {
        try {
            const result = await jwtVerify(accessToken, getJwtSecret());
            req.userId = result.payload.id as number;
            return next();
        } catch {
            const userId = await tryRefreshSession(req, res);

            if (userId === null) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            req.userId = userId;
            console.log("successfully refreshed session", userId);
            return next();
        }
    }

    const userId = await tryRefreshSession(req, res);

    if (userId === null) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = userId;
    next();
};
