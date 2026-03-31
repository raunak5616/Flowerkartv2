import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context/index.jsx";

const Login = () => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const onLoginChnage = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value

    })
  }
  const navigate = useNavigate();
  const onsubmitPress = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        });
      alert(response.data.message);
      const token = response.data.token;
      const userData = response.data.user; // ✅ assuming the user data is returned in the response
      login(userData,token);
      navigate("/");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }
  const signup = () => {
    navigate('/signup');
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        {/* TITLE */}
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">
          flowerKart
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
              onChange={onLoginChnage}
              placeholder="you@example.com"
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
              onChange={onLoginChnage}
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
            disabled={isLoading}
            className={`mt-2 rounded-2xl bg-red-gradient py-3 text-white font-medium
                       transition-all duration-200 flex items-center justify-center gap-2
                       ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:opacity-90 active:scale-95"}`}
            onClick={onsubmitPress}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
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
