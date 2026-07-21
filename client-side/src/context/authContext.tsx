import {
    createContext,
    useContext,
    useState,
    useRef,
    type ReactNode,
    useEffect,
} from "react";
import { authFetch, refreshSession } from "../utils/authFetch";

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAuthLoading: boolean;
    register: (credentials: { firstName: string, lastName: string, email: string, contactNumber: string, password: string }) => Promise<void>;
    login: (credentials: { email: string; password: string, rememberMe: boolean }) => Promise<void>;
    logout: () => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const authCheckId = useRef(0);
    const isAuthenticated = !!user;

    const checkAuthStatus = async () => {
        const checkId = ++authCheckId.current;

        try {
            const response = await authFetch("/api/auth/me", {
                method: "GET",
            });

            if (checkId !== authCheckId.current) {
                return;
            }

            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                setUser(null);
            }
        } catch {
            if (checkId === authCheckId.current) {
                setUser(null);
            }
        } finally {
            if (checkId === authCheckId.current) {
                setIsAuthLoading(false);
            }
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Silently renew the access token before it expires when logged in.
    useEffect(() => {
        if (!user) {
            return;
        }

        const intervalMs = 14 * 60 * 1000;

        const intervalId = window.setInterval(() => {
            void refreshSession();
        }, intervalMs);

        return () => window.clearInterval(intervalId);
    }, [user]);

    const register = async (credentials: { firstName: string, lastName: string, email: string, contactNumber: string, password: string }) => {

        setIsAuthLoading(true);
        try {

            const { firstName, lastName, email, contactNumber, password } = credentials;
            if (!firstName || !lastName || !email || !contactNumber || !password) {
                throw new Error("All fields are required");
            }
            const registerPayload = { firstName, lastName, contactNumber, email, password }
            const response = await authFetch("/api/auth/register", {
                method: "POST",
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

            setIsAuthLoading(false);
        }
    };

    const login = async (credentials: { email: string; password: string, rememberMe: boolean }) => {

        const { email, password, rememberMe } = credentials;
        if (!email || !password) {
            throw new Error("All fields are required");
        }
        authCheckId.current += 1;

        try {
            const response = await authFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ loginPayload: { email, password, rememberMe } }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setUser(data.user);
            setIsAuthLoading(false);
        } catch (error) {
            throw error;
        }
    };
    const logout = async () => {
        try {
            const response = await authFetch("/api/auth/logout", {
                method: "GET",
            });
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
