import { Navigate } from "react-router-dom";
import  useSellerAuth  from "../context/sellerAuth.context";

const ProtectedRoute = ({ children }) => {
  const { isSellerAuth } = useSellerAuth();
  return isSellerAuth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
