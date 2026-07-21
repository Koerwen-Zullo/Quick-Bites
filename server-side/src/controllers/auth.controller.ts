import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/database.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.ts";
import {
  hashPassword,
  verifyPassword,
  getJwtSecret,
} from "../utils/auth.utils.js";
import { SignJWT } from "jose";
import { generateRefreshToken, hashToken } from "../utils/refreshToken.ts";
import { rotateRefreshToken } from "../services/auth.services.ts";
import {
  ACCESS_TOKEN_EXPIRY,
  SESSION_TOKEN_EXPIRY,
  SESSION_TOKEN_MAX_AGE,
  clearRefreshTokenCookie,
  clearAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "../utils/authCookies.ts";

export const registerController = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, contactNumber, email, password } =
      req.body.registerPayload;

    await registerValidation({
      firstName,
      lastName,
      contactNumber,
      email,
      password,
    });

    const hashedPassword = await hashPassword(password);

    const new_user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        contactNumber,
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "Registered Successfully" });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ message: error.message });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body.loginPayload;

    const verifyLogin = loginValidation(email, password);

    if (!verifyLogin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const checkPasswordHash = await verifyPassword(password, user.password);

    if (!checkPasswordHash) {
      console.log("Invalid email or password")
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (rememberMe) {
      const accessToken = await new SignJWT({ id: user.id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(ACCESS_TOKEN_EXPIRY)
        .sign(getJwtSecret());

      const refreshToken = generateRefreshToken();

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(refreshToken),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isPersistent: true,
        },
      });

      setAccessTokenCookie(res, accessToken);
      setRefreshTokenCookie(res, refreshToken);
      console.log("refresh token set", ACCESS_TOKEN_EXPIRY);
    } else {
      const accessToken = await new SignJWT({ id: user.id })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime(SESSION_TOKEN_EXPIRY)
        .sign(getJwtSecret());

      clearRefreshTokenCookie(res);
      setAccessTokenCookie(res, accessToken, SESSION_TOKEN_MAX_AGE);
    }

    return res.status(200).json({
      message: "Login Successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Login Failed" });
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tokens = await rotateRefreshToken(refreshToken);

    if (!tokens) {
      clearAuthCookies(res);
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    setAccessTokenCookie(res, tokens.accessToken);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.status(200).json({
      message: "Tokens refreshed",
    });
  } catch {
    return res.status(500).json({
      message: "Refresh failed",
    });
  }
};

export const meController = async (req: Request, res: Response) => {
  try {
    if (req.userId === undefined) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        email: true,
      }
    })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Authentication Failed" });
  }
};


export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: {
        tokenHash: hashToken(refreshToken),
        revokedAt: null
      },
      data: {
        revokedAt: new Date(),
      },
    });
    console.log("refresh token revoked");
  }

  clearAuthCookies(res);
  return res.status(200).json({ message: "Logout Successfully" });
}
export const roomController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const getAllRooms = await prisma.room.findMany({
      orderBy: {
        roomNumber: "asc"
      },
    })
    if (getAllRooms.length === 0) {
      return res.status(400).json({ message: "Rooms not found." })
    }
    return res.status(200).json({ data: getAllRooms })
  } catch (error) {
    next(error);
  }
}