import { useNavigate } from "react-router-dom";
import { useContext, useState, useRef } from "react";
import axios from "../../api/axios";
import { BillContext } from "../../context/BillContext";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadBill() {
  const navigate = useNavigate();
  const { setItems, setTax, setDiscount } = useContext(BillContext);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image file"); return; }
    setError("");
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("bill", file);

    try {
      setLoading(true);
      const res = await axios.post("/bill/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let structured;
      try {
        structured = typeof res.data.structuredData === "string"
          ? JSON.parse(res.data.structuredData)
          : res.data.structuredData;
      } catch {
        setError("AI parsing failed. Try a clearer image.");
        setLoading(false);
        return;
      }

      if (structured.items?.length > 0) {
        setItems(structured.items.map((item, i) => ({
          id: Date.now() + i,
          name: item.name,
          price: Number(item.total || item.price || 0),
          quantity: Number(item.quantity || 1),
          assignedTo: [],
        })));
      }

      setTax(Number(structured.cgst || 0) + Number(structured.sgst || 0));
      setDiscount(Number(structured.discount || 0));
      navigate("/preview", { state: { structured } });
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Drop zone */}
      <motion.div
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        animate={{ scale: dragOver ? 1.02 : 1, borderColor: dragOver ? "#6366f1" : "#e5e7eb" }}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
          dragOver ? "bg-indigo-50 border-indigo-400" : "bg-gray-50 hover:bg-indigo-50 hover:border-indigo-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => processFile(e.target.files[0])}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-indigo-700 text-lg">AI is reading your bill...</p>
                <p className="text-sm text-gray-500 mt-1">This usually takes 5-10 seconds</p>
              </div>
              <div className="flex gap-1 mt-2">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-2 h-2 bg-indigo-400 rounded-full"
                    animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </motion.div>
          ) : preview ? (
            <motion.div key="preview" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
              <img src={preview} alt="Bill preview" className="max-h-48 rounded-xl shadow-md object-contain" />
              <p className="text-sm text-gray-500">Click to change image</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                📸
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg">Drop your bill here</p>
                <p className="text-gray-500 text-sm mt-1">or click to browse from your device</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="px-2 py-1 bg-gray-200 rounded-full">JPG</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full">PNG</span>
                <span className="px-2 py-1 bg-gray-200 rounded-full">WEBP</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* How it works */}
      {!preview && !loading && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3">
          {[
            { icon: "📷", step: "1", label: "Take a photo of your bill" },
            { icon: "🤖", step: "2", label: "AI extracts all items" },
            { icon: "✅", step: "3", label: "Review and confirm" },
          ].map(({ icon, step, label }) => (
            <div key={step} className="bg-white/60 rounded-xl p-3 text-center shadow-sm">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs font-bold text-indigo-600 mb-1">Step {step}</div>
              <div className="text-xs text-gray-600">{label}</div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
