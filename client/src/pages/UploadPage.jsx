import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import UploadBill from "../components/Upload/UploadBill";

export default function UploadPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <button onClick={() => navigate("/")} className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2 font-medium">
            ← Back
          </button>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
              🤖
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Bill Scanner
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Photograph any restaurant bill and we'll extract all items automatically
            </p>
          </div>
        </motion.div>

        {/* Upload area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <UploadBill />
        </motion.div>

        {/* Tips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 bg-white/60 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700 mb-3">📌 Tips for best results</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold shrink-0">✓</span> Make sure the bill is flat and well-lit</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold shrink-0">✓</span> Capture the full bill including totals</li>
            <li className="flex items-start gap-2"><span className="text-green-500 font-bold shrink-0">✓</span> Avoid shadows or blurry images</li>
            <li className="flex items-start gap-2"><span className="text-yellow-500 font-bold shrink-0">⚠</span> Always review extracted items before confirming</li>
          </ul>
        </motion.div>

      </div>
    </div>
  );
}
