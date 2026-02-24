import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PageWrapper from "../components/Common/PageWrapper";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600">Login</Link>
        </p>
      </div>
    </PageWrapper>
  );
}
