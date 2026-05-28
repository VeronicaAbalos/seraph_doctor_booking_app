import { useEffect, useState } from "react";
import API from "../../api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/admin/getallusers");
        if (res.data.success) setUsers(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "doctor" && u.isdoctor) ||
      (filterRole === "admin" && u.type === "admin") ||
      (filterRole === "user" && !u.isdoctor && u.type !== "admin");

    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "16px" }}>Loading users...</p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Accounts",
      value: users.length,
      color: "#9d4edd",
    },
    {
      label: "Patients",
      value: users.filter(
        (u) => !u.isdoctor && u.type !== "admin"
      ).length,
      color: "#60a5fa",
    },
    {
      label: "Doctors",
      value: users.filter((u) => u.isdoctor).length,
      color: "#4ade80",
    },
    {
      label: "Administrators",
      value: users.filter((u) => u.type === "admin").length,
      color: "#e056a0",
    },
  ];

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
          <h1 className="page-title">Account Directory</h1>
          <p className="page-subtitle">
            Monitor and organize registered platform members
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {stats.map((card) => (
          <div className="stat-card" key={card.label}>
            <div
              className="stat-value"
              style={{ color: card.color }}
            >
              {card.value}
            </div>

            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="seraph-input"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="seraph-select"
          style={{ maxWidth: "180px" }}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="user">Patients</option>
          <option value="doctor">Doctors</option>
          <option value="admin">Admins</option>
        </select>

        <span className="filter-count">
          {filtered.length} user
          {filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">
            No users found
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Doctor Status</th>
                <th>Joined</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td
                    style={{
                      fontWeight: 600,
                      color: "#f0e6ff",
                    }}
                  >
                    {u.fullName}
                  </td>

                  <td style={{ fontSize: "0.88rem" }}>
                    {u.email}
                  </td>

                  <td style={{ fontSize: "0.88rem" }}>
                    {u.phone}
                  </td>

                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background:
                          u.type === "admin"
                            ? "rgba(224, 86, 160, 0.15)"
                            : "rgba(96, 165, 250, 0.15)",

                        color:
                          u.type === "admin"
                            ? "#e056a0"
                            : "#60a5fa",

                        border: `1px solid ${
                          u.type === "admin"
                            ? "rgba(224, 86, 160, 0.3)"
                            : "rgba(96, 165, 250, 0.3)"
                        }`,
                      }}
                    >
                      {u.type}
                    </span>
                  </td>

                  <td>
                    {u.isdoctor ? (
                      <span className="status-badge status-approved">
                        Doctor
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "#7a6b8a",
                          fontSize: "0.85rem",
                        }}
                      >
                        —
                      </span>
                    )}
                  </td>

                  <td
                    style={{
                      fontSize: "0.85rem",
                      color: "#7a6b8a",
                    }}
                  >
                    {u.createdAt
                      ? new Date(
                          u.createdAt
                        ).toLocaleDateString()
                      : "—"}
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

export default AdminUsers;