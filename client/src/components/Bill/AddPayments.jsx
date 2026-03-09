import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";

export default function AddPayments() {
  const { participants, payments, setPayments, items, tax, discount } = useContext(BillContext);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const addPayment = () => {
    setError("");
    
    if (!selectedPerson) {
      setError("Please select a person");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    if (parseFloat(amount) > 1000000) {
      setError("Amount too high");
      return;
    }

    const newTotalPaid = totalPaid + parseFloat(amount);
    if (totalBill > 0 && newTotalPaid > totalBill + tax - discount) {
      setError(`Total payments cannot exceed bill amount (₹${(totalBill + tax - discount).toFixed(2)})`);
      return;
    }

    setPayments([
      ...payments,
      { person: selectedPerson, amount: parseFloat(amount) },
    ]);
    setSelectedPerson("");
    setAmount("");
  };

  const removePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalBill = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        💵 Who Paid Upfront?
      </h3>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}

      {totalBill > 0 && totalPaid > totalBill * 1.5 && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl mb-3">
          Warning: Total paid exceeds bill amount significantly
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <select
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          className="w-full flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        >
          <option value="">Select person</option>
          {participants.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={amount}
          min="0.01"
          max="1000000"
          step="0.01"
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full sm:w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        />
        <button
          onClick={addPayment}
          disabled={participants.length === 0}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {payments.length > 0 && (
        <div className="space-y-2">
          {payments.map((payment, index) => (
            <div
              key={index}
              className="bg-gray-100 px-3 py-2 rounded flex justify-between items-center"
            >
              <span>
                {payment.person}: ₹{payment.amount}
              </span>
              <button
                onClick={() => removePayment(index)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <div className="font-semibold text-right">
            Total Paid: ₹{totalPaid.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
