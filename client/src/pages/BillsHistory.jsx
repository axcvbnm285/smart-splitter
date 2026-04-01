import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BillsHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchBills();
  }, [user, navigate]);

  const fetchBills = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bills/`);
      setBills(data.bills);
    } catch {
      console.error("Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try {
      await axios.delete(`${API_URL}/bills/${id}`);
      setBills(bills.filter(b => b._id !== id));
      if (expanded === id) setExpanded(null);
    } catch {
      alert("Failed to delete bill");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate("/")} className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2">
            ← Back to Home
          </button>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📋 My Bills
          </h2>
        </motion.div>

        {bills.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 mb-4">No saved bills yet</p>
            <button onClick={() => navigate("/edit")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
              Create New Bill
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bills.map((bill, index) => (
              <motion.div
                key={bill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Card header — always visible */}
                <div
                  className="flex items-center justify-between p-5 cursor-pointer hover:bg-white/90 transition"
                  onClick={() => setExpanded(expanded === bill._id ? null : bill._id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 truncate">{bill.title}</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm text-gray-500">{new Date(bill.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        {bill.participants.length} people
                      </span>
                      {bill.settlements?.length > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          {bill.settlements.length} transaction{bill.settlements.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4 shrink-0">
                    <span className="text-xl font-bold text-indigo-600">₹{bill.total.toFixed(2)}</span>
                    <span className={`text-gray-400 transition-transform duration-200 ${expanded === bill._id ? "rotate-180" : ""}`}>▼</span>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expanded === bill._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">

                        {/* Participants */}
                        <div>
                          <p className="text-sm font-semibold text-gray-500 mb-2">👥 Participants</p>
                          <div className="flex gap-2 flex-wrap">
                            {bill.participants.map(p => (
                              <span key={p} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Settlements */}
                        {bill.settlements?.length > 0 ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-500 mb-2">🔄 Settlements</p>
                            <div className="space-y-2">
                              {bill.settlements.map((s, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                  <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{s.from[0]}</span>
                                    <span className="text-sm font-semibold text-gray-700">{s.from}</span>
                                    <span className="text-gray-400 text-sm">→</span>
                                    <span className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{s.to[0]}</span>
                                    <span className="text-sm font-semibold text-gray-700">{s.to}</span>
                                  </div>
                                  <span className="font-bold text-green-600">₹{s.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No settlements recorded</p>
                        )}

                        <button
                          onClick={() => deleteBill(bill._id)}
                          className="w-full px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition text-sm"
                        >
                          🗑 Delete Bill
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
