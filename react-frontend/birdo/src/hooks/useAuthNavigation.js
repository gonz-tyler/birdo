import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useAuthNavigation = () => {
    const navigate = useNavigate();
    const { login, logout } = useAuth();

    const loginAndNavigate = (userData) => {
        login(userData);
        navigate("/upload");
    };

    const logoutAndNavigate = () => {
        logout();
        navigate("/login");
    };

    return { loginAndNavigate, logoutAndNavigate };
};

export default useAuthNavigation;
