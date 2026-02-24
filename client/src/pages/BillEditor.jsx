import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import PageWrapper from "../components/Common/PageWrapper";
import AddParticipants from "../components/Bill/AddParticipants";
import AddPayments from "../components/Bill/AddPayments";
import AddItem from "../components/Bill/AddItem";
import BillTable from "../components/Bill/BillTable";
import BillExtras from "../components/Bill/BillExtras";

export default function BillEditor() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div>
            <button
              onClick={() => navigate("/")}
              className="text-indigo-600 hover:text-indigo-700 mb-2 flex items-center gap-2"
            >
              ← Back to Home
            </button>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Bill
            </h2>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
          >
            📸 Scan Bill
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Input Forms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <AddParticipants />
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <AddPayments />
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <AddItem />
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
            <BillExtras />
          </div>
        </motion.div>

        {/* Right Column - Bill Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 sticky top-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Bill Items</h3>
            <BillTable />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
