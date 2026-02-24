import { useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BillContext } from "../../context/BillContext";
import { calculateContribution } from "../../utils/calculateContribution";
import { calculateSettlement } from "../../utils/calculateSettlement";
import AnimatedNumber from "../Common/AnimatedNumber";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

export default function Result() {
  const { items, participants, tax, discount, payments } = useContext(BillContext);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
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

        {/* Total Amount Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-6 text-white text-center"
        >
          <p className="text-lg opacity-90 mb-2">Total Bill Amount</p>
          <p className="text-5xl font-bold">₹{total.toFixed(2)}</p>
        </motion.div>

        {/* Individual Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6"
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

        {/* Settlement Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔄 Settlement Plan</h3>

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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 mt-6"
        >
          <button
            onClick={() => navigate("/edit")}
            className="flex-1 px-6 py-3 bg-white/80 backdrop-blur-sm text-indigo-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-indigo-200"
          >
            Edit Bill
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            New Bill
          </button>
        </motion.div>
      </div>
    </div>
  );
}
