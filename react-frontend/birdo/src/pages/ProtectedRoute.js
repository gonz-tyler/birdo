// components/ProtectedRoute.js
import { useAuth } from "./AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const withAuth = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();
    const router = useNavigate();

    useEffect(() => {
      if (!user) {
        router.push("/login");
      }
    }, [user]);

    if (!user) {
      return null; // Prevents flashing protected content
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
