import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
        Task Manager
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">
              Tasks
            </Link>
            <Link to="/profile" className="mr-4">
              Profile
            </Link>
            <Link to="/leave" className="mr-4">
              My Leave
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-700"
            >
              Register
            </Link>
          </>
        )}
        {user && (user.role === "manager" || user.role === "admin") && (
          <>
            <Link
              to="/manage"
              className="ml-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-700"
            >
              View All
            </Link>
            <Link
              to="/pending"
              className="ml-4 bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-700"
            >
              Pending
            </Link>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="ml-4 bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Admin
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
