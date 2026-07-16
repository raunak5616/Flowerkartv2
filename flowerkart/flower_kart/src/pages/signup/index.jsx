import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Check, 
  X, 
  ArrowRight,
  Sparkles,
  ShieldAlert
} from "lucide-react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  
  const [showTnC, setShowTnC] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const onHandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !password || !confirmPassword) {
      setError("Please fill in all details.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    setError("");
    setIsLoading(true);

    try { 
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        formData,
        { headers: { "content-type": "application/json" } }
      );
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Email might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gray-50 text-left">
      
      {/* LEFT: Premium Illustration Panel (Desktop only) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gray-950 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-rose-700/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="text-xl font-black bg-gradient-to-r from-rose-400 to-rose-600 bg-clip-text text-transparent">flowerKart.</span>
        </div>

        <div className="max-w-md space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
            Join the ecosystem
          </div>
          <h2 className="text-3xl font-black tracking-tight leading-tight">
            Start experiencing the freshest blooms today.
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed font-semibold">
            Create an account to track shipments, curate a wishlist, access seasonal promotions, and manage local delivery settings easily.
          </p>
        </div>

        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider relative z-10">
          © {new Date().getFullYear()} flowerKart. ALL RIGHTS RESERVED.
        </div>
      </div>

      {/* RIGHT: Register Card Panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">Create Account</h1>
            <p className="text-xs text-gray-400 mt-1 font-semibold">Sign up to buy and send flowers locally.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold leading-normal flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  onChange={onHandleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@domain.com"
                  onChange={onHandleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="phone"
                  placeholder="+91 99999 99999"
                  onChange={onHandleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    });
                  }}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
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

            {/* Confirm Password input */}
            <div className="space-y-1">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Confirm Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox agreement */}
            <div className="flex items-start gap-2.5 pt-2 text-xs font-semibold text-gray-600 leading-normal">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-rose-600 h-4 w-4 rounded border-gray-300 focus:ring-rose-500"
              />
              <p>
                I agree to the{" "}
                <span
                  onClick={() => setShowTnC(true)}
                  className="cursor-pointer font-bold text-rose-600 hover:underline"
                >
                  Terms & Conditions
                </span>
              </p>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || !agreed}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg ${
                agreed && !isLoading
                  ? "bg-gray-950 hover:bg-rose-600 shadow-gray-100 cursor-pointer"
                  : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Login redirection link */}
          <p className="text-center text-xs text-gray-400 font-semibold mt-6">
            Already have an account?{" "}
            <span className="font-bold text-rose-600 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

        </motion.div>
      </div>

      {/* TERMS & CONDITIONS MODAL */}
      <AnimatePresence>
        {showTnC && (
          <Dialog
            static
            open={showTnC}
            onClose={() => setShowTnC(false)}
            className="relative z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <DialogPanel as={motion.div} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl transition-all border border-gray-100">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-50">
                  <DialogTitle className="text-sm font-black uppercase tracking-wider text-gray-950">Terms & Conditions</DialogTitle>
                  <button onClick={() => setShowTnC(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-50">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto text-xs font-semibold leading-relaxed text-gray-500 space-y-3 pr-2 text-left">
                  <p>By creating an account on flowerKart, you agree to the following terms:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li>You are responsible for maintaining account security and credentials.</li>
                    <li>Orders once processed cannot be cancelled or altered after florist partners prepare the arrangement.</li>
                    <li>Any malicious activity, automated requests, or payment manipulation results in immediate account suspension.</li>
                    <li>We reserve the right to modify pricing, florist listings, and delivery fees without prior warnings.</li>
                  </ul>
                </div>

                <div className="mt-6 flex justify-end gap-2.5">
                  <button
                    onClick={() => setShowTnC(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50 border border-gray-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setAgreed(true);
                      setShowTnC(false);
                    }}
                    className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-rose-100"
                  >
                    I Agree
                  </button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Signup;
