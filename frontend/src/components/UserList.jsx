import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const UserList = ({ users, setUsers, setEditingUser }) => {
  const { user } = useAuth();

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/api/auth/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div>
      {users.map((user) => (
        <div key={user._id} className="bg-white p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.role}</p>

          <div className="mt-2 flex">
            <button
              onClick={() => setEditingUser(user)}
              className="mr-2 bg-blue-400 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserList;
