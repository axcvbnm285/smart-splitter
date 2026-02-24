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

  const selectAllForItem = (itemId) => {
    const updated = items.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          assignedTo: [...participants],
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
  const unassignedItems = items.filter(item => item.assignedTo.length === 0);
  const canCalculate = items.length > 0 && participants.length >= 2 && unassignedItems.length === 0;

  return (
    <div>
      {unassignedItems.length > 0 && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl mb-4">
          {unassignedItems.length} item(s) not assigned to anyone
        </div>
      )}

      {participants.length < 2 && items.length > 0 && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl mb-4">
          Add at least 2 participants to split
        </div>
      )}

      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`border-2 p-4 rounded-xl bg-white hover:shadow-md transition ${
                item.assignedTo.length === 0 ? 'border-yellow-300' : 'border-gray-200'
              }`}
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

              {participants.length === 0 ? (
                <p className="text-sm text-gray-500">Add participants first</p>
              ) : (
                <>
                  <button
                    onClick={() => selectAllForItem(item.id)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition mb-2"
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
        disabled={!canCalculate}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {!canCalculate && items.length === 0 && "Add items to calculate"}
        {!canCalculate && items.length > 0 && participants.length < 2 && "Add at least 2 participants"}
        {!canCalculate && unassignedItems.length > 0 && participants.length >= 2 && "Assign all items"}
        {canCalculate && "Calculate Split 📊"}
      </button>
    </div>
  );
}
