import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

function DoctorHome() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "",
  });

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await API.get("/doctor/getdoctorappointments");

      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  const handleStatus = async (appointmentId, status) => {
    setActionLoading(appointmentId);

    try {
      const res = await API.post("/doctor/handlestatus", {
        appointmentId,
        status,
      });

      if (res.data.success) {
        await fetchAppointments();

        if (status === "approved") {
          showToast("Appointment approved successfully.");
        } else if (status === "rejected") {
          showToast("Appointment declined successfully.");
        } else if (status === "completed") {
          showToast("Appointment marked as completed.");
        }
      } else {
        showToast(res.data.message || "Action failed", "error");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Something went wrong.", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "D";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const navButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.10)",
    color: "#f0e6ff",
    cursor: "pointer",
    fontSize: "0.92rem",
    transition: "0.2s ease",
    backdropFilter: "blur(10px)",
    marginTop: "18px"   // ✅ FIXED (your request)
  };

  return (
    <div>
      {/* NAVIGATION */}
      <nav className="top-navbar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="nav-logo">SERAPH</span>
          <span className="nav-tagline">Doctor Portal</span>
        </div>

        <ul className="nav-menu">
          <li>
            <button style={navButtonStyle}>
              <span style={{ color: "#fff" }}>≣</span>
              Consultations ({appointments.length})
            </button>
          </li>
        </ul>

        <div className="nav-user-info">
          <div className="nav-user-avatar">
            {getInitials(userData.fullName)}
          </div>

          <div className="nav-user-details">
            <span className="nav-user-name">
              Dr. {userData.fullName}
            </span>
            <span className="nav-user-role">Doctor</span>
          </div>

          <button
            className="btn-seraph logout-btn btn-seraph-sm"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* TOAST */}
      {toast.show && (
        <div className="toast-container">
          <div
            className={`seraph-alert ${
              toast.type === "success"
                ? "seraph-alert-success"
                : "seraph-alert-danger"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="main-dashboard">

        {/* HEADER */}
        <div
          className="page-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* CENTER TITLE ONLY */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <h1 className="page-title">My Appointments</h1>
            <p className="page-subtitle">
              Manage your patient consultations
            </p>
          </div>

          {/* REFRESH */}
          <button
            className="btn-seraph btn-seraph-outline btn-seraph-sm"
            onClick={fetchAppointments}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p style={{ marginTop: "16px" }}>
              Loading appointments...
            </p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-state-title">
              No appointments available
            </h3>
            <p className="empty-state-text">
              Patient bookings will appear here once scheduled.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="seraph-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((apt) => {
                  const isLoading = actionLoading === apt._id;

                  return (
                    <tr
                      key={apt._id}
                      style={{ opacity: isLoading ? 0.6 : 1 }}
                    >
                      <td>
                        <div style={{ fontWeight: 600, color: "#f0e6ff" }}>
                          {apt.userInfo?.fullName || "Patient"}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#7a6b8a" }}>
                          {apt.userInfo?.phone || ""}
                        </div>
                      </td>

                      <td>{apt.date}</td>

                      <td>
                        <span className={`status-badge status-${apt.status}`}>
                          {apt.status}
                        </span>
                      </td>

                      <td>
                        {apt.status === "pending" && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              disabled={isLoading}
                              onClick={() =>
                                handleStatus(apt._id, "approved")
                              }
                              style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                border:
                                  "1px solid rgba(170, 130, 255, 0.25)",
                                background:
                                  "rgba(157, 78, 221, 0.16)",
                                color: "#f0e6ff",
                              }}
                            >
                              {isLoading ? "Processing..." : "Approve"}
                            </button>

                            <button
                              disabled={isLoading}
                              onClick={() =>
                                handleStatus(apt._id, "rejected")
                              }
                              style={{
                                padding: "8px 14px",
                                borderRadius: "8px",
                                border:
                                  "1px solid rgba(255, 120, 180, 0.18)",
                                background:
                                  "rgba(255, 120, 180, 0.08)",
                                color: "#f0e6ff",
                              }}
                            >
                              {isLoading ? "Processing..." : "Decline"}
                            </button>
                          </div>
                        )}

                        {apt.status === "approved" && (
                          <button
                            disabled={isLoading}
                            onClick={() =>
                              handleStatus(apt._id, "completed")
                            }
                            style={{
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(255,255,255,0.15)",
                              background:
                                "rgba(255,255,255,0.08)",
                              color: "#f0e6ff",
                            }}
                          >
                            {isLoading ? "Processing..." : "Complete"}
                          </button>
                        )}

                        {apt.status === "completed" && (
                          <span style={{ color: "#d0d0d0" }}>
                            Completed
                          </span>
                        )}

                        {apt.status === "rejected" && (
                          <span style={{ color: "#b0b0b0" }}>
                            Declined
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default DoctorHome;