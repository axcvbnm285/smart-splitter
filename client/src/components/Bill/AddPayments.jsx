import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";

export default function AddPayments() {
  const { participants, payments, setPayments, paidBy, items, tax, discount, currency } = useContext(BillContext);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const sym = currency?.symbol || "₹";
  const billTotal = parseFloat((items.reduce((s, i) => s + i.price, 0) + tax - discount).toFixed(2));
  const totalPaid = parseFloat(payments.reduce((s, p) => s + p.amount, 0).toFixed(2));
  const remaining = parseFloat((billTotal - totalPaid).toFixed(2));

  // Disabled if paidBy is set
  if (paidBy) {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          💵 Who Paid Upfront?
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-sm">
          Clear "Who Paid Full Bill?" in Bill Details to use upfront payments instead.
        </div>
      </div>
    );
  }

  const addPayment = () => {
    setError("");
    if (!selectedPerson) { setError("Please select a person"); return; }
    if (!amount || parseFloat(amount) <= 0) { setError("Amount must be greater than 0"); return; }
    if (parseFloat(amount) > 1000000) { setError("Amount too high"); return; }

    const newTotalPaid = totalPaid + parseFloat(amount);
    if (billTotal > 0 && parseFloat(newTotalPaid.toFixed(2)) > billTotal) {
      setError(`Exceeds bill total. Remaining to assign: ${sym}${remaining.toFixed(2)}`);
      return;
    }

    setPayments([...payments, { person: selectedPerson, amount: parseFloat(parseFloat(amount).toFixed(2)) }]);
    setSelectedPerson("");
    setAmount("");
  };

  const removePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
        💵 Who Paid Upfront?
      </h3>

      {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3 text-sm">{error}</div>}

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <select
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          className="w-full flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        >
          <option value="">Select person</option>
          {participants.map((p) => <option key={p} value={p}>{p}</option>)}
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
          disabled={participants.length === 0 || remaining <= 0}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {/* Progress bar */}
      {billTotal > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Paid: {sym}{totalPaid.toFixed(2)}</span>
            <span className={remaining > 0 ? "text-orange-500 font-semibold" : "text-green-600 font-semibold"}>
              {remaining > 0 ? `Remaining: ${sym}${remaining.toFixed(2)}` : "✓ Fully accounted"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${remaining <= 0 ? "bg-green-500" : "bg-indigo-500"}`}
              style={{ width: `${Math.min((totalPaid / billTotal) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <div className="space-y-2">
          {payments.map((payment, index) => (
            <div key={index} className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{payment.person}: {sym}{payment.amount.toFixed(2)}</span>
              <button onClick={() => removePayment(index)} className="text-red-400 hover:text-red-600 transition">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
