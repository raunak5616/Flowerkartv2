import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { SellerAuthProvider } from "./context/sellerAuth.context";
import ProtectedRoute from "./components/ProtectedRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SellerAuthProvider>
    <App />
  </SellerAuthProvider>
);
