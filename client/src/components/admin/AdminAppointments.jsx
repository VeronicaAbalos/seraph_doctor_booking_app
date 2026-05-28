import { useEffect, useState } from "react";
import API from "../../api";

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/admin/getallAppointmentsAdmin");
        if (res.data.success) setAppointments(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.userInfo?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorInfo?.fullName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || a.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "16px" }}>Loading appointments...</p>
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
          <h1 className="page-title">Appointment Records</h1>

          <p className="page-subtitle">
            Review and oversee scheduled consultations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="seraph-input"
          placeholder="Search by patient or doctor name..."
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
          {filtered.length} record
          {filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">
            No appointments found
          </h3>

          <p className="empty-state-text">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="seraph-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Document</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((a) => (
                <tr key={a._id}>

                  <td
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      color: "#7a6b8a",
                    }}
                  >
                    {a._id}
                  </td>

                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#f0e6ff",
                      }}
                    >
                      {a.userInfo?.fullName || "—"}
                    </div>

                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#7a6b8a",
                      }}
                    >
                      {a.userInfo?.phone || ""}
                    </div>
                  </td>

                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#f0e6ff",
                      }}
                    >
                      Dr. {a.doctorInfo?.fullName || "—"}
                    </div>

                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "#d7b8ff",
                      }}
                    >
                      {a.doctorInfo?.specialization || ""}
                    </div>
                  </td>

                  <td style={{ whiteSpace: "nowrap" }}>
                    {a.date}
                  </td>

                  <td>
                    {a.document ? (
                      <span
                        style={{
                          color: "#b89cff",
                          fontSize: "0.85rem",
                        }}
                      >
                        File Attached
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#7a6b8a",
                          fontSize: "0.85rem",
                        }}
                      >
                        None
                      </span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`status-badge status-${a.status}`}
                    >
                      {a.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}

export default AdminAppointments;