import { useState } from "react";
import API from "../../api";

function ApplyDoctor({ userId }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
    timings: ["", ""],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTiming = (index, value) => {
    const newTimings = [...form.timings];
    newTimings[index] = value;
    setForm({ ...form, timings: newTimings });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        userId,
      };

      const res = await API.post("/user/registerdoc", payload);

      if (res.data.success) {
        setMessage(
          "Application submitted successfully. Your request is under review."
        );

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          address: "",
          specialization: "",
          experience: "",
          fees: "",
          timings: ["", ""],
        });
      } else {
        setMessage(res.data.message || "Submission failed. Please try again.");
      }
    } catch {
      setMessage("An error occurred while submitting your application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "900px" }}>

        {/* HEADER (MATCHING APPOINTMENTS STYLE) */}
        <div
          className="page-header"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "20px 0",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <h1 className="page-title">Doctor Application</h1>
            <p className="page-subtitle">
              Submit your professional details for review
            </p>
          </div>
        </div>

        {/* MESSAGE */}
        {message && (
          <div
            className={`seraph-alert ${
              message.includes("successfully")
                ? "seraph-alert-success"
                : "seraph-alert-danger"
            }`}
            style={{ textAlign: "center" }}
          >
            {message}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* PERSONAL INFO */}
          <div className="form-section">
            <h3
              className="form-section-title"
              style={{ textAlign: "center" }}
            >
              Personal Information
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <input
                className="seraph-input"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                required
              />

              <input
                className="seraph-input"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                required
              />

              <input
                className="seraph-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />

              <input
                className="seraph-input"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />

              <div style={{ gridColumn: "1 / -1" }}>
                <input
                  className="seraph-input"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Complete Address"
                  required
                />
              </div>
            </div>
          </div>

          {/* PROFESSIONAL INFO */}
          <div className="form-section">
            <h3
              className="form-section-title"
              style={{ textAlign: "center" }}
            >
              Professional Information
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <input
                className="seraph-input"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Specialization"
                required
              />

              <input
                className="seraph-input"
                name="experience"
                type="number"
                min="0"
                value={form.experience}
                onChange={handleChange}
                placeholder="Years of Experience"
                required
              />

              <input
                className="seraph-input"
                name="fees"
                type="number"
                min="0"
                value={form.fees}
                onChange={handleChange}
                placeholder="Consultation Fee"
                required
              />

              <div />

              <input
                className="seraph-input"
                type="time"
                value={form.timings[0]}
                onChange={(e) => handleTiming(0, e.target.value)}
                required
              />

              <input
                className="seraph-input"
                type="time"
                value={form.timings[1]}
                onChange={(e) => handleTiming(1, e.target.value)}
                required
              />
            </div>
          </div>

          {/* BUTTON */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "25px",
            }}
          >
            <button
              className="btn-seraph btn-seraph-primary"
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 45px",
                fontSize: "1rem",
              }}
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ApplyDoctor;