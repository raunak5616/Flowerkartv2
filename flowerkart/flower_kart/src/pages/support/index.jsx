import { useState } from "react";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Support request submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <section className="bg-red-gradient text-white py-12 text-center">
        <h1 className="text-3xl font-bold">flowerKart Support</h1>
        <p className="mt-2 text-sm">
          We're here to help you 24/7 🚀
        </p>
      </section>

      {/* QUICK HELP CARDS */}
      <section className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">Order Issues</h3>
          <p className="text-gray-600 text-sm">
            Track, cancel or modify your order easily.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">Payment Help</h3>
          <p className="text-gray-600 text-sm">
            Facing payment problems? We're here.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <h3 className="font-semibold text-lg mb-2">Returns & Refunds</h3>
          <p className="text-gray-600 text-sm">
            Easy returns and fast refunds.
          </p>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-white p-8 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-6 text-center">
            Contact Support
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border rounded-md p-3 outline-none focus:ring-2 focus:ring-red-500"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border rounded-md p-3 outline-none focus:ring-2 focus:ring-red-500"
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              rows="4"
              placeholder="Describe your issue..."
              className="w-full border rounded-md p-3 outline-none focus:ring-2 focus:ring-red-500"
              onChange={handleChange}
              required
            ></textarea>

            <button
              type="submit"
              className="w-full bg-red-gradient text-white py-3 rounded-md hover:opacity-90 transition"
            >
              Submit Request
            </button>
          </form>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">How can I track my order?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Go to your profile → Orders → Track.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">How long does delivery take?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Usually within 30–60 minutes depending on location.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-semibold">How do I request a refund?</h4>
            <p className="text-sm text-gray-600 mt-1">
              Contact support using the form above.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
