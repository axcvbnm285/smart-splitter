import { useContext } from "react";
import { BillContext } from "../../context/BillContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function BillTable() {
  const { items, setItems, participants } = useContext(BillContext);
  const navigate = useNavigate();

  const toggleAssign = (itemId, person) => {
    const updated = items.map((item) => {
      if (item.id === itemId) {
        const exists = item.assignedTo.includes(person);
        return {
          ...item,
          assignedTo: exists
            ? item.assignedTo.filter((p) => p !== person)
            : [...item.assignedTo, person],
        };
      }
      return item;
    });

    setItems(updated);
  };

  const removeItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="border-2 border-gray-200 p-4 rounded-xl bg-white hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-800">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-indigo-600">₹{item.price}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:bg-red-50 rounded-full w-6 h-6 flex items-center justify-center transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <div className="border-t-2 border-gray-200 pt-4 mb-6">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span className="text-indigo-600">₹{total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <button
        onClick={() => navigate("/summary")}
        disabled={items.length === 0 || participants.length === 0}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Calculate Split 📊
      </button>
    </div>
  );
}
