import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { BillContext } from "../context/BillContext";
import { motion } from "framer-motion";
import AddParticipants from "../components/Bill/AddParticipants";
import AddPayments from "../components/Bill/AddPayments";
import AddItem from "../components/Bill/AddItem";
import BillTable from "../components/Bill/BillTable";
import BillExtras from "../components/Bill/BillExtras";
import CurrencySelector from "../components/Common/CurrencySelector";

export default function BillEditor() {
  const navigate = useNavigate();
  const { bills, activeBillId, setActiveBillId, addBill, removeBill, renameBill, resetAll } = useContext(BillContext);
  const [editingBillId, setEditingBillId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleRename = (id) => {
    renameBill(id, editingName);
    setEditingBillId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-6 sm:py-8 px-4">

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <p className="text-2xl mb-3 text-center">🗑️</p>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Start Over?</h3>
            <p className="text-sm text-gray-500 text-center mb-5">This will clear all bills, participants, and items. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => { resetAll(); setShowResetConfirm(false); }} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition">
                Yes, Reset
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
          <div>
            <button onClick={() => navigate("/")} className="text-indigo-600 hover:text-indigo-700 mb-2 flex items-center gap-2">
              ← Back to Home
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Bill
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <CurrencySelector />
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2.5 bg-red-50 text-red-500 border border-red-200 rounded-xl font-semibold text-sm hover:bg-red-100 transition"
            >
              🗑️ Reset
            </button>
            <button
              onClick={() => navigate("/upload")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
            >
              📸 Scan Bill
            </button>
          </div>
        </div>
      </motion.div>

      {/* Bill Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex gap-2 flex-wrap items-center">
          {bills.map((bill) => (
            <div key={bill.id} className="flex items-center">
              {editingBillId === bill.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleRename(bill.id)}
                  onKeyPress={(e) => e.key === "Enter" && handleRename(bill.id)}
                  className="px-3 py-2 border-2 border-indigo-500 rounded-xl text-sm w-32"
                />
              ) : (
                <button
                  onClick={() => setActiveBillId(bill.id)}
                  onDoubleClick={() => { setEditingBillId(bill.id); setEditingName(bill.name); }}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
                    activeBillId === bill.id ? "bg-indigo-600 text-white shadow-lg" : "bg-white/80 text-gray-700 hover:bg-white"
                  }`}
                >
                  {bill.name}
                  {bills.length > 1 && (
                    <span onClick={(e) => { e.stopPropagation(); removeBill(bill.id); }} className="hover:text-red-400 ml-1">
                      ✕
                    </span>
                  )}
                </button>
              )}
            </div>
          ))}
          <button onClick={addBill} className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold text-sm hover:bg-green-600 transition shadow">
            + Add Bill
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Double-click a tab to rename it</p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
            <AddParticipants />
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
            <AddItem />
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
            <BillExtras />
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6">
            <AddPayments />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Bill Items</h3>
            <BillTable />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
