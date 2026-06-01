import type { Request, Response } from "express";

export const registerController = (req: Request, res: Response) => {
    const { firstName, lastName, contactNumber, email, password } = req.body;

    if (!firstName || !lastName || !email || !contactNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log(firstName, lastName, email, contactNumber, password);
    return res.status(200).json({ message: "Login successful" });
}