import { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const Bills = () => {
  const [searchId, setSearchId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [billsData, setBillsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    const shopId = localStorage.getItem("shopId");
    try {
      const response = await axios.get(`http://localhost:8080/api/products/bills/${shopId}`);
      setBillsData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = billsData.filter((bill) => {
    if (searchId && !bill.id.toLowerCase().includes(searchId.toLowerCase())) return false;
    if (statusFilter !== "All" && bill.status !== statusFilter) return false;
    if (fromDate && bill.date < fromDate) return false;
    if (toDate && bill.date > toDate) return false;
    return true;
  });

  const groupedBills = filteredBills.reduce((acc, bill) => {
    acc[bill.date] = acc[bill.date] || [];
    acc[bill.date].push(bill);
    return acc;
  }, {});

  const downloadInvoice = (bill) => {
    const doc = new jsPDF();
    const primaryColor = [220, 38, 38]; // flowerKart Red
    const secondaryColor = [31, 41, 55]; // Dark Gray

    // 1. HEADER DECORATION
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, 210, 297, "F"); // Light background

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 15, "F"); // Top bar

    // 2. BRANDING
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...primaryColor);
    doc.text("flowerKart", 15, 35);

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("PREMIUM FLORAL MARKETPLACE", 15, 41);

    // 3. INVOICE META (Top Right)
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("INVOICE", 195, 35, { align: "right" });
    doc.setFontSize(14);
    doc.text(`#${bill.id.toUpperCase()}`, 195, 43, { align: "right" });

    // 4. DIVIDER
    doc.setDrawColor(230);
    doc.line(15, 50, 195, 50);

    // 5. SELLER & CUSTOMER DETAILS (Side by Side)
    // Seller Info
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("FROM:", 15, 60);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(localStorage.getItem("shopName") || "Authorized Seller", 15, 66);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Store Link: ID-${localStorage.getItem("shopId")?.slice(-8).toUpperCase()}`, 15, 71);
    doc.text("Merchant Partner Network", 15, 76);

    // Customer Info
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("BILL TO:", 120, 60);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(bill.customer || "Valued Customer", 120, 66);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Order Date: ${bill.date}`, 120, 71);
    doc.text(`Payment: ${bill.status === "Paid" ? "Online / Prepaid" : "COD"}`, 120, 76);

    // 6. ITEMS TABLE
    const tableRows = bill.items.map((item, index) => [
      { content: index + 1, styles: { halign: 'center' } },
      item.name || item.title,
      { content: item.qty || 1, styles: { halign: 'center' } },
      { content: `₹${item.price}`, styles: { halign: 'right' } },
      { content: `₹${(item.price * (item.qty || 1))}`, styles: { halign: 'right' } }
    ]);

    autoTable(doc, {
      startY: 90,
      head: [["#", "Item Description", "Qty", "Price", "Subtotal"]],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        cellPadding: 4
      },
      alternateRowStyles: { fillColor: [252, 252, 252] },
      margin: { left: 15, right: 15 },
      styles: {
        font: "helvetica",
        fontSize: 9,
        cellPadding: 4,
        lineColor: 240,
        lineWidth: 0.1
      }
    });

    // 7. SUMMARY SECTION
    const finalY = (doc).lastAutoTable.finalY + 15;

    // Box for totals
    doc.setFillColor(255);
    doc.setDrawColor(240);
    doc.roundedRect(120, finalY - 5, 75, 40, 3, 3, "FD");

    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Subtotal:", 125, finalY + 5);
    doc.text(`₹${bill.amount}`, 188, finalY + 5, { align: "right" });

    doc.text("Platform Fees:", 125, finalY + 12);
    doc.text("₹0.00", 188, finalY + 12, { align: "right" });

    doc.setFontSize(12);
    doc.setTextColor(...primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total:", 125, finalY + 25);
    doc.text(`₹${bill.amount}`, 188, finalY + 25, { align: "right" });

    // Payment Status Badge
    doc.setFillColor(240, 253, 244); // Green-50
    doc.roundedRect(15, finalY - 5, 60, 20, 2, 2, "F");
    doc.setTextColor(22, 163, 74); // Green-600
    doc.setFontSize(8);
    doc.text("PAYMENT STATUS", 20, finalY + 2);
    doc.setFontSize(11);
    doc.text("● PAID FULLY", 20, finalY + 10);

    // 8. FOOTER
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 275, 50, 275);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Support & Queries", 15, 282);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text("Email: support@flowerkart.com | Web: www.flowerkart.com", 15, 287);

    doc.setFontSize(8);
    doc.setTextColor(180);
    doc.text("Generated by flowerKart Seller Portal v2.0", 195, 287, { align: "right" });

    doc.save(`Invoice_${bill.id.toUpperCase()}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">Financial Overview</h1>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl p-6 mb-10 shadow-sm border border-gray-100 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">Search ID</label>
            <input
              type="text"
              placeholder="ORD-XXXXX"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none bg-transparent transition-colors"
            >
              <option value="All">All Transactions</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-400">To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-b-2 border-gray-100 py-2 focus:border-red-500 outline-none transition-colors"
            />
          </div>
        </div>

        {billsData.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center shadow-sm">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-800">No invoices yet</h3>
            <p className="text-gray-500 mt-2">Your billing history will appear here once orders are placed.</p>
          </div>
        ) : (
          Object.keys(groupedBills).sort((a, b) => new Date(b) - new Date(a)).map((date) => (
            <div key={date} className="mb-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-red-100">
                  {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              <div className="grid gap-4">
                {groupedBills[date].map((bill) => (
                  <div
                    key={bill.id}
                    className="bg-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all border border-gray-50"
                  >
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center text-red-500">
                        <span className="material-symbols-outlined">receipt_long</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase leading-none mb-1">{bill.time}</p>
                        <h3 className="text-sm font-bold text-gray-800">{bill.id}</h3>
                      </div>
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Customer</p>
                      <p className="font-semibold text-gray-700">{bill.customer}</p>
                    </div>

                    <div className="w-full md:w-auto text-center md:text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Settlement</p>
                      <p className="text-lg font-black text-gray-900">₹{bill.amount}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${bill.status === "Paid" ? "bg-green-50 text-green-600 border border-green-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                        }`}>
                        {bill.status}
                      </span>
                      <button
                        onClick={() => downloadInvoice(bill)}
                        className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-red-gradient hover:text-white transition-all shadow-sm"
                        title="Download Invoice"
                      >
                        <span className="material-symbols-outlined text-sm">download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
