import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UserList from "../components/UserList";
import UserEditForm from "../components/UserEditForm";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("You must be an admin to view this page.");
      navigate("/login");
      return;
    }

    const fetchUserList = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUsers(response.data);
      } catch (error) {
        alert("Failed to fetch user list.");
      }
    };

    fetchUserList();
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <UserList users={users} setUsers={setUsers} setEditingUser={setEditingUser} />
      <UserEditForm editingUser={editingUser} setEditingUser={setEditingUser} users={users} setUsers={setUsers} isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Admin;
