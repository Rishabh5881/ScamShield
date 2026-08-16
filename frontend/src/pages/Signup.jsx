import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandMark from "../components/BrandMark";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Complete all fields to create your account.");
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
    signup(form);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand"><div className="brand-mark"><BrandMark size={19} /></div><div><strong>ScamShield AI</strong><span>Signal Intelligence</span></div></div>
        <h1>Build safer habits.</h1>
        <p>Create a Phase 1 demo account. No real backend or credentials are stored by this frontend.</p>
        <form onSubmit={onSubmit} autoComplete="off">
          <label>Name
            <input name="scamshield-name" autoComplete="off" placeholder="Your name" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>Email
            <input type="email" name="scamshield-signup-email" autoComplete="off" placeholder="you@example.com" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Password
            <input type="password" name="scamshield-demo-new-password" autoComplete="new-password" placeholder="Create a password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="primary-btn" type="submit">Create account</button>
        </form>
        <small>Already have an account? <Link to="/login">Sign in</Link></small>
      </div>
    </div>
  );
}
