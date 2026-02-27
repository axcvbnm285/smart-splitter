import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function BillsHistory() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBills();
  }, [user, navigate]);

  const fetchBills = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bills/`);
      setBills(data.bills);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBill = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try {
      await axios.delete(`${API_URL}/bills/${id}`);
      setBills(bills.filter(b => b._id !== id));
    } catch (error) {
      alert("Failed to delete bill");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            📋 My Bills
          </h2>
        </motion.div>

        {bills.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 mb-4">No saved bills yet</p>
            <button
              onClick={() => navigate("/edit")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Create New Bill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bills.map((bill, index) => (
              <motion.div
                key={bill._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">{bill.title}</h3>
                <p className="text-gray-600 mb-2">
                  {bill.participants.length} participants
                </p>
                <p className="text-2xl font-bold text-indigo-600 mb-4">
                  ₹{bill.total.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {new Date(bill.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => deleteBill(bill._id)}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
