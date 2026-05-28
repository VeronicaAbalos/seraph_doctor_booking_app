import { useState, useEffect } from "react";
import API from "../../api";

function Notification() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("unread");
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const res = await API.post("/user/getuserdata", {});

      if (res.data.success) {
        const updatedUser = res.data.data;

        localStorage.setItem(
          "userData",
          JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("userData");

    if (stored) {
      setUser(JSON.parse(stored));
    }

    fetchUserData();
  }, []);

  const markAllRead = async () => {
    try {
      const res = await API.post(
        "/user/getallnotification",
        {}
      );

      if (res.data.success) {
        await fetchUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAll = async () => {
    try {
      const res = await API.post(
        "/user/deleteallnotification",
        {}
      );

      if (res.data.success) {
        await fetchUserData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>

        <p style={{ marginTop: "16px" }}>
          Loading notifications...
        </p>
      </div>
    );
  }

  const unread = user.notification || [];
  const read = user.seennotification || [];

  return (
    <div>

      {/* HEADER */}
      <div className="page-header">
        <div
          style={{
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1 className="page-title">
            Notifications
          </h1>

          <p className="page-subtitle">
            Stay updated with your appointments
          </p>
        </div>

        <button
          className="btn-seraph btn-seraph-outline btn-seraph-sm"
          onClick={fetchUserData}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
        }}
      >
        <button
          className={`btn-seraph btn-seraph-sm ${
            activeTab === "unread"
              ? "btn-seraph-primary"
              : "btn-seraph-outline"
          }`}
          onClick={() => setActiveTab("unread")}
        >
          Unread ({unread.length})
        </button>

        <button
          className={`btn-seraph btn-seraph-sm ${
            activeTab === "read"
              ? "btn-seraph-primary"
              : "btn-seraph-outline"
          }`}
          onClick={() => setActiveTab("read")}
        >
          Read ({read.length})
        </button>
      </div>

      {/* UNREAD TAB */}
      {activeTab === "unread" && (
        <>
          {unread.length > 0 ? (
            <>
              <button
                className="btn-seraph btn-seraph-outline btn-seraph-sm"
                onClick={markAllRead}
                style={{ marginBottom: "20px" }}
              >
                Mark all as read
              </button>

              {unread.map((n, i) => (
                <div
                  key={i}
                  className="seraph-card"
                  style={{
                    borderLeft: "4px solid #9d4edd",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#f0e6ff",
                    }}
                  >
                    {n.message}
                  </p>

                  <small
                    style={{
                      color: "#7a6b8a",
                    }}
                  >
                    {n.type} •{" "}
                    {n.createdAt
                      ? new Date(
                          n.createdAt
                        ).toLocaleString()
                      : "Just now"}
                  </small>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-state">
              <h3 className="empty-state-title">
                No new notifications
              </h3>

              <p className="empty-state-text">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          )}
        </>
      )}

      {/* READ TAB */}
      {activeTab === "read" && (
        <>
          {read.length > 0 ? (
            <>
              <button
                className="btn-seraph btn-seraph-danger btn-seraph-sm"
                onClick={deleteAll}
                style={{ marginBottom: "20px" }}
              >
                Delete all
              </button>

              {read.map((n, i) => (
                <div
                  key={i}
                  className="seraph-card"
                  style={{
                    opacity: 0.6,
                    borderLeft: "4px solid #4a3660",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: "#b8a5cc",
                    }}
                  >
                    {n.message}
                  </p>

                  <small
                    style={{
                      color: "#7a6b8a",
                    }}
                  >
                    Read •{" "}
                    {n.createdAt
                      ? new Date(
                          n.createdAt
                        ).toLocaleString()
                      : ""}
                  </small>
                </div>
              ))}
            </>
          ) : (
            <div className="empty-state">
              <h3 className="empty-state-title">
                No read notifications
              </h3>

              <p className="empty-state-text">
                Notifications you've read will appear here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Notification;