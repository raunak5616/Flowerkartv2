import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const SellerAuthContext = createContext(null);

// HELPER: Simple JWT Decoder to check expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (e) {
    return true;
  }
};

export const SellerAuthProvider = ({ children }) => {
  const [isSellerAuth, setIsSellerAuth] = useState(() => {
    const token = localStorage.getItem("sellerToken");
    return token ? !isTokenExpired(token) : false;
  });

  useEffect(() => {
    // Axios Interceptor for 401/403
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const login = (token) => {
    localStorage.setItem("sellerToken", token);
    setIsSellerAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("shopId");
    setIsSellerAuth(false);
  };

  return (
    <SellerAuthContext.Provider value={{ isSellerAuth, login, logout }}>
      {children}
    </SellerAuthContext.Provider>
  );
};

// ✅ DEFAULT EXPORT HOOK
const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);

  if (!context) {
    throw new Error(
      "useSellerAuth must be used inside SellerAuthProvider"
    );
  }

  return context;
};

export default useSellerAuth;
