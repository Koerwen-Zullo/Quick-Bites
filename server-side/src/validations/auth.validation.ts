import { prisma } from "../config/database.js";
export const registerValidation = async ({
  firstName,
  lastName,
  email,
  contactNumber,
  password,
}: {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  password: string;
}
) => {
  if (!firstName || !lastName || !email || !contactNumber || !password) {
    throw new Error("All fields are required");

  }

  const [emailExists, contactExists] = await Promise.all([
    prisma.user.findFirst({ where: { email } }),
    prisma.user.findFirst({ where: { contactNumber } })
  ]);


  if (emailExists) {
    throw new Error("Email already exists");
  }

  if (contactExists) {
    throw new Error("Contact Number already exists");
  }
};

export const loginValidation = (email: string, password: string) => {
  if (!email || !password) {
    return false;
  }
  return true;
};
