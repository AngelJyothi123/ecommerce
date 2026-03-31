import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import Input from "../components/Input";
import Button from "../components/Button";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      addToast("Login successful!", "success");
      navigate("/");
    } catch (error) {
      addToast(error.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl mix-blend-screen" />
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-6 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </Link>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2 font-light">Sign in to your premium account</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-black/60 backdrop-blur-3xl">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@luxury.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button type="submit" loading={loading} className="w-full mt-6 py-3.5 text-lg">
            Access Account
          </Button>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-fuchsia-400 hover:text-fuchsia-300 font-semibold tracking-wide transition-colors">
                Apply Now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
