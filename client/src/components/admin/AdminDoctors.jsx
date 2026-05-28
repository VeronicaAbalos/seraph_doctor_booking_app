import { useEffect, useState } from "react";
import API from "../../api";

function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState({ msg: "", ok: true });

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/admin/getalldoctors");
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast({ msg: "", ok: true }), 3000);
  };

  const handleApprove = async (doctorId, userId) => {
    setActionLoading(doctorId + "approve");

    try {
      const res = await API.post("/admin/getapprove", {
        doctorId,
        status: "approved",
        userid: userId,
      });

      if (res.data.success) {
        showToast("Doctor application approved successfully.");
        fetchDoctors();
      } else {
        showToast(res.data.message || "Approval failed.", false);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Action failed. Please try again.",
        false
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (doctorId, userId) => {
    setActionLoading(doctorId + "reject");

    try {
      const res = await API.post("/admin/getreject", {
        doctorId,
        status: "rejected",
        userid: userId,
      });

      if (res.data.success) {
        showToast("Doctor application declined.");
        fetchDoctors();
      } else {
        showToast(res.data.message || "Rejection failed.", false);
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "Action failed. Please try again.",
        false
      );
    } finally {
      setActionLoading("");
    }
  };

  const filtered = doctors.filter((d) => {
    const matchesSearch =
      d.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      d.email?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || d.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "16px" }}>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div>

      {/* CENTERED HEADER */}
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
          <h1 className="page-title">Doctor Management</h1>

          <p className="page-subtitle">
            Review and manage doctor applications
          </p>
        </div>
      </div>

      {/* TOAST */}
      {toast.msg && (
        <div className="toast-container">
          <div
            className={`seraph-alert ${
              toast.ok
                ? "seraph-alert-success"
                : "seraph-alert-danger"
            }`}
          >
            {toast.msg}
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="filter-bar">

        <input
          className="seraph-input"
          placeholder="Search by name, email, or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="seraph-select"
          style={{ maxWidth: "180px" }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <span className="filter-count">
          {filtered.length} doctor
          {filtered.length !== 1 ? "s" : ""}
        </span>

      </div>

      {/* EMPTY */}
      {filtered.length === 0 ? (
        <div className="empty-state">

          <h3 className="empty-state-title">
            No doctor applications found
          </h3>

          <p className="empty-state-text">
            Try adjusting your search or filter settings.
          </p>

        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>

          <table className="seraph-table">

            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fee (₱)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((doc) => {
                const isBusy = actionLoading.startsWith(doc._id);

                return (
                  <tr key={doc._id}>

                    <td
                      style={{
                        fontWeight: 600,
                        color: "#f0e6ff",
                      }}
                    >
                      Dr. {doc.fullName}
                    </td>

                    <td style={{ fontSize: "0.88rem" }}>
                      {doc.email}
                    </td>

                    <td style={{ fontSize: "0.88rem" }}>
                      {doc.phone}
                    </td>

                    <td style={{ color: "#d7b8ff" }}>
                      {doc.specialization}
                    </td>

                    <td>{doc.experience} yrs</td>

                    <td>₱{doc.fees}</td>

                    <td>
                      <span
                        className={`status-badge status-${doc.status}`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                        }}
                      >

                        {doc.status !== "approved" && (
                          <button
                            disabled={isBusy}
                            onClick={() =>
                              handleApprove(doc._id, doc.userId)
                            }
                            style={{
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(170, 130, 255, 0.25)",
                              background:
                                "rgba(157, 78, 221, 0.16)",
                              color: "#f0e6ff",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              transition: "0.2s ease",
                            }}
                          >
                            {actionLoading ===
                            doc._id + "approve"
                              ? "Processing..."
                              : "Approve"}
                          </button>
                        )}

                        {doc.status !== "rejected" && (
                          <button
                            disabled={isBusy}
                            onClick={() =>
                              handleReject(doc._id, doc.userId)
                            }
                            style={{
                              padding: "8px 14px",
                              borderRadius: "8px",
                              border:
                                "1px solid rgba(255, 120, 180, 0.18)",
                              background:
                                "rgba(255, 120, 180, 0.08)",
                              color: "#f0e6ff",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              transition: "0.2s ease",
                            }}
                          >
                            {actionLoading ===
                            doc._id + "reject"
                              ? "Processing..."
                              : "Decline"}
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>
      )}
    </div>
  );
}

export default AdminDoctors;