import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.ts";
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

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        contactNumber,
        email,
        password,
      },
    });

    console.log(newUser);
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
      return res
        .status(400)
        .json({ message: "all fields required to be filled" });
    }

    const user = await prisma.user.findFirst({
      where: { email, password },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({ message: "Login Successfully" });
  } catch (error) {
    console.log(error);
  }
};
