import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [showTnC, setShowTnC] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  
  const onHandleChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    // We can use generic JSON instead of FormData since no images are strictly needed for delivery signup here
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup", 
        signUpData,
        { headers: { "Content-Type": "application/json" } }
      );
      alert(response.data.message);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg relative">

        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">
          Partner Registration
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Join flowerKart Delivery team
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          
          {/* PHONE */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="+123 456 7890"
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              onChange={(e) => {
                setPassword(e.target.value);
                setSignUpData({ ...signUpData, password: e.target.value });
              }}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Re-enter password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* TERMS */}
          <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-black"
            />
            <p>
              I agree to the{" "}
              <span
                onClick={() => setShowTnC(true)}
                className="cursor-pointer font-medium text-red-600 hover:underline"
              >
                Terms & Conditions
              </span>
            </p>
          </div>

          {/* SIGN UP BUTTON */}
          <button
            disabled={!agreed}
            onClick={handleSubmit}
            className={`mt-2 rounded-2xl py-3 text-white font-medium transition-all duration-200
              ${agreed
                ? "bg-red-gradient hover:scale-105 hover:opacity-90 active:scale-95"
                : "bg-gray-400 cursor-not-allowed"
              }`}
          >
            Create Account
          </button>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-medium text-red-600 hover:underline"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </p>
        </div>

        {/* TERMS & CONDITIONS MODAL */}
        {showTnC && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Terms & Conditions
              </h2>

              <div className="max-h-64 overflow-y-auto text-sm text-gray-600 space-y-3">
                <p>By creating a Delivery Partner account, you agree to:</p>
                <p>
                  • Ensure timely deliveries for flowerKart.<br />
                  • Maintain professionalism when interacting with customers.<br />
                  • Accurate status reporting of deliveries.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowTnC(false)}
                  className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setAgreed(true);
                    setShowTnC(false);
                  }}
                  className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
                >
                  I Agree
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Signup;
