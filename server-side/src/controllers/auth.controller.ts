import { Request, Response } from "express";
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
    const { email, password } = req.body.loginPayload;

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
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(getJwtSecret());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });
    return res.status(200).json({
      message: "Login Successfully",
      user: user.id,
    });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ message: error.message });
    return res.status(500).json({ message: "Login Failed" });
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
