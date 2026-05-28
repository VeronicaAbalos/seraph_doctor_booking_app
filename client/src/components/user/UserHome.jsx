import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import DoctorList from "./DoctorList";
import ApplyDoctor from "./ApplyDoctor";
import UserAppointments from "./UserAppointments";
import Notification from "../common/Notification";

function UserHome() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [userdata, setUserdata] = useState(null);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const init = async () => {
      try {
        const res = await API.post("/user/getuserdata", {});
        if (res.data.success) {
          const fresh = res.data.data;
          localStorage.setItem("userData", JSON.stringify(fresh));

          if (fresh.isdoctor) {
            navigate("/doctorhome");
            return;
          }

          setUserdata(fresh);
        }
      } catch {
        const stored = localStorage.getItem("userData");
        if (stored) setUserdata(JSON.parse(stored));
      }

      fetchDoctors();
    };

    init();
  }, [navigate]);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/user/getalldoctorsu");
      if (res.data.success) setDoctors(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const unreadCount = userdata?.notification?.length || 0;

  /* =========================
     PLAIN WHITE ICONS ONLY
     (NO EMOJIS, NO COLORS)
     ========================= */
  const navItems = [
    { key: "home", label: "Find Doctors", icon: "⌕", },
    { key: "appointments", label: "My Appointments", icon: "≣" },
    ...(!userdata?.isdoctor
      ? [{ key: "applyDoctor", label: "Apply as Doctor", icon: "+" }]
      : []),
    {
      key: "notifications",
      label: `Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`,
      icon: "⚑"
    }
  ];

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* =========================
     UNIFIED BUTTON STYLE
     ========================= */
  const navButtonStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    marginTop: "20px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: isActive
      ? "rgba(255,255,255,0.12)"
      : "transparent",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "0.92rem",
    transition: "0.2s ease",
    backdropFilter: "blur(10px)"
  });

  const iconStyle = {
    color: "#ffffff",
    fontSize: "1rem",
    width: "18px",
    textAlign: "center"
  };

  return (
    <div>

      {/* TOP NAV */}
      <nav
        className="top-navbar"
        style={{
          display: "flex",
          alignItems: "center",   // cleaner alignment
          padding: "14px 24px"    // lowers entire nav content
        }}
      >

        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="nav-logo">SERAPH</span>
        </div>

        {/* NAV BUTTONS */}
        <ul
          className="nav-menu"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center"
          }}
        >
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                style={navButtonStyle(active === item.key)}
                onClick={() => setActive(item.key)}
              >
                <span style={iconStyle}>{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* USER INFO */}
        <div className="nav-user-info">
          <div className="nav-user-avatar">
            {getInitials(userdata?.fullName)}
          </div>

          <div className="nav-user-details">
            <span className="nav-user-name">
              {userdata?.fullName || "User"}
            </span>
            <span className="nav-user-role">Patient</span>
          </div>

          <button
            className="btn-seraph logout-btn btn-seraph-sm"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>

      </nav>

      {/* MAIN */}
      <main className="main-dashboard">

        {active === "home" && (
          <>

            {doctors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">⌕</div>
                <h3 className="empty-state-title">No doctors available</h3>
                <p className="empty-state-text">
                  Check back later for available healthcare professionals.
                </p>
              </div>
            ) : (
              doctors.map((doc) => (
                <DoctorList
                  key={doc._id}
                  doctor={doc}
                  userdata={userdata}
                  userDoctorId={userdata?._id}
                  onBooked={() => {}}
                />
              ))
            )}
          </>
        )}

        {active === "appointments" && <UserAppointments />}
        {active === "applyDoctor" && <ApplyDoctor userId={userdata?._id} />}
        {active === "notifications" && <Notification />}

      </main>
    </div>
  );
}

export default UserHome;