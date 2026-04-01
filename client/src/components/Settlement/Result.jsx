import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillContext } from "../../context/BillContext";
import { AuthContext } from "../../context/AuthContext";
import { calculateContribution, calculateAllBillsContribution } from "../../utils/calculateContribution";
import { calculateSettlement } from "../../utils/calculateSettlement";
import AnimatedNumber from "../Common/AnimatedNumber";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

function SettlementList({ settlements, fmt }) {
  if (settlements.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-4xl mb-2">🎉</p>
        <p className="font-semibold text-gray-700">All Settled!</p>
        <p className="text-sm text-gray-500">Everyone paid their fair share</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {settlements.map((s, i) => (
        <div key={i} className="flex items-center justify-between gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{s.from[0]}</span>
            <span className="font-semibold text-gray-700 text-sm">{s.from}</span>
            <span className="text-gray-400">→</span>
            <span className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">{s.to[0]}</span>
            <span className="font-semibold text-gray-700 text-sm">{s.to}</span>
          </div>
          <span className="font-bold text-green-600 shrink-0">{fmt(s.amount)}</span>
        </div>
      ))}
    </div>
  );
}

export default function Result() {
  const { payments, bills, allParticipants, currency } = useContext(BillContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [combined, setCombined] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [billTitle, setBillTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const sym = currency?.symbol || "₹";
  const fmt = (val) => `${sym}${typeof val === "number" ? val.toFixed(2) : val}`;

  const perBillData = useMemo(() => {
    return bills
      .filter(b => b.participants.length >= 2 && b.items.length > 0)
      .map(b => {
        const contributions = calculateContribution(b.items, b.participants, b.tax, b.discount);
        const total = parseFloat(Object.values(contributions).reduce((s, v) => s + v, 0).toFixed(2));
        const paidByPayments = b.paidBy ? [{ person: b.paidBy, amount: total }] : [];
        const settlements = calculateSettlement(contributions, paidByPayments);
        return { bill: b, contributions, total, settlements };
      });
  }, [bills]);

  const combinedContributions = useMemo(() => calculateAllBillsContribution(bills), [bills]);

  const combinedAllPayments = useMemo(() => {
    const paidByPayments = bills
      .filter(b => b.paidBy)
      .map(b => {
        const contribs = calculateContribution(b.items, b.participants, b.tax, b.discount);
        const total = parseFloat(Object.values(contribs).reduce((s, v) => s + v, 0).toFixed(2));
        return { person: b.paidBy, amount: total };
      });
    return [...payments, ...paidByPayments];
  }, [bills, payments]);

  const combinedSettlements = useMemo(() =>
    calculateSettlement(combinedContributions, combinedAllPayments),
    [combinedContributions, combinedAllPayments]
  );

  const combinedTotal = parseFloat(Object.values(combinedContributions).reduce((s, v) => s + v, 0).toFixed(2));

  useEffect(() => {
    if (combined && combinedSettlements.length > 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [combined]);

  if (allParticipants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600 mb-4">Please add participants and items first.</p>
          <button onClick={() => navigate("/edit")} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
            Go to Editor
          </button>
        </div>
      </div>
    );
  }

  const buildShareText = () => {
    if (combined) {
      return `💰 Combined Bill Settlement\n\nTotal: ${fmt(combinedTotal)}\n\n${combinedSettlements.map(s => `${s.from} → ${s.to}: ${fmt(s.amount)}`).join("\n")}`;
    }
    return perBillData.map(({ bill, total, settlements }) =>
      `📋 ${bill.name} (${fmt(total)})\n${settlements.map(s => `${s.from} → ${s.to}: ${fmt(s.amount)}`).join("\n") || "All settled!"}`
    ).join("\n\n");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(buildShareText());
    alert("Copied to clipboard!");
  };

  const saveBill = async () => {
    if (!user) { alert("Please login to save bills"); navigate("/login"); return; }
    if (!billTitle.trim()) { alert("Please enter a bill title"); return; }
    setSaving(true);
    try {
      await axios.post(`${API_URL}/bills/save`, {
        title: billTitle,
        participants: allParticipants,
        items: bills.flatMap(b => b.items),
        payments,
        tax: 0,
        discount: 0,
        total: combinedTotal,
        settlements: combinedSettlements,
      });
      setSaved(true);
      setShowSaveDialog(false);
      alert("Bill saved successfully!");
    } catch {
      alert("Failed to save bill");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button onClick={() => navigate("/edit")} className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2">
            ← Back to Editor
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              🎉 Settlement Summary
            </h2>
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-2xl shadow p-1 gap-1 self-start sm:self-auto">
              <button
                onClick={() => setCombined(false)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${!combined ? "bg-indigo-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
              >
                Per Bill
              </button>
              <button
                onClick={() => setCombined(true)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${combined ? "bg-indigo-600 text-white shadow" : "text-gray-500 hover:text-gray-700"}`}
              >
                Combined
              </button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!combined ? (
            <motion.div key="per-bill" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
              {perBillData.length === 0 && (
                <div className="bg-white/80 rounded-2xl shadow-xl p-8 text-center text-gray-500">
                  No bills with at least 2 participants and items yet.
                </div>
              )}
              {perBillData.map(({ bill, contributions, total, settlements }, idx) => (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-white">{bill.name}</h3>
                      <p className="text-indigo-200 text-sm">{bill.participants.join(", ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-200 text-xs">Total</p>
                      <p className="text-white text-xl font-bold">{fmt(total)}</p>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">💰 Individual Share</p>
                      <div className="space-y-2">
                        {Object.entries(contributions).map(([person, amount]) => (
                          <div key={person} className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                            <span className="font-medium text-gray-700">{person}</span>
                            <span className="font-bold text-indigo-600">{fmt(amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {bill.paidBy && (
                      <div>
                        <p className="text-sm font-semibold text-gray-500 mb-2">🔄 Who Pays Whom</p>
                        <SettlementList settlements={settlements} fmt={fmt} />
                      </div>
                    )}

                    {!bill.paidBy && (
                      <p className="text-xs text-gray-400 italic">Set "Who Paid Full Bill?" in Bill Details to see settlements for this bill.</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Category chart in per-bill view */}
            </motion.div>
          ) : (
            <motion.div key="combined" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white text-center">
                <p className="text-lg opacity-90 mb-1">Combined Total</p>
                <p className="text-3xl sm:text-5xl font-bold">{fmt(combinedTotal)}</p>
                <p className="text-indigo-200 text-sm mt-2">{bills.length} bill{bills.length > 1 ? "s" : ""} · {allParticipants.length} people</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">💰 Individual Share (All Bills)</h3>
                <div className="space-y-2">
                  {Object.entries(combinedContributions).map(([person, amount]) => (
                    <div key={person} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="font-semibold text-gray-700">{person}</span>
                      <span className="text-lg font-bold text-indigo-600">{fmt(amount)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {(payments.length > 0 || bills.some(b => b.paidBy)) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">🔄 Who Pays Whom (Combined)</h3>
                  <SettlementList settlements={combinedSettlements} fmt={fmt} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <button onClick={() => setShowSaveDialog(true)} disabled={saved} className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {saved ? "✓ Saved" : "💾 Save"}
          </button>
          <button onClick={copyToClipboard} className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition">
            📋 Copy
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-3">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(buildShareText())}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition text-center"
          >
            📱 Share on WhatsApp
          </a>
        </motion.div>

        {showSaveDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Save Bill</h3>
              <input
                type="text"
                placeholder="Enter bill title"
                value={billTitle}
                onChange={(e) => setBillTitle(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl mb-4"
              />
              <div className="flex gap-3">
                <button onClick={saveBill} disabled={saving} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setShowSaveDialog(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
