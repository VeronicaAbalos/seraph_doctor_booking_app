import { Link } from "react-router-dom";

// Import images
import heroBg from "../../assets/home_pic.png";
import findSpecialist from "../../assets/find_specialist.png";
import instantBooking from "../../assets/instant_booking.png";
import smartNotification from "../../assets/smart_notification.png";
import securePrivate from "../../assets/secure_private.png";

function Home() {

  const iconStyle = {
    width: "250px",
    height: "120px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto"
  };

  const cardStyle = {
    padding: "22px",
    textAlign: "center",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    height: "100%"
  };

  const textStyle = {
    textAlign: "justify",
    lineHeight: "1.6",
    fontSize: "0.95rem",
    color: "rgba(0,0,0,0.75)"
  };

  return (
    <div className="landing-page">

      {/* NAV */}
      <nav className="landing-nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <span className="nav-logo">SERAPH</span>
          <span style={{ marginLeft: "10px" }}>
            Care within Your Reach
          </span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <Link to="/login" className="btn-seraph btn-seraph-outline">
            Sign In
          </Link>
          <Link to="/register" className="btn-seraph btn-seraph-primary">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          padding: "0 8%",
          paddingTop: "140px",
          background: "linear-gradient(135deg, #060111 0%, #0b0620 50%, #060111 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-start"
        }}
      >

        {/* BACKGROUND */}
        <div style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          marginTop: "90px",
          zIndex: 1
        }}>

          <div style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, #060111 0%, rgba(6,1,17,0.92) 15%, rgba(6,1,17,0.80) 30%, rgba(6,1,17,0.55) 50%, rgba(6,1,17,0.25) 70%, rgba(6,1,17,0.10) 85%, transparent 100%)",
            zIndex: 2
          }} />

          <img
            src={heroBg}
            alt="Healthcare"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center"
            }}
          />
        </div>

        {/* HERO CONTENT */}
        <div style={{ position: "relative", zIndex: 3, maxWidth: "700px", color: "white" }}>
          <h1 style={{
            fontSize: "6rem",
            fontWeight: "800",
            lineHeight: "1",
            marginTop: "40px",
            marginBottom: "15px",
            letterSpacing: "3px"
          }}>
            SERAPH
          </h1>

          <p style={{
            fontSize: "1.7rem",
            marginBottom: "28px",
            fontWeight: "500"
          }}>
            Your Health, One Tap Away
          </p>

          <div style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            padding: "22px",
            borderRadius: "16px",
            maxWidth: "620px",
            marginBottom: "35px",
            color: "rgba(255,255,255,0.85)",
            lineHeight: "1.9",
            boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
          }}>
            A unified digital healthcare platform that simplifies how patients
            connect with medical professionals, manage consultations, and
            receive timely healthcare updates—all in one secure system designed
            for accessibility and convenience.
          </div>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link to="/register" className="btn-seraph btn-seraph-primary">
              Start Your Journey
            </Link>
            <Link to="/login" className="btn-seraph btn-seraph-outline">
              Already a member? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="features-section"
        style={{
          padding: "70px 8%"
        }}
      >

        <h2
          className="features-title"
          style={{
            textAlign: "center",
            fontSize: "2.7rem",
            marginBottom: "50px"
          }}
        >
          Designed for Better Healthcare Experiences
        </h2>

        {/* Features Grid */}
        <div
          className="features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px"
          }}
        >

          {/* Card 1 */}
          <div
            className="feature-card"
            style={{
              padding: "22px",
              textAlign: "center",
              borderRadius: "18px"
            }}
          >
            <img
              src={findSpecialist}
              alt="Healthcare Access"
              style={iconStyle}
            />

            <h3
              className="feature-title"
              style={{
                marginTop: "15px",
                marginBottom: "12px"
              }}
            >
              Accessible Healthcare Connections
            </h3>

            <p className="feature-text">
              Connect with qualified healthcare professionals through an
              organized platform that simplifies specialist discovery and
              appointment accessibility.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="feature-card"
            style={{
              padding: "22px",
              textAlign: "center",
              borderRadius: "18px"
            }}
          >
            <img
              src={instantBooking}
              alt="Fast Booking"
              style={iconStyle}
            />

            <h3
              className="feature-title"
              style={{
                marginTop: "15px",
                marginBottom: "12px"
              }}
            >
              Faster Digital Scheduling
            </h3>

            <p className="feature-text">
              Schedule consultations efficiently with a user-friendly booking
              process that minimizes delays and improves convenience.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="feature-card"
            style={{
              padding: "22px",
              textAlign: "center",
              borderRadius: "18px"
            }}
          >
            <img
              src={smartNotification}
              alt="Real Time Updates"
              style={iconStyle}
            />

            <h3
              className="feature-title"
              style={{
                marginTop: "15px",
                marginBottom: "12px"
              }}
            >
              Real-Time Healthcare Updates
            </h3>

            <p className="feature-text">
              Receive appointment reminders, status notifications, and important
              healthcare updates instantly within the platform.
            </p>
          </div>

          {/* Card 4 */}
          <div
            className="feature-card"
            style={{
              padding: "22px",
              textAlign: "center",
              borderRadius: "18px"
            }}
          >
            <img
              src={securePrivate}
              alt="Secure System"
              style={iconStyle}
            />

            <h3
              className="feature-title"
              style={{
                marginTop: "15px",
                marginBottom: "12px"
              }}
            >
              Safe & Protected Experience
            </h3>

            <p className="feature-text">
              Maintain privacy and security through encrypted healthcare data
              management designed to protect sensitive information.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer
        className="landing-footer"
        style={{
          textAlign: "center",
          padding: "25px"
        }}
      >
        <p className="footer-text">
          © 2026 <span className="footer-brand">SERAPH</span>. Empowering
          better healthcare experiences.
        </p>
      </footer>

    </div>
  );
}

export default Home;