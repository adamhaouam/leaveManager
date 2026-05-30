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
    <nav className="bg-gradient-to-r from-cyan-400 to-indigo-600 text-white shadow-lg p-4 flex justify-between items-center">
      <Link to="/leave" className="text-2xl font-bold">
        Leave Management
      </Link>
      <div class="*:ml-3 *:px-3 *:py-2 *:rounded-md *:font-medium">
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/leave">My Leave</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && (user.role === "manager" || user.role === "admin") && (
          <>
            <Link to="/manage">View All</Link>
            <Link to="/pending">Pending</Link>
          </>
        )}
        {user && user.role === "admin" && (
          <>
            <Link
              to="/admin"
              className="ml-4 bg-purple-500 px-4 py-2 rounded hover:bg-purple-700"
            >
              Admin
            </Link>
          </>
        )}
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded ml-5 hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
