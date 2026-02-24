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

  return (
    <div className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Bill Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GST */}
        <div>
          <label className="block text-sm mb-1">GST / Tax</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(Number(e.target.value))}
            className="border px-3 py-1 rounded w-full"
          />
        </div>

        {/* Discount */}
        <div>
          <label className="block text-sm mb-1">Discount</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="border px-3 py-1 rounded w-full"
          />
        </div>

        {/* Paid By */}
        <div>
          <label className="block text-sm mb-1">
            Who Paid Full Bill?
          </label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="border px-3 py-1 rounded w-full"
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
