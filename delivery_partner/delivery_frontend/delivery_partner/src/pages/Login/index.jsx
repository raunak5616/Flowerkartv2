import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDeliveryAuth from "../../context/DeliveryAuthContext";

const Login = () => {
  const { login } = useDeliveryAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  
  const onLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };
  
  const navigate = useNavigate();
  
  const onSubmitPress = async (e) => {
    e.preventDefault();
    try {
      // Changed to port 3000
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        });
      alert(response.data.message);
      const token = response.data.token;
      const partnerId = response.data.id;
      
      login(token, partnerId);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login Failed");
    }
  };
  
  const signup = () => {
    navigate('/signup');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        {/* TITLE */}
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">
          flowerKart Delivery
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Welcome back! Please login to your account
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={loginData.email}
              onChange={onLoginChange}
              placeholder="partner@example.com"
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              value={loginData.password}
              type="password"
              placeholder="••••••••"
              onChange={onLoginChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <span className="cursor-pointer text-sm text-gray-600 hover:text-red-600 hover:underline">
              Forgot password?
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="mt-2 rounded-2xl bg-red-gradient py-3 text-white font-medium
                       transition-all duration-200
                       hover:scale-105 hover:opacity-90
                       active:scale-95"
            onClick={onSubmitPress}
          >
            Login
          </button>

          {/* SIGN UP */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span className="cursor-pointer font-medium text-red-600 hover:underline" onClick={signup}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;