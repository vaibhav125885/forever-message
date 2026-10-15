import { createContext, useContext, useState } from "react";
import { apiRequest } from "../api/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("access_token")
    );

    const login = async (email, password) => {
        const formData = new URLSearchParams();

        formData.append("username", email);
        formData.append("password", password);

        const data = await apiRequest("/login", {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        setToken(data.access_token);

        return data;
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}