import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function BillTable() {
  const { items, setItems, participants, payments, tax, discount, currency } = useContext(BillContext);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState("");

  const sym = currency?.symbol || "₹";

  const toggleAssign = (itemId, person) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item;
      const exists = item.assignedTo.includes(person);
      return { ...item, assignedTo: exists ? item.assignedTo.filter(p => p !== person) : [...item.assignedTo, person] };
    }));
  };

  const selectAllForItem = (itemId) =>
    setItems(items.map(item => item.id === itemId ? { ...item, assignedTo: [...participants] } : item));

  const assignAllToAll = () =>
    setItems(items.map(item => ({ ...item, assignedTo: [...participants] })));

  const removeItem = (itemId) => setItems(items.filter(item => item.id !== itemId));

  const startEdit = (item) => { setEditingId(item.id); setEditPrice(String(item.price)); };

  const confirmEdit = (itemId) => {
    const val = parseFloat(editPrice);
    if (!isNaN(val) && val > 0) {
      setItems(items.map(item => item.id === itemId ? { ...item, price: val } : item));
    }
    setEditingId(null);
  };

  // Live running totals per person
  const runningTotals = {};
  participants.forEach(p => { runningTotals[p] = 0; });
  items.forEach(item => {
    if (item.assignedTo.length === 0) return;
    const share = item.price / item.assignedTo.length;
    item.assignedTo.forEach(p => { if (runningTotals[p] !== undefined) runningTotals[p] += share; });
  });

  const billTotal = parseFloat((items.reduce((s, i) => s + i.price, 0) + tax - discount).toFixed(2));
  const totalPaid = parseFloat(payments.reduce((s, p) => s + p.amount, 0).toFixed(2));
  const paymentsIncomplete = payments.length > 0 && totalPaid < billTotal;
  const unassignedItems = items.filter(item => item.assignedTo.length === 0);
  const canCalculate = items.length > 0 && participants.length >= 2 && unassignedItems.length === 0 && !paymentsIncomplete;

  return (
    <div>
      {/* Warnings */}
      {paymentsIncomplete && (
        <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-xl mb-3 text-sm">
          Upfront payments ({sym}{totalPaid.toFixed(2)}) must equal bill total ({sym}{billTotal.toFixed(2)})
        </div>
      )}
      {unassignedItems.length > 0 && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl mb-3 text-sm">
          {unassignedItems.length} item(s) not assigned to anyone
        </div>
      )}
      {participants.length < 2 && items.length > 0 && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl mb-3 text-sm">
          Add at least 2 participants to split
        </div>
      )}

      {/* Assign All to All */}
      {items.length > 0 && participants.length >= 2 && (
        <button
          onClick={assignAllToAll}
          className="w-full mb-4 px-4 py-2 bg-indigo-50 border-2 border-indigo-200 text-indigo-700 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition"
        >
          ⚡ Assign All Items to Everyone
        </button>
      )}

      {/* Items list */}
      <div className="space-y-3 mb-4">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`border-2 p-4 rounded-xl bg-white hover:shadow-md transition ${item.assignedTo.length === 0 ? "border-yellow-300" : "border-gray-200"}`}
            >
              <div className="flex justify-between items-start gap-3 mb-3">
                <span className="font-semibold text-gray-800 break-words flex-1">{item.name}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Inline price edit */}
                  {editingId === item.id ? (
                    <input
                      autoFocus
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      onBlur={() => confirmEdit(item.id)}
                      onKeyDown={(e) => e.key === "Enter" && confirmEdit(item.id)}
                      className="w-24 px-2 py-1 border-2 border-indigo-400 rounded-lg text-sm font-bold text-indigo-600 focus:outline-none"
                    />
                  ) : (
                    <button
                      onClick={() => startEdit(item)}
                      className="text-base font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-lg transition"
                      title="Click to edit price"
                    >
                      {sym}{item.price}
                    </button>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {participants.length === 0 ? (
                <p className="text-sm text-gray-400">Add participants first</p>
              ) : (
                <>
                  <button
                    onClick={() => selectAllForItem(item.id)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition mb-2"
                  >
                    Select All
                  </button>
                  <div className="flex gap-2 flex-wrap">
                    {participants.map((person) => (
                      <button
                        key={person}
                        onClick={() => toggleAssign(item.id, person)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          item.assignedTo.includes(person)
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {person}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bill total */}
      {items.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-3 mb-4">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-600">{sym}{billTotal.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Live running totals */}
      {participants.length >= 2 && items.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 mb-4 border border-indigo-100">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-3">💰 Live Split</p>
          <div className="space-y-2">
            {participants.map(p => {
              const amount = runningTotals[p] || 0;
              const pct = billTotal > 0 ? (amount / billTotal) * 100 : 0;
              return (
                <div key={p}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{p}</span>
                    <span className="text-sm font-bold text-indigo-600">{sym}{amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Calculate button */}
      <button
        onClick={() => navigate("/summary")}
        disabled={!canCalculate}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {!canCalculate && items.length === 0 && "Add items to calculate"}
        {!canCalculate && items.length > 0 && participants.length < 2 && "Add at least 2 participants"}
        {!canCalculate && unassignedItems.length > 0 && participants.length >= 2 && "Assign all items"}
        {!canCalculate && paymentsIncomplete && "Upfront payments must equal bill total"}
        {canCalculate && "Calculate Split 📊"}
      </button>
    </div>
  );
}
