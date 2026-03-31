import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "../src/components/Navbar";
import Login from "../src/pages/Login";
import Signup from "../src/pages/Signup";
import Dashboard from "../src/pages/Dashboard";
import LiveOrders from "../src/pages/LiveOrders";
import DeliveryHistory from "../src/pages/DeliveryHistory";
import { DeliveryAuthProvider } from "../src/context/DeliveryAuthContext";
import ProtectedRoute from "../src/components/ProtectedRoute";

const AppRouter = () => {
    return (
        <DeliveryAuthProvider>
            <BrowserRouter>
                <Navbar />
                <div className="pt-2">
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
                            path="/live-orders"
                            element={
                                <ProtectedRoute>
                                    <LiveOrders />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/delivery-history"
                            element={
                                <ProtectedRoute>
                                    <DeliveryHistory />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </BrowserRouter>
        </DeliveryAuthProvider>
    );
};

export default AppRouter;