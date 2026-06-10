import { useState } from "react";

export function useAuthRegister() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const register = async (firstName: string, lastName: string, email: string, contactNumber: string, password: string) => {
        // 1. Instantly turn on loading when the function starts
        setIsLoading(true);

        try {
            // 2. Validation is now INSIDE the try block. 
            // If this throws an error, JavaScript jumps straight to the finally block below!
            if (!firstName || !lastName || !email || !contactNumber || !password) {
                throw new Error("All fields are required");
            }

            const registerPayload = { firstName, lastName, contactNumber, email, password }
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ registerPayload }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const data = await response.json();
            window.alert("Registration successful");
            console.log(data);

        } catch (err: any) {
            // alert only takes ONE string argument, using template literal here to safely print the error object
            window.alert(`Registration failed: ${err.message || err}`);
            throw err;
        } finally {
            // 3. This is now guaranteed to run whether validation fails, fetch fails, or fetch succeeds!
            setIsLoading(false);
        }
    };

    return { register, isLoading }
}


