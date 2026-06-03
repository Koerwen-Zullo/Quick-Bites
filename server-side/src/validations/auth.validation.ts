export const registerValidation = (firstName: string, lastName: string, email: string, contactNumber: string, password: string) => {
    console.log(firstName, lastName, email, contactNumber, password)
    if (!firstName || !lastName || !email || !contactNumber || !password) {
        return false
    }
    return true;
}

export const loginValidation = (email: string, password: string) => {
    console.log(email, password)
    if (!email || !password) {
        return false
    }
    return true;
}