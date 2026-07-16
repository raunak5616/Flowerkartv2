import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight,
  Sparkles,
  Globe
} from "lucide-react";
import { useAuth } from "../../context/auth.context/index.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const onLoginChnage = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setValidationError("");
  };

  const onsubmitPress = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setValidationError("Please fill in all details.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        loginData,
        { headers: { "Content-Type": "application/json" } }
      );
      
      const token = response.data.token;
      const userData = response.data.user;
      login(userData, token);
      navigate("/");
    } catch (error) {
      console.error(error);
      setValidationError(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setValidationError("");
    try {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/signup`,
          {
            name: "Google User",
            email: "google-user@flowerkart.com",
            phone: "9999999999",
            password: "google-password-secure-123"
          },
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.log("Mock Google User already registered or signup failed, proceeding to login...");
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email: "google-user@flowerkart.com",
          password: "google-password-secure-123"
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const token = response.data.token;
      const userData = response.data.user;
      login(userData, token);
      navigate("/");
    } catch (error) {
      console.error(error);
      setValidationError("Failed to authenticate with Google. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 text-left">
      
      {/* LEFT: Premium Illustration Panel (Desktop only) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-950 relative overflow-hidden text-white">
        {/* Glow circles */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-rose-700/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="text-xl font-black bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">flowerKart.</span>
        </div>

        <div className="max-w-md space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
            Redefined E-Commerce
          </div>
          <h2 className="text-3xl font-black tracking-tight leading-tight">
            "Where flowers bloom, so does hope."
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-semibold">
            Join thousands of flower lovers ordering fresh botanical arrangements from hand-picked local florists daily. Secure checkout, fast delivery.
          </p>
        </div>

        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider relative z-10">
          © {new Date().getFullYear()} flowerKart. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* RIGHT: Login Card Panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">Welcome Back</h1>
            <p className="text-xs text-gray-400 mt-1 font-semibold">Please authenticate to access your cart and account.</p>
          </div>

          {/* Social login placeholders */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-700 transition shadow-sm disabled:opacity-50"
            >
              <Globe className="h-4 w-4 text-rose-500 animate-pulse" />
              Continue with Google
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[9px] font-black uppercase tracking-wider">or email</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          {/* Form */}
          <form onSubmit={onsubmitPress} className="space-y-4">
            
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold leading-normal">
                {validationError}
              </div>
            )}

            {/* Email input */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={onLoginChnage}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Password</label>
                <span 
                  onClick={() => alert("Simulating forgot password recovery email.")}
                  className="text-[10px] font-black text-rose-500 uppercase tracking-wider cursor-pointer hover:underline"
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  name="password"
                  value={loginData.password}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={onLoginChnage}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Trigger */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gray-950 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg shadow-gray-100 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Signup redirection link */}
          <p className="text-center text-xs text-gray-400 font-semibold mt-8">
            Don’t have an account?{" "}
            <span className="font-bold text-rose-600 hover:underline cursor-pointer" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </p>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
