import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/auth.context/index.jsx";
import { LocationProvider } 
from "./context/locationContext/location.provider.jsx";
import { CartProvider } from "./context/card.context/card.provider.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  </StrictMode>
);
