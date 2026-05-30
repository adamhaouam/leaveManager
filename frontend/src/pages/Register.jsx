import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosConfig";
import USER_TYPES from "../constants/userTypes";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log(formData);
    e.preventDefault();
    try {
      if (
        !formData.email ||
        !formData.password ||
        !formData.role ||
        !formData.name
      ) {
        alert("Please fill in all required fields.");
        return;
      }
      await axiosInstance.post("/api/auth/register", formData);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      if (error.response.status === 400) {
        alert("Email already exists. Please use a different email.");
      } else alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        <input
          type="text"
          required
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
        />

        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        >
          <option disabled selected hidden value="">
            Select User Type
          </option>
          {USER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
