import { useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useMemo } from "react";
import { BillContext } from "../context/BillContext";

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

  // 🔥 LIVE CALCULATIONS
  const calculatedSubtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );
  }, [items]);

  const calculatedTax =
    Number(cgst || 0) + Number(sgst || 0);

  const calculatedFinal =
    calculatedSubtotal + calculatedTax - Number(discount || 0);

  const isMismatch =
    aiTotal && Math.abs(calculatedFinal - aiTotal) > 1;

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setLocalItems(updated);
  };

  const handleDelete = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setLocalItems(updated);
  };

  const handleAddItem = () => {
    setLocalItems([
      ...items,
      { name: "", quantity: 1, total: 0 },
    ]);
  };

  const handleConfirm = () => {
    const formattedItems = items.map((item, index) => ({
      id: Date.now() + index,
      name: item.name,
      price: Number(item.total || item.price || 0),
      assignedTo: [],
    }));

    console.log("Setting items:", formattedItems);
    setItems(formattedItems);
    setTax(calculatedTax);
    setDiscount(Number(discount || 0));

    navigate("/edit");
  };

  if (!extracted) {
    return <p>No extracted data found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">

      <h2 className="text-2xl sm:text-3xl font-bold">
        Review & Edit Extracted Bill
      </h2>

      {/* Warning Banner */}
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-semibold">AI Extraction - Please Review</p>
            <p className="text-sm">The bill data was extracted using AI and may contain errors. Please carefully review all items, quantities, and amounts before proceeding.</p>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center"
          >
            <input
              value={item.name}
              onChange={(e) =>
                handleItemChange(index, "name", e.target.value)
              }
              className="border p-2 w-full flex-1 rounded"
            />

            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="border p-2 w-full sm:w-24 rounded"
            />

            <input
              type="number"
              value={item.total}
              onChange={(e) =>
                handleItemChange(index, "total", e.target.value)
              }
              className="border p-2 w-full sm:w-32 rounded"
            />

            <button
              onClick={() => handleDelete(index)}
              className="w-full sm:w-auto text-red-500 font-bold border border-red-200 rounded px-3 py-2 sm:p-0 sm:border-0"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleAddItem}
        className="px-4 py-2 bg-gray-200 rounded-lg"
      >
        + Add Item
      </button>

      {/* Tax Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
        <input
          type="number"
          value={cgst}
          onChange={(e) => setCgst(e.target.value)}
          placeholder="CGST"
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          value={sgst}
          onChange={(e) => setSgst(e.target.value)}
          placeholder="SGST"
          className="border p-2 rounded w-full"
        />

        <input
          type="number"
          value={discount}
          onChange={(e) => setLocalDiscount(e.target.value)}
          placeholder="Discount"
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Calculation Summary */}
      <div
        className={`p-4 rounded-xl shadow mt-6 ${
          isMismatch ? "bg-red-100" : "bg-green-100"
        }`}
      >
        <p><strong>Calculated Subtotal:</strong> ₹{calculatedSubtotal}</p>
        <p><strong>Calculated Tax:</strong> ₹{calculatedTax}</p>
        <p><strong>Calculated Final:</strong> ₹{calculatedFinal}</p>

        {aiTotal > 0 && (
          <p><strong>AI Detected Total:</strong> ₹{aiTotal}</p>
        )}

        {isMismatch && (
          <p className="text-red-600 font-semibold">
            ⚠ Total mismatch detected. Please verify values.
          </p>
        )}
      </div>

      <button
        onClick={handleConfirm}
        className="px-6 py-3 bg-indigo-600 text-white rounded-xl"
      >
        Confirm & Continue
      </button>
    </div>
  );
}
