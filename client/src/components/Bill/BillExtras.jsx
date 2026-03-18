import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";

export default function BillExtras() {
  const {
    tax,
    setTax,
    discount,
    setDiscount,
    allParticipants: participants,
    paidBy,
    setPaidBy,
    items,
  } = useContext(BillContext);

  const [discountType, setDiscountType] = useState("amount"); // "amount" or "percentage"
  const [discountInput, setDiscountInput] = useState("");

  const handleTaxChange = (value) => {
    const num = parseFloat(value) || 0;
    if (num < 0) return;
    if (num > 100000) return;
    setTax(num);
  };

  const handleDiscountInputChange = (value) => {
    setDiscountInput(value);
    const num = parseFloat(value) || 0;
    if (num < 0) return;

    if (discountType === "percentage") {
      if (num > 100) return;
      const subtotal = items.reduce((sum, item) => sum + item.price, 0);
      const discountAmount = (subtotal * num) / 100;
      setDiscount(discountAmount);
    } else {
      if (num > 100000) return;
      setDiscount(num);
    }
  };

  const handleDiscountTypeChange = (type) => {
    setDiscountType(type);
    setDiscountInput("");
    setDiscount(0);
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={discountInput}
                min="0"
                max={discountType === "percentage" ? "100" : "100000"}
                step="0.01"
                onChange={(e) => handleDiscountInputChange(e.target.value)}
                placeholder={discountType === "percentage" ? "Enter %" : "Enter ₹"}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
              />
            </div>
            <select
              value={discountType}
              onChange={(e) => handleDiscountTypeChange(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
            >
              <option value="amount">₹</option>
              <option value="percentage">%</option>
            </select>
          </div>
          {discountType === "percentage" && discount > 0 && (
            <p className="text-sm text-gray-600 mt-1">Discount: ₹{discount.toFixed(2)}</p>
          )}
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
