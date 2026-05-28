import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAppointments from "./AdminAppointments";
import AdminDoctors from "./AdminDoctors";
import AdminUsers from "./AdminUser";

function AdminHome() {
  const navigate = useNavigate();

  const [active, setActive] = useState("appointments");

  const userData = JSON.parse(
    localStorage.getItem("userData") || "{}"
  );

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* =========================
     PLAIN WHITE ICONS ONLY
  ========================= */
  const navItems = [
    {
      key: "appointments",
      label: "Appointments",
      icon: "≣",
      component: <AdminAppointments />,
    },

    {
      key: "doctors",
      label: "Doctors",
      icon: "+",
      component: <AdminDoctors />,
    },

    {
      key: "users",
      label: "Users",
      icon: "⌕",
      component: <AdminUsers />,
    },
  ];

  const getInitials = (name) => {
    if (!name) return "A";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* =========================
     MATCH USERHOME BUTTONS
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
    backdropFilter: "blur(10px)",
  });

  const iconStyle = {
    color: "#ffffff",
    fontSize: "1rem",
    width: "18px",
    textAlign: "center",
  };

  return (
    <div>

      {/* TOP NAVBAR */}
      <nav
        className="top-navbar"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "14px 24px",
        }}
      >

        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span className="nav-logo">
            SERAPH
          </span>

          <span className="nav-tagline">
            Admin Portal
          </span>
        </div>

        {/* NAVIGATION */}
        <ul
          className="nav-menu"
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          {navItems.map((item) => (
            <li key={item.key}>
              <button
                style={navButtonStyle(
                  active === item.key
                )}
                onClick={() => setActive(item.key)}
              >
                <span style={iconStyle}>
                  {item.icon}
                </span>

                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* USER INFO */}
        <div className="nav-user-info">

          <div className="nav-user-avatar">
            {getInitials(userData.fullName)}
          </div>

          <div className="nav-user-details">
            <span className="nav-user-name">
              {userData.fullName}
            </span>

            <span className="nav-user-role">
              Administrator
            </span>
          </div>

          <button
            className="btn-seraph logout-btn btn-seraph-sm"
            onClick={logout}
          >
            Sign Out
          </button>

        </div>

      </nav>

      {/* MAIN CONTENT */}
      <main className="main-dashboard">
        {
          navItems.find(
            (item) => item.key === active
          )?.component
        }
      </main>

    </div>
  );
}

export default AdminHome;