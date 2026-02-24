import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillContext } from "../../context/BillContext";
import { AuthContext } from "../../context/AuthContext";
import { calculateContribution } from "../../utils/calculateContribution";
import { calculateSettlement } from "../../utils/calculateSettlement";
import AnimatedNumber from "../Common/AnimatedNumber";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { WhatsappShareButton, WhatsappIcon } from "react-share";
import axios from "axios";

export default function Result() {
  const { items, participants, tax, discount, payments } = useContext(BillContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [billTitle, setBillTitle] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const contributions = useMemo(() => {
    return calculateContribution(items, participants, tax, discount);
  }, [items, participants, tax, discount]);

  const settlements = useMemo(() => {
    return calculateSettlement(contributions, payments);
  }, [contributions, payments]);

  useEffect(() => {
    if (settlements.length > 0) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [settlements]);

  if (participants.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
          <p className="text-gray-600 mb-4">Please add participants and items first.</p>
          <button
            onClick={() => navigate("/edit")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            Go to Editor
          </button>
        </div>
      </div>
    );
  }

  const total = Object.values(contributions).reduce((sum, val) => sum + val, 0);

  const copyToClipboard = () => {
    let text = `💰 Bill Settlement Summary\n\n`;
    text += `Total: ₹${total.toFixed(2)}\n\n`;
    text += `Individual Shares:\n`;
    Object.entries(contributions).forEach(([person, amount]) => {
      text += `${person}: ₹${amount.toFixed(2)}\n`;
    });
    text += `\nSettlements:\n`;
    settlements.forEach(s => {
      text += `${s.from} → ${s.to}: ₹${s.amount}\n`;
    });
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const saveBill = async () => {
    if (!user) {
      alert("Please login to save bills");
      navigate("/login");
      return;
    }

    if (!billTitle.trim()) {
      alert("Please enter a bill title");
      return;
    }

    setSaving(true);
    try {
      await axios.post("http://localhost:8000/api/bills/save", {
        title: billTitle,
        participants,
        items,
        payments,
        tax,
        discount,
        total,
        settlements
      });
      setSaved(true);
      setShowSaveDialog(false);
      alert("Bill saved successfully!");
    } catch (error) {
      alert("Failed to save bill");
    } finally {
      setSaving(false);
    }
  };

  const shareText = `💰 Bill Settlement\n\nTotal: ₹${total.toFixed(2)}\n\n${settlements.map(s => `${s.from} → ${s.to}: ₹${s.amount}`).join("\n")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate("/edit")}
            className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
          >
            ← Back to Editor
          </button>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center">
            🎉 Settlement Summary
          </h2>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center"
          >
            <p className="text-lg opacity-90 mb-2">Total Bill Amount</p>
            <p className="text-5xl font-bold">₹{total.toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Individual Share</h3>
            <div className="space-y-3">
              {Object.entries(contributions).map(([person, amount]) => (
                <div
                  key={person}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
                >
                  <span className="font-semibold text-gray-700">{person}</span>
                  <span className="text-xl font-bold text-indigo-600">
                    <AnimatedNumber value={amount} />
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {payments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 Who Pays Whom</h3>

              {settlements.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-6xl mb-4">🎉</p>
                  <p className="text-xl font-semibold text-gray-700">All Settled!</p>
                  <p className="text-gray-500">Everyone has paid their fair share</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {settlements.map((settlement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {settlement.from[0]}
                        </div>
                        <span className="font-semibold text-gray-700">{settlement.from}</span>
                        <span className="text-2xl">→</span>
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                          {settlement.to[0]}
                        </div>
                        <span className="font-semibold text-gray-700">{settlement.to}</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        <AnimatedNumber value={settlement.amount} />
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mt-6"
        >
          <button
            onClick={() => setShowSaveDialog(true)}
            disabled={saved}
            className="px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saved ? "✓ Saved" : "💾 Save"}
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            📋 Copy
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4"
        >
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
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
                <button
                  onClick={saveBill}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                >
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
