import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import AboutPage from "./pages/AboutPage";
import RecruiterPage from "./pages/RecruiterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/recruiters" element={<RecruiterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;