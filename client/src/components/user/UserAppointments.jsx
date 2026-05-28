import { useEffect, useState } from "react";
import API from "../../api";

function UserAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/user/getuserappointments");
        if (res.data.success) setAppointments(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: "16px" }}>Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
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
    <h1 className="page-title">Appointments</h1>
    <p className="page-subtitle">
      View and manage your consultation schedule
    </p>
  </div>
</div>

      {/* EMPTY STATE */}
      {appointments.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No Appointments Found</h3>
          <p className="empty-state-text">
            You have not booked any consultations yet. Your scheduled appointments will appear here.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table className="seraph-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Attachment</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <tr key={appt._id}>
                  <td style={{ fontWeight: 600, color: "#f0e6ff" }}>
                    Dr. {appt.docName || appt.doctorInfo?.fullName || "—"}
                  </td>

                  <td>{appt.date}</td>

                  <td>
                    {appt.document ? (
                      <span style={{ color: "#9d4edd", fontSize: "0.85rem" }}>
                        {appt.document.originalname || "File attached"}
                      </span>
                    ) : (
                      <span style={{ color: "#7a6b8a" }}>No file</span>
                    )}
                  </td>

                  <td>
                    <span className={`status-badge status-${appt.status}`}>
                      {appt.status}
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

export default UserAppointments;