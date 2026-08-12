import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandMark from "../components/BrandMark";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    login(form);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand"><div className="brand-mark"><BrandMark size={19} /></div><div><strong>ScamShield AI</strong><span>Signal Intelligence</span></div></div>
        <h1>Welcome back.</h1>
        <p>Sign in to review your protection activity and analyze suspicious signals.</p>
        <form onSubmit={onSubmit} autoComplete="off">
          <label>Email
            <input type="email" name="scamshield-login-email" autoComplete="off" placeholder="you@example.com" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Password
            <input type="password" name="scamshield-demo-password" autoComplete="new-password" placeholder="••••••••" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="primary-btn" type="submit">Continue</button>
        </form>
        <small>New to ScamShield? <Link to="/signup">Create an account</Link></small>
      </div>
    </div>
  );
}
