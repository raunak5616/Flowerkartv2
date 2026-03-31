import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const icons = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    youtube: <FaYoutube />
  };

  const navigate = useNavigate();
  return (
    <footer className="bg-premium-gradient text-white mt-5 relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="absolute top-0 left-0 w-64 h-50 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-400/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="max-w-7xl mx-auto px-8 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-3xl font-black tracking-tighter italic">flowerKart</h2>
            <p className="text-sm text-red-50/80 leading-relaxed max-w-xs">
              Bringing nature's finest blooms and fresh essentials straight to your doorstep with love and speed.
            </p>

            <div className="flex gap-4 pt-2">
              {['facebook', 'instagram', 'twitter', 'youtube'].map((social) => (
                <button
                  key={social}
                  onClick={() => window.open(`https://www.${social}.com`, '_blank')}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/5"
                >
                  <span className="text-sm">
                    {icons[social]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white/90">Experience</h3>
            <ul className="space-y-3 text-sm text-red-50/70">
              {['Home', 'Shop', 'Cart', 'Track Order'].map((link) => (
                <li
                  key={link}
                  className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2 group"
                  onClick={() => navigate(link === 'Home' ? '/' : link === 'Track Order' ? '/profile' : `/${link.toLowerCase().replace(' ', '')}`)}
                >
                  <span className="h-1 w-1 bg-white/40 rounded-full group-hover:bg-white transition-colors" />
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white/90">Support</h3>
            <ul className="space-y-3 text-sm text-red-50/70">
              {['Help Center', 'Shipping Policy', 'Returns', 'Contact Us'].map((item) => (
                <li
                  key={item}
                  onClick={() => navigate('/support')}
                  className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"
                >
                  <span className="h-1 w-1 bg-white/40 rounded-full group-hover:bg-white transition-colors" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white/90">Newsletter</h3>
            <p className="text-xs text-red-50/60 mb-4">Get updates on latest trends and offers.</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Email address"
                className="bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-white/30 flex-1 placeholder:text-red-50/30"
              />
              <button
                onClick={() => alert("Subscribed successfully!")}
                className="bg-white text-red-600 p-2 rounded-lg font-bold hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-red-50/40">
          <p>© {new Date().getFullYear()} flowerKart Ecosystem. All Rights Reserved.</p>
          <p className="flex items-center gap-2">
            Crafted with <span className="text-white">❤</span> by
            <span className="text-white bg-white/10 px-3 py-1 rounded-full border border-white/5 hover:bg-white/20 transition-all cursor-pointer">
              Raunak Kumar
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
