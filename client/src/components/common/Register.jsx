import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    type: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`.trim(),
      };
      const res = await API.post("/user/register", payload);
      if (res.data.success) {
        navigate("/login");
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Registration failed. Please try again.");
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
        <h2 className="auth-title">Create Your Account</h2>

        {error && <div className="seraph-alert seraph-alert-danger">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <div>
              <label className="seraph-label">First Name</label>
              <input
                className="seraph-input"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="seraph-label">Last Name</label>
              <input
                className="seraph-input"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                placeholder="Dela Cruz"
              />
            </div>
          </div>
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
          <div>
            <label className="seraph-label">Phone Number</label>
            <input
              className="seraph-input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="09123456789"
            />
          </div>
          <div>
            <label className="seraph-label">Account Type</label>
            <div className="role-selector" style={{ marginTop: "8px" }}>
              {["user", "admin"].map((role) => (
                <label key={role} className="role-option">
                  <input
                    type="radio"
                    name="type"
                    value={role}
                    checked={form.type === role}
                    onChange={handleChange}
                  />
                  {role === "user" ? "Patient" : "Administrator"}
                </label>
              ))}
            </div>
          </div>
          <button
            className="btn-seraph btn-seraph-primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
