import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    // If signup succeeds, check if user was created or confirmation sent
    // For demo purposes, navigate to login with a success message
    navigate("/login");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-5 h-5 rounded-full bg-[#00FF88] shadow-[0_0_12px_#00FF88] animate-pulse-glow" />
            <h1 className="text-3xl font-bold tracking-wider text-white">
              KLARIXA
            </h1>
          </div>
          <p className="text-[#8888AA] text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#8888AA] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#14141A] border border-[#1E1E2A] text-[#E0E0E0] placeholder:text-[#555577] focus:outline-none focus:border-[#0088FF] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-[#8888AA] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg bg-[#14141A] border border-[#1E1E2A] text-[#E0E0E0] placeholder:text-[#555577] focus:outline-none focus:border-[#0088FF] transition-colors"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#00FF88] text-[#0A0A0F] font-semibold hover:brightness-110 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#555577] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0088FF] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}