import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/user/login", form);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.userData));
        const userType = res.data.userData.type;
        if (userType === "admin") {
          navigate("/adminhome");
        } else if (res.data.userData.isdoctor) {
          navigate("/doctorhome");
        } else {
          navigate("/userhome");
        }
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-text">SERAPH</div>
          <div className="auth-tagline">Your Health, One Tap Away</div>
        </div>
        <h2 className="auth-title">Welcome Back</h2>

        {error && <div className="seraph-alert seraph-alert-danger">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <label className="seraph-label">Email Address</label>
            <input
              className="seraph-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="seraph-label">Password</label>
            <input
              className="seraph-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          <button
            className="btn-seraph btn-seraph-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
