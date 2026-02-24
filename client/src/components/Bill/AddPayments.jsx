import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";

export default function AddPayments() {
  const { participants, payments, setPayments } = useContext(BillContext);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [amount, setAmount] = useState("");

  const addPayment = () => {
    if (!selectedPerson || !amount || parseFloat(amount) <= 0) return;

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

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Who Paid Upfront?</h3>

      <div className="flex gap-2 mb-3">
        <select
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          className="border px-3 py-1 rounded"
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
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="border px-3 py-1 rounded w-32"
        />
        <button
          onClick={addPayment}
          className="bg-green-600 text-white px-3 py-1 rounded"
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
