import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import USER_TYPES from "../constants/userTypes";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        alert("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
    else navigate("/login"); // Redirect to login if not authenticated
  }, [user, navigate]);

  const getUserLabel = (userRole) => {
    const role = USER_TYPES.find((s) => s.value === userRole);
    return role ? role.label : userRole;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put("/api/auth/profile", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-4 mb-4 rounded shadow grid items-center gap-y-4 gap-x-2 grid-cols-[auto_1fr]">
        <h1 className="text-2xl col-span-2 font-bold mb-4 text-center">Your Profile</h1>
        <label className="font-semibold justify-self-end">Name:</label>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <label className="font-semibold justify-self-end">Email:</label>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <b className="font-semibold justify-self-end">Role: </b>
        <span>{getUserLabel(user?.role)}</span>
        
        <button
          type="submit"
          className="w-full my-2 bg-blue-600 text-white col-span-2 p-2 rounded"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
