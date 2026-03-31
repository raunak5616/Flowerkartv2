import { Navigate } from "react-router-dom";
import useDeliveryAuth from "../context/DeliveryAuthContext";

const ProtectedRoute = ({ children }) => {
  const { isDeliveryAuth } = useDeliveryAuth();
  
  if (!isDeliveryAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
