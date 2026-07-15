import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useEffect,
} from "react";

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    register: (credentials: { firstName: string, lastName: string, email: string, contactNumber: string, password: string }) => Promise<void>;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const isAuthenticated = !!user;

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                console.log("=== AUTH DEBUG ===");
                console.log("Raw Response Payload:", data);
                console.log("Data ID Type:", typeof data?.id);

            }
            setIsAuthLoading(false);
        } catch (error) {
            setUser(null);
        } finally {
            setIsAuthLoading(false);
        }
    };
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const register = async (credentials: { firstName: string, lastName: string, email: string, contactNumber: string, password: string }) => {
        // 1. Instantly turn on loading when the function starts
        setIsAuthLoading(true);
        try {
            // 2. Validation is now INSIDE the try block.
            // If this throws an error, JavaScript jumps straight to the finally block below!
            const { firstName, lastName, email, contactNumber, password } = credentials;
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
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            console.log(data);
        } catch (err) {
            throw err;
        } finally {
            // 3. This is now guaranteed to run whether validation fails, fetch fails, or fetch succeeds!
            setIsAuthLoading(false);
        }
    };

    const login = async (credentials: { email: string; password: string }) => {

        const { email, password } = credentials;
        if (!email || !password) {
            throw new Error("All fields are required");
        }
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ loginPayload: { email, password } }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);

            }

            await checkAuthStatus();
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            if (response.ok) {
                setUser(null);
            }
        } catch (error) {
            throw error;
        }
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAuthLoading,
                register,
                login,
                logout,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
