import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerController = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, contactNumber, email, password } =
      req.body.registerPayload;

    const validateInput = registerValidation(
      firstName,
      lastName,
      contactNumber,
      email,
      password,
    );

    if (!validateInput) {
      return res
        .status(400)
        .json({ message: "all fields are required to be filled" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        contactNumber,
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({ message: "Registered Successfully" });
  } catch (err) {
    console.log("Registration Failed");
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body.loginPayload;

    const verifyLogin = loginValidation(email, password);

    if (!verifyLogin) {
      throw 400;
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw 400;
    }

    const checkPasswordHash = await bcrypt.compare(password, user.password);

    if (!checkPasswordHash) {
      throw 400;
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 3600000,
    });
    return res.status(200).json({
      message: "Login Successfully",
      token: token,
      user: user.id,
    });
  } catch (error) {
    switch (error) {
      case 400:
        return res.status(400).json({ message: "Invalid email or password" });
      default:
        return res.status(500).json({ message: "Login Failed" });
    }
  }
};


export const meController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body.loginPayload;
    const user = prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    })

    return res.status(200).json({ message: "You are authenticated" });
  } catch (err) {
    console.log("You are not authenticated");
    return res.status(500).json({ message: "You are not authenticated" });
  }
} 
