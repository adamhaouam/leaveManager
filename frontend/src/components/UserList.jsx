import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import USER_TYPES from "../constants/userTypes";

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

  const getUserLabel = (userRole) => {
    const role = USER_TYPES.find((s) => s.value === userRole);
    return role ? role.label : userRole;
  };

  return (
    <div>
      {users.map((user) => (
        <div key={user._id} className="bg-white p-4 mb-4 rounded shadow grid items-center gap-1.5 grid-cols-[auto_1fr]">
          <span className="font-semibold justify-self-end">Name:</span>
          <span>{user.name}</span>

          <span className="font-semibold justify-self-end">Email:</span>
          <span>{user.email}</span>

          <span className="font-semibold justify-self-end">Role:</span>
          <span>{getUserLabel(user.role)}</span>

          <div className="col-span-2 flex gap-2 mt-2">
            <button
              onClick={() => setEditingUser(user)}
              className="bg-blue-400 text-white px-4 py-2 rounded"
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
