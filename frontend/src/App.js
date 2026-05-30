import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Leave from "./pages/Leave";
import Manage from "./pages/Manage";
import Pending from "./pages/Pending";
import Admin from "./pages/Admin";
import { Navigate } from 'react-router-dom';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/leave" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
