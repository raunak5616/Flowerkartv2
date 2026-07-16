import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Send,
  MessageSquare,
  Clock,
  Sparkles,
  CheckCircle2
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact submission: ", formData);
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-left pt-20 sm:pt-28 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Title Section */}
        <div className="text-left max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-700 border border-rose-100/50 mb-3.5">
            <Sparkles className="h-3.5 w-3.5" />
            Get in touch
          </div>
          <h1 className="text-3.5xl sm:text-5xl font-black tracking-tight text-gray-950 leading-tight">
            We'd love to hear from you
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-semibold leading-relaxed mt-2.5">
            Whether you have questions about bulk corporate event gifting, partner florist signups, or custom arrangement requests, drop us a line.
          </p>
        </div>

        {/* Contact layout grid */}
        <div className="grid lg:grid-cols-[400px_1fr] gap-8">
          
          {/* LEFT: Contact channel details */}
          <div className="space-y-6">
            
            {/* Info card */}
            <div className="bg-gray-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="text-base font-black uppercase tracking-widest text-gray-300">Contact Channels</h3>
              
              <div className="space-y-5 text-xs font-semibold">
                <div className="flex gap-3.5 items-start">
                  <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                    <Mail className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Send an email</p>
                    <p className="text-white font-bold mt-0.5">hello@flowerkart.com</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                    <Phone className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Call or WhatsApp</p>
                    <p className="text-white font-bold mt-0.5">+91 1800 234 567</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                    <MapPin className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Office Headquarters</p>
                    <p className="text-white font-bold mt-0.5 leading-relaxed">Suite 500, Prestige Tech Park, Outer Ring Rd, Bengaluru</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start">
                  <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                    <Clock className="h-4 w-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Operating Hours</p>
                    <p className="text-white font-bold mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded interactive map */}
            <div className="h-44 rounded-3xl border border-gray-100 overflow-hidden bg-white shadow-sm relative">
              <iframe
                title="Office HQ map location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.685,12.935,77.705,12.955&layer=mapnik&marker=12.945,77.695"
              ></iframe>
            </div>
          </div>

          {/* RIGHT: Contact message form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-gray-950">Send Inquiry</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isSent && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Your message has been sent successfully. We'll be in touch!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="John Doe"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="name@domain.com"
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  placeholder="e.g. Bulk Corporate Event Inquiry"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  rows="4"
                  placeholder="Detail your request..."
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl p-3.5 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 bg-gray-950 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-md shadow-gray-200"
              >
                <Send className="h-3.5 w-3.5" />
                Submit Message
              </motion.button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}