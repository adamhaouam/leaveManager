import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import LEAVE_TYPES from "../constants/leaveTypes";

const LeaveRequestForm = ({
  leaveRequests,
  setLeaveRequests,
  editingLeaveRequest,
  setEditingLeaveRequest,
  isOpen,
  setIsOpen,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const dateConvert = (isoString) => (isoString ? isoString.slice(0, 10) : "");
  useEffect(() => {
    if (editingLeaveRequest) {
      setIsOpen(true);
      setFormData({
        leaveType: editingLeaveRequest.leaveType,
        startDate: dateConvert(editingLeaveRequest.startDate),
        endDate: dateConvert(editingLeaveRequest.endDate),
        reason: editingLeaveRequest.reason,
      });
    } else {
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
    }
    
  }, [editingLeaveRequest, setIsOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Do checks before sending to backend
      if (!formData.leaveType || !formData.startDate || !formData.endDate) {
        alert("Please fill in all required fields.");
        return;
      }
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        alert("Start date cannot be after end date.");
        return;
      }
      if (editingLeaveRequest) {
        const response = await axiosInstance.put(
          `/api/leave-requests/${editingLeaveRequest._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setLeaveRequests(
          leaveRequests.map((leaveRequest) =>
            leaveRequest._id === response.data._id
              ? response.data
              : leaveRequest,
          ),
        );
      } else {
        const response = await axiosInstance.post(
          "/api/leave-requests",
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setLeaveRequests([...leaveRequests, response.data]);
      }
      setEditingLeaveRequest(null);
      setFormData({ leaveType: "", startDate: "", endDate: "", reason: "" });
      setIsOpen(false);
    } catch (error) {
      if (error.response.status === 409) {
        alert(
          "Leave request conflicts with an existing approved leave. Please choose different dates.",
        );
      } else alert("Failed to save leave request.");
    }
  };

  return (
    <dialog id="leaveRequestForm" className="bg-white p-6 border-blue-400 border-2 backdrop:bg-black/50 rounded shadow-lg" open={isOpen} >
      <form
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4">
          {editingLeaveRequest ? "Edit Leave Request" : "Add Leave Request"}
        </h1>

        <select
          value={formData.leaveType}
          onChange={(e) =>
            setFormData({ ...formData, leaveType: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
          defualtvalue=""
        >
          <option disabled hidden value="">
            Select Leave Type
          </option>
          {LEAVE_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        <input
          required
          type="date"
          placeholder="Start Date"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          required
          type="date"
          placeholder="End Date"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
          className="w-full mb-4 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Reason (optional)"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {editingLeaveRequest ? "Update Leave Request" : "Add Leave Request"}
        </button>
        <button
          type="button"
          className="w-full bg-gray-500 text-white p-2 rounded mt-2"
          onClick={() => {
            setEditingLeaveRequest(null);
            setIsOpen(false);
          }}
        >
          Cancel
        </button>
      </form>
    </dialog>
  );
};

export default LeaveRequestForm;
