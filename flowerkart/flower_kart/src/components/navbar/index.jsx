import { useState, useEffect, useRef, Fragment } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Bell, 
  MapPin, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  Navigation, 
  Trash2, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Dialog, DialogPanel, DialogTitle, DialogBackdrop, Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuth } from "../../context/auth.context";
import { useCart } from "../../context/card.context/useCartContext";
import { useLocationContext } from "../../context/locationContext/useLocationContext";
import { getProfile, getProducts } from "../../apiCalls/productapi";

const navigation = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Shop", href: "/shop", icon: Sparkles },
  { name: "Products", href: "/products", icon: Sparkles },
  { name: "Support", href: "/support", icon: Sparkles },
];

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { cart, favourite } = useCart();
  const navigate = useNavigate();
  const { address, setAddress, coordinates, detectLocation } = useLocationContext();
  
  const [avatar, setAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Search suggestions states
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      return saved ? JSON.parse(saved) : ["Roses", "Plants", "Anniversary", "Birthday"];
    } catch {
      return ["Roses", "Plants", "Anniversary", "Birthday"];
    }
  });
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const searchRef = useRef(null);

  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    pincode: "",
    phone: ""
  });

  // Fetch avatar and products for suggestions
  useEffect(() => {
    if (user?._id) {
      getProfile(user._id)
        .then((data) => {
          if (data?.images?.url) setAvatar(data.images.url);
        })
        .catch((error) => console.error("Failed to load profile photo", error));
    } else {
      setAvatar(null);
    }

    getProducts()
      .then((data) => setAllProducts(data || []))
      .catch((err) => console.error("Failed to fetch search catalog", err));
  }, [user?._id]);

  // Handle outside click for search suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered live suggestions
  const suggestions = searchTerm.trim() 
    ? allProducts.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (term) => {
    const finalTerm = term || searchTerm;
    if (finalTerm.trim()) {
      // Add to recent searches
      const updated = [finalTerm.trim(), ...recentSearches.filter(s => s !== finalTerm.trim())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      
      setIsSearchFocused(false);
      navigate(`/products?search=${encodeURIComponent(finalTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (activeSearchIndex >= 0) {
        if (searchTerm.trim() === "" && activeSearchIndex < recentSearches.length) {
          handleSearchSubmit(recentSearches[activeSearchIndex]);
        } else if (activeSearchIndex < suggestions.length) {
          setIsSearchFocused(false);
          navigate(`/products/${suggestions[activeSearchIndex]._id}`);
        }
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const limit = searchTerm.trim() ? suggestions.length : recentSearches.length;
      setActiveSearchIndex(prev => (prev + 1) % limit);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const limit = searchTerm.trim() ? suggestions.length : recentSearches.length;
      setActiveSearchIndex(prev => (prev - 1 + limit) % limit);
    } else if (e.key === "Escape") {
      setIsSearchFocused(false);
    }
  };

  const clearRecentSearch = (e, index) => {
    e.stopPropagation();
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      alert("Please login to access cart");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      <nav className="glass-header sticky top-0 z-50 w-full transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo & Deliver to Location */}
            <div className="flex items-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                  flowerKart
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
              </motion.div>

              {/* Location Selector */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-2.5 cursor-pointer bg-gray-50/80 border border-gray-100 hover:border-rose-100 px-3.5 py-1.5 rounded-full transition-all shadow-sm"
              >
                <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                <div className="flex flex-col text-left leading-tight max-w-[150px] lg:max-w-[200px]">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deliver to</span>
                  <span className="text-xs font-black text-gray-700 truncate">
                    {address === "Select Location" ? "Choose Address..." : address}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1.5">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                      isActive
                        ? "bg-rose-50 text-rose-600 shadow-sm border border-rose-100/50"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Search, Action Buttons & User Profile */}
            <div className="flex items-center gap-3.5 flex-1 justify-end max-w-xl">
              
              {/* Premium Command Search Bar */}
              <div ref={searchRef} className="relative hidden md:block w-full max-w-[240px] lg:max-w-[280px]">
                <div className={`flex items-center bg-gray-50/80 border rounded-full px-3.5 py-2 transition-all duration-300 ${
                  isSearchFocused 
                    ? "border-rose-400 ring-4 ring-rose-50 bg-white" 
                    : "border-gray-200 hover:border-gray-300"
                }`}>
                  <Search className="h-4 w-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search premium blooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                      setIsSearchFocused(true);
                      setActiveSearchIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    className="ml-2 w-full bg-transparent text-xs font-medium outline-none text-gray-800 placeholder-gray-400"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {isSearchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-[320px] rounded-2xl bg-white border border-gray-100 shadow-2xl p-4 z-50 overflow-hidden"
                    >
                      {searchTerm.trim() === "" ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Searches</span>
                          </div>
                          {recentSearches.length > 0 ? (
                            <div className="space-y-1">
                              {recentSearches.map((term, index) => (
                                <div
                                  key={term}
                                  onClick={() => handleSearchSubmit(term)}
                                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition ${
                                    activeSearchIndex === index ? "bg-rose-50 text-rose-600" : "hover:bg-gray-50 text-gray-700"
                                  }`}
                                >
                                  <span className="text-xs font-semibold">{term}</span>
                                  <button
                                    onClick={(e) => clearRecentSearch(e, index)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 italic">No recent searches</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Live Suggestions</span>
                          {suggestions.length > 0 ? (
                            <div className="space-y-1">
                              {suggestions.map((item, index) => (
                                <div
                                  key={item._id}
                                  onClick={() => {
                                    setIsSearchFocused(false);
                                    navigate(`/products/${item._id}`);
                                  }}
                                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition ${
                                    activeSearchIndex === index ? "bg-rose-50 border border-rose-100" : "hover:bg-gray-50 border border-transparent"
                                  }`}
                                >
                                  <img
                                    src={item.images?.[0]?.url || "/no-image.png"}
                                    alt={item.name}
                                    className="h-8 w-8 rounded-lg object-cover bg-gray-50"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                                    <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">{item.category}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-xs font-medium text-gray-500">No blooms match "{searchTerm}"</p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/favorite")}
                className="relative p-2 text-gray-600 hover:text-rose-500 hover:bg-gray-50 rounded-full transition-all"
                aria-label="Wishlist"
              >
                <Heart className={`h-5 w-5 ${favourite.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
                {favourite.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8px] font-black text-white shadow-sm ring-2 ring-white"
                  >
                    {favourite.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCartClick}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[8px] font-black text-white shadow-sm ring-2 ring-white"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </motion.button>

              {/* User Dropdown */}
              <HeadlessMenu as="div" className="relative hidden md:block">
                <MenuButton className="flex items-center rounded-full focus:outline-none ring-2 ring-transparent hover:ring-rose-200 transition p-0.5">
                  <img
                    className="h-8 w-8 rounded-full object-cover shadow-sm bg-gray-100"
                    src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                    alt="User Profile"
                  />
                </MenuButton>

                <MenuItems 
                  transition
                  className="absolute right-0 mt-2.5 w-60 origin-top-right rounded-2xl bg-white border border-gray-100 shadow-2xl p-2 focus:outline-none transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 data-[closed]:-translate-y-2"
                >
                  <div className="px-3.5 py-3 border-b border-gray-50 mb-1">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-black text-gray-800 truncate">{user?.email || "Guest Bloom Lover"}</p>
                  </div>

                  {isAuthenticated ? (
                    <>
                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => navigate("/profile")}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                              active ? "bg-rose-50 text-rose-600" : "text-gray-600"
                            }`}
                          >
                            <User className="h-4 w-4 shrink-0" />
                            My Profile
                          </button>
                        )}
                      </MenuItem>

                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={() => {
                              logout();
                              navigate("/login");
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                              active ? "bg-red-50 text-red-600" : "text-red-500"
                            }`}
                          >
                            <LogOut className="h-4 w-4 shrink-0" />
                            Logout
                          </button>
                        )}
                      </MenuItem>
                    </>
                  ) : (
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => navigate("/login")}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${
                            active ? "bg-rose-50 text-rose-600" : "text-gray-700"
                          }`}
                        >
                          <User className="h-4 w-4 shrink-0" />
                          Login / Sign up
                        </button>
                      )}
                    </MenuItem>
                  )}
                </MenuItems>
              </HeadlessMenu>

              {/* Hamburger Button for mobile */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-50 md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER DIALOG (Native Headless UI v2.0 transitions) */}
      <Dialog
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        className="relative z-50 md:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
        />

        <div className="fixed inset-0 flex justify-end">
          <DialogPanel
            transition
            className="w-full max-w-[300px] bg-white h-full flex flex-col shadow-2xl p-6 relative transition duration-300 ease-out data-[closed]:translate-x-full"
          >
                {/* Header inside drawer */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-black bg-gradient-to-r from-rose-500 to-rose-700 bg-clip-text text-transparent">
                    flowerKart
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 rounded-full bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="relative mb-6">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-rose-400">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search flowers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearchSubmit();
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      className="ml-2 w-full bg-transparent text-xs font-semibold outline-none text-gray-800"
                    />
                  </div>
                </div>

                {/* Mobile Deliver location summary */}
                <div 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsLocationModalOpen(true);
                  }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer mb-6"
                >
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
                  <div className="flex flex-col text-left leading-tight min-w-0">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Deliver to</span>
                    <span className="text-xs font-black text-gray-700 truncate max-w-[180px]">{address}</span>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col gap-2 mb-8">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      end
                      className={({ isActive }) =>
                        `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          isActive
                            ? "bg-rose-50 text-rose-600 border border-rose-100/50"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-45" />
                    </NavLink>
                  ))}

                </div>

                {/* Mobile Auth actions */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-2 mb-4">
                        <img
                          src={avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                          alt="avatar"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-800 truncate">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          logout();
                          navigate("/login");
                        }}
                        className="w-full py-2.5 rounded-xl bg-red-50 text-xs font-bold text-red-600 hover:bg-red-100/60 flex items-center justify-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full py-3 rounded-xl bg-gray-900 text-xs font-bold text-white shadow-md hover:bg-rose-600 flex items-center justify-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Login / Sign Up
                    </button>
                  )}
                </div>
              </DialogPanel>
            </div>
          </Dialog>

      {/* LOCATION SELECTOR MODAL */}
      <Dialog open={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-gray-100 transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-lg font-black text-gray-900">Delivery Location</DialogTitle>
              <button onClick={() => setIsLocationModalOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-50 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 font-medium mb-5 leading-relaxed">Enter your detailed delivery details so our partners can find you easily.</p>
            
            <div className="space-y-4">
              <button
                onClick={detectLocation}
                className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold text-xs hover:bg-rose-100 transition shadow-sm border border-rose-100/30"
              >
                <Navigation className="h-4 w-4 animate-pulse text-rose-500" />
                Auto-detect (City/State)
              </button>

              {coordinates && (
                <div className="w-full h-36 rounded-2xl overflow-hidden border border-gray-200 mt-2 shadow-inner">
                  <iframe
                    title="Location Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.005},${coordinates.lat - 0.005},${coordinates.lng + 0.005},${coordinates.lat + 0.005}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
                  ></iframe>
                </div>
              )}

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink-0 mx-3 text-gray-400 text-[9px] font-black uppercase tracking-wider">and details</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">House/Flat No *</label>
                    <input
                      type="text"
                      placeholder="e.g. 101"
                      value={addressDetails.houseNo}
                      onChange={(e) => setAddressDetails({ ...addressDetails, houseNo: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Pincode *</label>
                    <input
                      type="text"
                      placeholder="e.g. 400001"
                      value={addressDetails.pincode}
                      onChange={(e) => setAddressDetails({ ...addressDetails, pincode: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Street/Area *</label>
                  <input
                    type="text"
                    placeholder="e.g. MG Road, Near Park"
                    value={addressDetails.street}
                    onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Landmark</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={addressDetails.landmark}
                      onChange={(e) => setAddressDetails({ ...addressDetails, landmark: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-wider">Phone *</label>
                    <input
                      type="text"
                      placeholder="10-digit number"
                      value={addressDetails.phone}
                      onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    if (!addressDetails.houseNo || !addressDetails.street || !addressDetails.pincode || !addressDetails.phone) {
                      alert("Please fill all required fields (*)");
                      return;
                    }
                    if (address === "Select Location") {
                      alert("Please use Auto-detect to set your City/State first.");
                      return;
                    }

                    const parts = [
                      `House: ${addressDetails.houseNo}`,
                      `Street: ${addressDetails.street}`,
                      addressDetails.landmark ? `Landmark: ${addressDetails.landmark}` : '',
                      `City/State: ${address}`,
                      `Pincode: ${addressDetails.pincode}`,
                      `Phone: ${addressDetails.phone}`
                    ].filter(Boolean);
                    
                    const finalAddress = parts.join(", ");
                    if(setAddress) setAddress(finalAddress);
                    localStorage.setItem("deliveryAddress", finalAddress);
                    setIsLocationModalOpen(false);
                  }}
                  className="w-full py-3.5 bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-700 transition shadow-lg shadow-rose-200"
                >
                  Confirm Delivery Location
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
