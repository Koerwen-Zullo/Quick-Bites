import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
export const registerController = async (req: Request, res: Response) => {
  const { firstName, lastName, contactNumber, email, password } = req.body;

  if (!firstName || !lastName || !email || !contactNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
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
};

