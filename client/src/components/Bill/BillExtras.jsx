import { useContext } from "react";
import { BillContext } from "../../context/BillContext";

export default function BillExtras() {
  const {
    tax,
    setTax,
    discount,
    setDiscount,
    participants,
    paidBy,
    setPaidBy,
  } = useContext(BillContext);

  const handleTaxChange = (value) => {
    const num = parseFloat(value) || 0;
    if (num < 0) return;
    if (num > 100000) return;
    setTax(num);
  };

  const handleDiscountChange = (value) => {
    const num = parseFloat(value) || 0;
    if (num < 0) return;
    if (num > 100000) return;
    setDiscount(num);
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        📊 Bill Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">GST / Tax (₹)</label>
          <input
            type="number"
            value={tax}
            min="0"
            max="100000"
            step="0.01"
            onChange={(e) => handleTaxChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
          <input
            type="number"
            value={discount}
            min="0"
            max="100000"
            step="0.01"
            onChange={(e) => handleDiscountChange(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who Paid Full Bill?
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            disabled={participants.length === 0}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select</option>
            {participants.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
