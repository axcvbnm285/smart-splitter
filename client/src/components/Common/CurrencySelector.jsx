import { useContext } from "react";
import { BillContext, CURRENCIES } from "../../context/BillContext";

export default function CurrencySelector() {
  const { currency, setCurrency } = useContext(BillContext);
  return (
    <select
      value={currency.code}
      onChange={(e) => setCurrency(CURRENCIES.find(c => c.code === e.target.value))}
      className="px-3 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold focus:border-indigo-500 focus:outline-none transition bg-white"
    >
      {CURRENCIES.map(c => (
        <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
      ))}
    </select>
  );
}
