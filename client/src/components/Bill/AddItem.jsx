import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";
import { motion } from "framer-motion";

export default function AddItem() {
  const { items, setItems } = useContext(BillContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const addItem = () => {
    if (!name || !price) return;

    const newItem = {
      id: Date.now(),
      name,
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

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        />
        <button
          onClick={addItem}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
}
