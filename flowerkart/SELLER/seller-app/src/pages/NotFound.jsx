import { useNavigate } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* ICON CONTAINER */}
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <div className="absolute top-0 right-0 -translate-y-2 translate-x-2">
            <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100">
               <span className="text-xl font-bold text-red-600">404</span>
            </div>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-500 text-lg">
            The page you are looking for doesn't exist or has been moved to a new orchid. 
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center gap-2 bg-red-gradient text-white 
                       px-8 py-4 rounded-[2rem] font-bold text-lg 
                       hover:scale-105 transition-all duration-300 shadow-xl shadow-red-500/20 active:scale-95"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </button>
          
          <button 
             onClick={() => navigate(-1)}
             className="text-gray-500 font-semibold hover:text-red-600 transition-colors"
          >
            Wait, take me back!
          </button>
        </div>

        {/* DECORATIVE ELEMENTS */}
        <div className="pt-8 opacity-20 flex justify-center gap-8">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <div className="w-2 h-2 bg-red-300 rounded-full"></div>
            <div className="w-2 h-2 bg-red-200 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
