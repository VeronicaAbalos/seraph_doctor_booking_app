import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import API from "../../api";

function DoctorList({ doctor, userdata, userDoctorId, onBooked }) {
  const [show, setShow] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const minDate = new Date().toISOString().slice(0, 16);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!dateTime) return setMessage("Please select a schedule.");

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();

      if (documentFile) formData.append("image", documentFile);

      formData.append("date", dateTime.replace("T", " "));
      formData.append("userId", userDoctorId);
      formData.append("doctorId", doctor._id);
      formData.append("userInfo", JSON.stringify(userdata));
      formData.append("doctorInfo", JSON.stringify(doctor));

      const res = await API.post("/user/getappointment", formData);

      if (res.data.success) {
        setMessage("Appointment successfully submitted.");
        if (onBooked) onBooked();
        setTimeout(() => setShow(false), 1500);
      } else {
        setMessage(res.data.message);
      }
    } catch {
      setMessage("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const iconStyle = {
    color: "#ffffff",
    fontSize: "0.95rem",
    width: "18px",
    display: "inline-block",
  };

  return (
    <>
      {/* =======================
          CENTERED HEADER
      ======================= */}
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
          <h1 className="page-title">Find Your Doctor</h1>
          <p className="page-subtitle">
            Browse our network of verified healthcare professionals
          </p>
        </div>
      </div>

      {/* =======================
          DOCTOR CARD
      ======================= */}
      <div className="doctor-card">
        <div className="doctor-info" style={{ flex: 1 }}>
          <h5 style={{ marginBottom: "6px" }}>
            Dr. {doctor.fullName}
          </h5>

          <p style={{ marginBottom: "10px", opacity: 0.8 }}>
            {doctor.specialization}
          </p>

          {/* DETAILS */}
          <div
            className="doctor-details"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              fontSize: "0.9rem",
              opacity: 0.85,
            }}
          >
            <span>
              <span style={iconStyle}>☎</span> {doctor.phone}
            </span>

            <span>
              <span style={iconStyle}>✉</span> {doctor.address}
            </span>

            <span>
              <span style={iconStyle}>⚙</span>{" "}
              {doctor.experience} yrs experience
            </span>

            <span>
              <span style={iconStyle}>₱</span> {doctor.fees}
            </span>

            <span style={{ gridColumn: "span 2" }}>
              <span style={iconStyle}>⏱</span>{" "}
              {doctor.timings?.[0]} – {doctor.timings?.[1]}
            </span>
          </div>
        </div>

        {/* BUTTON */}
        <button
          className="btn-seraph btn-seraph-primary"
          onClick={() => setShow(true)}
        >
          Book Now
        </button>
      </div>

      {/* =======================
          MODAL
      ======================= */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p style={{ fontWeight: 600, marginBottom: "4px" }}>
            Dr. {doctor.fullName}
          </p>

          <p style={{ fontSize: "0.85rem", opacity: 0.7, marginBottom: "16px" }}>
            {doctor.specialization} • ₱{doctor.fees}
          </p>

          {message && (
            <div
              style={{
                marginBottom: "12px",
                padding: "10px",
                borderRadius: "8px",
                background: "rgba(0,0,0,0.05)",
                border: "1px solid rgba(0,0,0,0.1)",
                fontSize: "0.9rem",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleBook}>
            {/* DATE */}
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>
                Select Schedule
              </label>

              <input
                type="datetime-local"
                value={dateTime}
                min={minDate}
                onChange={(e) => setDateTime(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>

            {/* FILE */}
            <div style={{ marginBottom: "18px" }}>
              <label style={{ display: "block", marginBottom: "6px" }}>
                Upload File (optional)
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setDocumentFile(e.target.files[0])}
                style={{ width: "100%" }}
              />
            </div>

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button variant="secondary" onClick={() => setShow(false)}>
                Cancel
              </Button>

              <button
                className="btn-seraph btn-seraph-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DoctorList;