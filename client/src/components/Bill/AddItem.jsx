import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";
import { motion } from "framer-motion";

export default function AddItem() {
  const { items, setItems, payments, tax, discount } = useContext(BillContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const addItem = () => {
    setError("");
    
    if (!name.trim()) {
      setError("Item name is required");
      return;
    }
    
    if (!price || parseFloat(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (parseFloat(price) > 1000000) {
      setError("Price too high");
      return;
    }

    if (items.some(item => item.name.toLowerCase() === name.trim().toLowerCase())) {
      setError("Item already exists");
      return;
    }

    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    if (totalPaid > 0) {
      const currentTotal = items.reduce((sum, item) => sum + item.price, 0);
      const newTotal = currentTotal + parseFloat(price) + tax - discount;
      if (newTotal > totalPaid) {
        setError(`Total items cannot exceed upfront payments (₹${totalPaid.toFixed(2)})`);
        return;
      }
    }

    const newItem = {
      id: Date.now(),
      name: name.trim(),
      price: Number(price),
      assignedTo: [],
    };

    setItems([...items, newItem]);
    setName("");
    setPrice("");
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        🛒 Add Items
      </h3>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          className="w-full flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          min="0.01"
          max="1000000"
          step="0.01"
          onChange={(e) => setPrice(e.target.value)}
          className="w-full sm:w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        />
        <button
          onClick={addItem}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
}
