import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Package,
  CreditCard,
  RefreshCcw,
  Mail,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Send,
  User,
  CheckCircle2
} from "lucide-react";

const faqData = [
  {
    question: "How can I track my delivery status?",
    answer: "You can track your active orders by navigating to your profile page and reviewing the recent orders list. Statuses update from Pending to Delivered as florists finalize deliveries."
  },
  {
    question: "How long does standard delivery take?",
    answer: "Delivery usually takes between 30 to 60 minutes depending on your proximity to the florist partner. Delivery coordinates and house details ensure accuracy."
  },
  {
    question: "What is your refund policy for damaged blooms?",
    answer: "Since flowers are perishable, please inspect them on receipt. If there are fresh issues, capture photos and contact support using this form within 12 hours."
  },
  {
    question: "Which payment methods are accepted?",
    answer: "We support completely secure checkout using Razorpay which accepts all credit/debit cards, UPI payments, netbanking, and mobile wallets."
  }
];

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 text-left pb-16">

      {/* Premium Hero Title */}
      <section className="bg-gray-950 text-white py-14 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-80 h-80 bg-rose-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-rose-400">
            <HelpCircle className="h-3.5 w-3.5" />
            24/7 Help Desk
          </div>
          <h1 className="text-3.5xl sm:text-4.5xl font-black tracking-tight leading-none">
            flowerKart Support
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-semibold max-w-md leading-relaxed">
            Have questions about shipments, florist coordinates, or invoice verification? We're here to assist.
          </p>
        </div>
      </section>

      {/* QUICK HELP CARDS */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Package, title: "Order Issues", text: "Modify delivery coordinates, addresses, or cancel orders easily." },
          { icon: CreditCard, title: "Payment Support", text: "Verify Razorpay transactions, coupon adjustments, and refunds." },
          { icon: RefreshCcw, title: "Returns & Refund", text: "Initiate claims for stale blooms within 12 hours of delivery." }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between"
          >
            <div className="h-10 w-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 border border-rose-100/50 shadow-inner mb-6">
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-400 font-semibold leading-relaxed mt-1.5">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* DUAL COLUMN: FORM vs FAQ */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 mt-6">

        {/* Support Request Form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="text-left">
            <h2 className="text-lg font-black text-gray-950">Send Message</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">Our support associates respond within 15 minutes.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {isSubmitted && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                <span>Support request logged. We'll email you shortly!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Your Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="FlowerKart"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="flowerKart@.com"
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider">Message details</label>
              <textarea
                name="message"
                value={formData.message}
                rows="4"
                placeholder="Describe your delivery coordinates, order items details, or invoice issues..."
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
              Submit Ticket
            </motion.button>
          </form>
        </div>

        {/* FAQs accordion */}
        <div className="space-y-6">
          <div className="text-left">
            <h2 className="text-lg font-black text-gray-950">Common Questions</h2>
            <p className="text-xs text-gray-400 font-semibold mt-1">Instant resolutions to typical delivery inquiries.</p>
          </div>

          <div className="space-y-3.5">
            {faqData.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 flex justify-between items-center text-left text-xs font-black text-gray-900 uppercase tracking-wide focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400"
                    >
                      <ChevronDown className="h-4.5 w-4.5" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 text-xs font-semibold leading-relaxed text-gray-500 border-t border-gray-50 pt-2.5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </section>

    </div>
  );
}
