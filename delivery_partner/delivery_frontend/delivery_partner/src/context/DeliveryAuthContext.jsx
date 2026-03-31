import { createContext, useContext, useState, useEffect } from "react";

const DeliveryAuthContext = createContext();

export const DeliveryAuthProvider = ({ children }) => {
  const [isDeliveryAuth, setIsDeliveryAuth] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("deliveryToken");
    const id = localStorage.getItem("deliveryId");
    if (token) {
      setIsDeliveryAuth(true);
      setUser({ token, id });
    }
  }, []);

  const login = (token, id) => {
    localStorage.setItem("deliveryToken", token);
    localStorage.setItem("deliveryId", id);
    setIsDeliveryAuth(true);
    setUser({ token, id });
  };

  const logout = () => {
    localStorage.removeItem("deliveryToken");
    localStorage.removeItem("deliveryId");
    setIsDeliveryAuth(false);
    setUser(null);
  };

  return (
    <DeliveryAuthContext.Provider value={{ isDeliveryAuth, user, login, logout }}>
      {children}
    </DeliveryAuthContext.Provider>
  );
};

export default function useDeliveryAuth() {
  return useContext(DeliveryAuthContext);
}
