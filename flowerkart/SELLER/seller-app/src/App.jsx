import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SellerAuthProvider } from "./context/sellerAuth.context"; // 🔥 ADD THIS
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import { UploadProduct } from "./pages/Upload.Products";
import { ManageProducts } from "./pages/Manage.Products";
import { Bills } from "./pages/BIlls";
import NotFound from "./pages/NotFound";

const App = () => (
  <SellerAuthProvider> {/* 🔥 WRAP EVERYTHING */}
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload-products"
          element={
            <ProtectedRoute>
              <UploadProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-products"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </Router>
  </SellerAuthProvider>
);

export default App;