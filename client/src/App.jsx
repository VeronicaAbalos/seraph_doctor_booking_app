import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Home from "./components/common/Home";
import Login from "./components/common/Login";
import Register from "./components/common/Register";
import UserHome from "./components/user/UserHome";
import AdminHome from "./components/admin/AdminHome";
import DoctorHome from "./components/doctor/DoctorHome";

function PrivateRoute({ children, adminOnly = false, doctorOnly = false }) {
  const userData = localStorage.getItem("userData");
  if (!userData) return <Navigate to="/login" />;

  const user = JSON.parse(userData);

  if (adminOnly && user.type !== "admin") {
    return <Navigate to="/userhome" />;
  }

  if (doctorOnly && !user.isdoctor) {
    return <Navigate to="/userhome" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/userhome/*"
          element={
            <PrivateRoute>
              <UserHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctorhome/*"
          element={
            <PrivateRoute doctorOnly>
              <DoctorHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminhome/*"
          element={
            <PrivateRoute adminOnly>
              <AdminHome />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
