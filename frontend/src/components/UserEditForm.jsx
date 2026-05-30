import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import USER_TYPES from "../constants/userTypes";

const UserEditForm = ({ editingUser, setEditingUser, users, setUsers, isOpen, setIsOpen }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  

  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      });
      setIsOpen(true);
    } else {
      setFormData({ name: "", email: "", role: "" });
    }
  }, [editingUser, setIsOpen]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", formData); // Debug log
    try {
      if (!formData.name || !formData.email || !formData.role) {
        alert("Please fill in all required fields.");
        return;
      }
      console.log("editingUser:", editingUser); // Debug log
      const response = await axiosInstance.put(
          `/api/auth/users/${editingUser._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setUsers(
          users.map((user) =>
            user._id === response.data._id
              ? response.data
              : user,
          ),
        );
        setEditingUser(null);
        setIsOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user.");
      return;
    }
  };

    return (
        <dialog className="bg-white p-6 border-blue-400 border-2 backdrop:bg-black/50 rounded shadow-lg" open={isOpen} >
              <form
                onSubmit={handleSubmit}
              >
                <h1 className="text-2xl font-bold mb-4">
                  Edit User
                </h1>
        
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mb-4 p-2 border rounded"
                />

                <input
                  type="text"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mb-4 p-2 border rounded"
                />

                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full mb-4 p-2 border rounded"
                  defualtvalue=""
                >
                  <option disabled hidden value="">
                    Select Role
                  </option>
                  {USER_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>

                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded"
                >
                  Update User
                </button>
                <button
                  type="button"
                  className="w-full bg-gray-500 text-white p-2 rounded mt-2"
                  onClick={() => {
                    setEditingUser(null);
                    setIsOpen(false);
                  }}
                >
                  Cancel
                </button>
              </form>
            </dialog>





    )


}

export default UserEditForm;
