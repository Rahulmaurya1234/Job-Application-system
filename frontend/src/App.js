import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import JobsBrowser from "./pages/JobsBrowser";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecruiterPortal from "./pages/RecruiterPortal";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ATSChecker from "./pages/ATSChecker";


function Layout() {
  const location = useLocation();
  const hideLayout = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobsBrowser />} />
        <Route path="/recruiter" element={<RecruiterPortal />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Home />} />
        <Route path="/ats" element={<ATSChecker />} />
        <Route path="/about" element={<About />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
