import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin } from "lucide-react";
const Signup = () => {
  const navigate = useNavigate();
  const [showTnC, setShowTnC] = useState(false);
  const [image, setimage] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
    const [signUpData, setSignUpData] = useState({
     name: "",
     shop: "",
     email: "",
     phone: "",
     password: "",
     address: "",
     lat: "",
     lng: "",
   });
  const [isLoading, setIsLoading] = useState(false);
   const onHandleChange = (e) => {
     setSignUpData({
       ...signUpData,
       [e.target.name]: e.target.value,
     })
   };

   const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
           setSignUpData(prev => ({
             ...prev,
             lat: position.coords.latitude,
             lng: position.coords.longitude
           }));
           alert("Location updated successfully!");
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Error getting location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
   };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setimage(file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(signUpData).forEach(([key, value]) => {
      formData.append(key, value);
    })
    if(image){
    formData.append("images", image);
    }
    console.log("Form submitted successfully");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/products/signup", formData,
      );
      alert(response.data.message);
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      alert("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg relative">

        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">
          Create Account
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Join flowerKart and start shopping smarter
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* NAME */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          {/* shop name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              name="shop"
              placeholder="Shop Name"
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="Phone"
              name="phone"
              placeholder="+123 456 7890"
              onChange={onHandleChange}
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
              type="password"
              name="password"
              placeholder="Create a strong password"
              onChange={(e) => {
                setPassword(e.target.value);
                setSignUpData({
                  ...signUpData,
                  password: e.target.value,
                });
              }}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm"
            />

          </div>

          {/* ADDRESS */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Shop Address
            </label>
            <textarea
              name="address"
              placeholder="City, Area, Road..."
              onChange={onHandleChange}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          {/* LOCATION */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Coordinates
            </label>
            <div className="flex gap-2">
               <input
               type="text"
               readOnly
               value={signUpData.lat ? `${signUpData.lat}, ${signUpData.lng}` : ""}
               placeholder="GPS Location"
               className="flex-1 rounded-2xl border border-gray-300 px-4 py-3 text-sm bg-gray-50 cursor-not-allowed"
               />
               <button
               type="button"
               onClick={handleGetLocation}
               className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors"
               title="Get Current Location"
               >
               <MapPin size={20} />
               </button>
            </div>
            <p className="text-[10px] text-gray-400">Please click the pin to set your delivery location</p>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              onChange={(e) => setconfirmPassword(e.target.value)}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                          file:bg-red-500 file:text-white
                          hover:file:bg-red-600 cursor-pointer"
            />
          </div>
          {/* TERMS */}
          <div className="flex items-start gap-2 text-sm text-gray-600">
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
            disabled={!agreed || isLoading}
            onClick={handleSubmit}
            className={`mt-2 rounded-2xl py-3 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2
              ${!agreed || isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-gradient hover:scale-105 hover:opacity-90 active:scale-95"
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing up...</span>
              </>
            ) : (
              "Create Account"
            )}
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
                <p>
                  By creating an account on flowerKart, you agree to the following:
                </p>
                <p>
                  • You are responsible for maintaining account security.<br />
                  • Orders once placed cannot be cancelled after shipping.<br />
                  • Any misuse may result in account suspension.
                </p>
                <p>
                  These terms may be updated at any time without notice.
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
