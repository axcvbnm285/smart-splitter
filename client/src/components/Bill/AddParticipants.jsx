import { useContext, useState } from "react";
import { BillContext } from "../../context/BillContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AddParticipants() {
  const { participants, setParticipants } = useContext(BillContext);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const addParticipant = () => {
    setError("");
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (participants.length >= 20) {
      setError("Maximum 20 participants allowed");
      return;
    }

    if (participants.some(p => p.toLowerCase() === name.trim().toLowerCase())) {
      setError("Participant already added");
      return;
    }

    setParticipants([...participants, name.trim()]);
    setName("");
  };

  const removeParticipant = (person) => {
    setParticipants(participants.filter((p) => p !== person));
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        👥 Participants
      </h3>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={name}
          maxLength={30}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
          placeholder="Enter name"
          className="w-full flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition"
        />
        <button
          onClick={addParticipant}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <AnimatePresence>
          {participants.map((person) => (
            <motion.div
              key={person}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
            >
              <span className="font-medium">{person}</span>
              <button
                onClick={() => removeParticipant(person)}
                className="hover:bg-white/20 rounded-full w-5 h-5 flex items-center justify-center transition"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
