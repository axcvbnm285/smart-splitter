import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useMemo } from "react";
import { BillContext } from "../context/BillContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setItems, setTax, setDiscount } = useContext(BillContext);

  const extracted = location.state?.structured;

  const [items, setLocalItems] = useState(extracted?.items || []);
  const [cgst, setCgst] = useState(extracted?.cgst || 0);
  const [sgst, setSgst] = useState(extracted?.sgst || 0);
  const [discount, setLocalDiscount] = useState(extracted?.discount || 0);
  const [aiTotal] = useState(extracted?.total || 0);

  const calculatedSubtotal = useMemo(() =>
    items.reduce((sum, item) => sum + Number(item.total || 0), 0), [items]);

  const calculatedTax = Number(cgst || 0) + Number(sgst || 0);
  const calculatedFinal = calculatedSubtotal + calculatedTax - Number(discount || 0);
  const isMismatch = aiTotal && Math.abs(calculatedFinal - aiTotal) > 1;

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setLocalItems(updated);
  };

  const handleDelete = (index) => setLocalItems(items.filter((_, i) => i !== index));

  const handleAddItem = () => setLocalItems([...items, { name: "", quantity: 1, total: 0 }]);

  const handleConfirm = () => {
    setItems(items.map((item, i) => ({
      id: Date.now() + i,
      name: item.name,
      price: Number(item.total || item.price || 0),
      assignedTo: [],
    })));
    setTax(calculatedTax);
    setDiscount(Number(discount || 0));
    navigate("/edit");
  };

  if (!extracted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 text-center">
          <p className="text-4xl mb-4">🤷</p>
          <p className="text-gray-600 mb-4">No bill data found.</p>
          <button onClick={() => navigate("/upload")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
            Scan a Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={() => navigate("/upload")} className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2 font-medium">
            ← Back
          </button>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow shrink-0">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Review Extracted Bill</h2>
              <p className="text-sm text-gray-500">Check and edit items before confirming</p>
            </div>
          </div>
        </motion.div>

        {/* AI Warning */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex gap-3 items-start">
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800 text-sm">AI Extraction — Please Review</p>
            <p className="text-yellow-700 text-xs mt-0.5">Items may contain errors. Verify all amounts before proceeding.</p>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">🛒 Items ({items.length})</h3>
            <button onClick={handleAddItem} className="text-sm px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-200 transition">
              + Add Item
            </button>
          </div>

          <div className="p-4 space-y-3">
            {/* Column headers */}
            <div className="grid grid-cols-12 gap-2 px-1">
              <span className="col-span-5 text-xs font-semibold text-gray-400 uppercase">Item</span>
              <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase">Qty</span>
              <span className="col-span-3 text-xs font-semibold text-gray-400 uppercase">Amount</span>
              <span className="col-span-1" />
            </div>

            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.03 }}
                  className="grid grid-cols-12 gap-2 items-center bg-gray-50 rounded-xl p-2">
                  <input
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    placeholder="Item name"
                    className="col-span-5 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-indigo-400 focus:outline-none bg-white"
                  />
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="col-span-3 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-indigo-400 focus:outline-none bg-white"
                  />
                  <input
                    type="number"
                    value={item.total}
                    onChange={(e) => handleItemChange(index, "total", e.target.value)}
                    className="col-span-3 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:border-indigo-400 focus:outline-none bg-white"
                  />
                  <button onClick={() => handleDelete(index)}
                    className="col-span-1 w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg transition text-sm">
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {items.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-4">No items. Click "+ Add Item" to add manually.</p>
            )}
          </div>
        </motion.div>

        {/* Tax & Discount */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5">
          <h3 className="font-bold text-gray-800 mb-4">📊 Tax & Discount</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "CGST (₹)", value: cgst, setter: setCgst },
              { label: "SGST (₹)", value: sgst, setter: setSgst },
              { label: "Discount (₹)", value: discount, setter: setLocalDiscount },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:border-indigo-400 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className={`rounded-2xl shadow-lg p-5 ${isMismatch ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
          <h3 className="font-bold text-gray-800 mb-3">🧮 Bill Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span className="font-semibold">₹{calculatedSubtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax (CGST + SGST)</span><span className="font-semibold">₹{calculatedTax.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Discount</span><span className="font-semibold text-green-600">- ₹{Number(discount || 0).toFixed(2)}</span></div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
              <span>Final Total</span>
              <span className={isMismatch ? "text-red-600" : "text-green-600"}>₹{calculatedFinal.toFixed(2)}</span>
            </div>
            {aiTotal > 0 && (
              <div className="flex justify-between text-gray-500 text-xs"><span>AI Detected Total</span><span>₹{aiTotal}</span></div>
            )}
            {isMismatch && (
              <p className="text-red-600 text-xs font-semibold mt-1">⚠ Total mismatch — please verify values above</p>
            )}
          </div>
        </motion.div>

        {/* Confirm */}
        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          onClick={handleConfirm}
          disabled={items.length === 0}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Confirm & Continue →
        </motion.button>

      </div>
    </div>
  );
}
