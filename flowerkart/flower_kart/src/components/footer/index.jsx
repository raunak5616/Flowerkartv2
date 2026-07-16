import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Send,
  Heart
} from "lucide-react";

const Facebook = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const Instagram = (props) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const Twitter = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);
const Youtube = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.527 3.545 12 3.545 12 3.545s-7.527 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.527 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);

export default function Footer() {
  const navigate = useNavigate();
  
  const socialLinks = [
    { icon: Facebook, name: "facebook", url: "https://facebook.com" },
    { icon: Instagram, name: "instagram", url: "https://instagram.com" },
    { icon: Twitter, name: "twitter", url: "https://twitter.com" },
    { icon: Youtube, name: "youtube", url: "https://youtube.com" }
  ];

  return (
    <footer className="bg-gray-950 text-white mt-16 border-t border-gray-900 relative overflow-hidden">
      {/* Decorative Blob Elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-rose-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-700/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand/Info Column */}
          <div className="space-y-5">
            <motion.h2 
              whileHover={{ scale: 1.01 }}
              className="text-2xl font-black tracking-tight cursor-pointer inline-block"
              onClick={() => navigate("/")}
            >
              flowerKart<span className="text-rose-500">.</span>
            </motion.h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Redefining flower delivery with curated bouquets, premium botanical arrangements, and thoughtful gifting. Experience freshness delivered daily.
            </p>
            <div className="flex gap-3 pt-1">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-9 w-9 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 hover:border-gray-700 transition"
                  >
                    <IconComponent className="h-4 w-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Experience Links Column */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-300 mb-6">Experience</h3>
            <ul className="space-y-3.5 text-xs text-gray-400">
              {[
                { label: "Home", path: "/" },
                { label: "Shop", path: "/shop" },
                { label: "Products Catalog", path: "/products" },
                { label: "Track Order", path: "/profile" }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-white hover:translate-x-1.5 transition-all text-left flex items-center gap-2 group font-semibold"
                  >
                    <span className="h-1 w-1 bg-gray-700 rounded-full group-hover:bg-rose-500 transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support Column */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-300 mb-6">Support</h3>
            <ul className="space-y-3.5 text-xs text-gray-400">
              {[
                { label: "Help Center", path: "/support" },
                { label: "Shipping Policy", path: "/support" },
                { label: "Returns & Refund", path: "/support" },
                { label: "Contact Us", path: "/contact" }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-white hover:translate-x-1.5 transition-all text-left flex items-center gap-2 group font-semibold"
                  >
                    <span className="h-1 w-1 bg-gray-700 rounded-full group-hover:bg-rose-500 transition-colors" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-300">Newsletter</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Join the flowerKart club to receive updates, styling tutorials, and premium seasonal discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-950/20 flex-1 placeholder:text-gray-600 font-semibold"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => alert("Thank you for subscribing!")}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 rounded-xl font-bold flex items-center justify-center transition"
              >
                <Send className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <p>© {new Date().getFullYear()} flowerKart Ecosystem. All Rights Reserved.</p>
          <div className="flex items-center gap-1.5 font-bold">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" />
            <span>by</span>
            <span className="text-gray-300 hover:text-white transition cursor-pointer font-black border border-gray-800 px-3 py-1 rounded-full bg-gray-900/50">
              Raunak Kumar
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
