import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

import { useLocationContext } from "../../context/locationContext/useLocationContext";
import { BellIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { getProfile } from "../../apiCalls/productapi";
import { motion, AnimatePresence } from "framer-motion";
const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Products", href: "/products" },
  { name: "Support", href: "/support" },
];

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { address, setAddress, coordinates, detectLocation } = useLocationContext();
  const [avatar, setAvatar] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    houseNo: "",
    street: "",
    landmark: "",
    pincode: "",
    phone: ""
  });

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getProfile(user._id)
        .then((data) => {
          if (data?.images?.url) {
            setAvatar(data.images.url);
          }
        })
        .catch((error) => console.error("Failed to load navbar profile photo", error));
    } else {
      setAvatar(null);
    }
  }, [user?._id]);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      alert("Please login to access cart");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <Disclosure as="nav" className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">

            {/* LOGO */}
            <div
              className="text-xl font-bold text-red-600 cursor-pointer"
              onClick={() => navigate("/")}
            >
              flowerKart
            </div>

            {/* LOCATION */}
            <div
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md"
            >
              <span className="material-symbols-outlined text-red-600">
                location_on
              </span>

              <div className="flex flex-col leading-tight">
                <span className="text-xs text-gray-500">Deliver to</span>
                <span className="text-sm font-semibold truncate max-w-[160px]">
                  {address}
                </span>
              </div>
            </div>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden lg:flex gap-6">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition ${isActive
                      ? "bg-red-gradient text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">

            {/* SEARCH (Desktop only) */}
            <div className="hidden lg:flex items-center border border-gray-300 rounded-md px-3 py-1.5 focus-within:border-green-500 transition-colors">
              <span className="material-symbols-outlined text-gray-500 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search products"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                className="ml-2 w-40 bg-transparent text-sm outline-none"
              />
            </div>

            {/* CART */}
            <button
              onClick={handleCartClick}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <span className="material-symbols-outlined text-[22px]">
                shopping_cart
              </span>
            </button>

            <button
              onClick={() => navigate("/favorite")}
              className="p-2 rounded-md hover:bg-gray-100">
              <span className="material-symbols-outlined">
                favorite
              </span>
            </button>

            {/* NOTIFICATION */}
            <button className="p-2 rounded-md hover:bg-gray-100">
              <BellIcon className="h-6 w-6 text-gray-700" />
            </button>

            {/* PROFILE MENU (Desktop only) */}
            <Menu as="div" className="relative hidden lg:block">
              <MenuButton className="flex items-center focus:outline-none">
                <img
                  className="h-9 w-9 rounded-full object-cover border-2 border-transparent hover:border-red-500 transition-all shadow-sm"
                  src={avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"}
                  alt="Profile"
                />
              </MenuButton>

              <Transition
                as={Fragment}
                enter="transition duration-200"
                enterFrom="opacity-0 scale-95 translate-y-[-10px]"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition duration-150"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-[-10px]"
              >
                <MenuItems className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden origin-top-right z-[60]">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {user?.email || "Guest User"}
                    </p>
                  </div>
                  <div className="p-2">
                    {isAuthenticated ? (
                      <>
                        <MenuItem>
                          {({ active }) => (
                            <button
                              onClick={() => navigate("/profile")}
                              className={`${active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                } group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors`}
                            >
                              <span className="material-symbols-outlined mr-3 text-[20px]">person</span>
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
                              className={`${active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                                } group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors`}
                            >
                              <span className="material-symbols-outlined mr-3 text-[20px]">logout</span>
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
                            className={`${active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                              } group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors`}
                          >
                            <span className="material-symbols-outlined mr-3 text-[20px]">login</span>
                            Login / Sign up
                          </button>
                        )}
                      </MenuItem>
                    )}
                  </div>
                </MenuItems>
              </Transition>
            </Menu>

            {/* MOBILE MENU BUTTON */}
            <DisclosureButton className="lg:hidden p-2 rounded-md hover:bg-gray-100 flex items-center justify-center relative w-10 h-10">
              {({ open }) => (
                <div className="relative flex items-center justify-center w-6 h-6">
                  {/* Top Bar */}
                  <motion.span
                    animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                    className="absolute block w-6 h-0.5 bg-gray-700 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                  {/* Middle Bar */}
                  <motion.span
                    animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                    className="absolute block w-6 h-0.5 bg-gray-700 rounded-full"
                    transition={{ duration: 0.2 }}
                  />
                  {/* Bottom Bar */}
                  <motion.span
                    animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                    className="absolute block w-6 h-0.5 bg-gray-700 rounded-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* MOBILE PANEL WITH ANIMATION */}
      <AnimatePresence>
        <DisclosurePanel static className="lg:hidden overflow-hidden bg-white border-t border-gray-200">
          {({ open }) => open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            >
              <div className="space-y-1 px-4 py-3 flex flex-col">
                {/* Navigation */}
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-base font-medium transition-all ${isActive
                        ? "bg-red-gradient text-white shadow-md translate-x-1"
                        : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}

                <hr className="my-2" />

                {/* Auth Section */}
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        if (!user?._id) return;
                        navigate("/profile");
                      }}
                      className="text-left px-3 py-2 text-base hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="text-left px-3 py-2 text-base hover:bg-gray-100 rounded-md text-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="text-left px-3 py-2 text-base hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Login
                  </button>
                )}
              </div>

              {/* Mobile Search */}
              <div className="px-4 pb-4">
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-red-500 transition-all">
                  <span className="material-symbols-outlined text-gray-500">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search products"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    className="ml-2 w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </DisclosurePanel>
      </AnimatePresence>

      {/* LOCATION MODAL */}
      <Dialog open={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
            <DialogTitle className="text-xl font-bold text-gray-900 mb-2">Delivery Details</DialogTitle>
            <p className="text-sm text-gray-500 mb-6">Enter your exact location so our partners can find you easily.</p>
            
            <div className="space-y-4">
              <button
                onClick={detectLocation}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">my_location</span>
                Auto-detect (City/State)
              </button>

              {coordinates && (
                <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-200 mt-2 shadow-inner">
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

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">and</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">House/Flat No *</label>
                    <input
                      type="text"
                      placeholder="e.g. 101"
                      value={addressDetails.houseNo}
                      onChange={(e) => setAddressDetails({ ...addressDetails, houseNo: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      placeholder="e.g. 400001"
                      value={addressDetails.pincode}
                      onChange={(e) => setAddressDetails({ ...addressDetails, pincode: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Street/Area *</label>
                  <input
                    type="text"
                    placeholder="e.g. MG Road, Near Park"
                    value={addressDetails.street}
                    onChange={(e) => setAddressDetails({ ...addressDetails, street: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={addressDetails.landmark}
                      onChange={(e) => setAddressDetails({ ...addressDetails, landmark: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                    <input
                      type="text"
                      placeholder="10-digit number"
                      value={addressDetails.phone}
                      onChange={(e) => setAddressDetails({ ...addressDetails, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    // Retain the form details or clear them depending on preference. 
                    // Keeping them makes it easier to edit later.
                  }}
                  className="w-full py-3 bg-red-gradient text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Disclosure>
  );
}
