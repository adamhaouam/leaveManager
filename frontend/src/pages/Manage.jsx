import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import AllLeaveList from "../components/AllLeaveList";
import LeaveRequestForm from "../components/LeaveForm";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Manage = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState(["pending", "approved"]);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const filteredLeaveRequests =
    statusFilter.length === 0
      ? leaveRequests
      : leaveRequests.filter((request) =>
          statusFilter.includes(request.status),
        );

  useEffect(() => {
    if (!user || (user.role !== "manager" && user.role !== "admin")) {
      alert("You must be a manager or admin to view this page.");
      navigate("/login");
      return;
    }

    const fetchLeaveRequests = async () => {
      try {
        const response = await axiosInstance.get("/api/leave-requests/manage", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveRequests(response.data);
      } catch (error) {
        alert("Failed to fetch leave requests.");
      }
    };

    fetchLeaveRequests();
  }, [user, navigate]);

  const handleFilter = async (e) => {
    try {
      if (e.target.checked) {
        setStatusFilter([...statusFilter, e.target.value]);
      } else {
        setStatusFilter(statusFilter.filter((item) => item !== e.target.value));
      }
    } catch (error) {
      alert("Error adjusting filter.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Leave Requests</h1>
      <div className="mb-6 flex">
        <h3>Filter by status:</h3>
        <label className="ml-4">
          <input
            onChange={(e) => handleFilter(e)}
            defaultChecked={true}
            value="pending"
            type="checkbox"
          />{" "}
          Pending
        </label>
        <label className="ml-4">
          <input
            onChange={(e) => handleFilter(e)}
            defaultChecked={true}
            value="approved"
            type="checkbox"
          />{" "}
          Approved
        </label>
        <label className="ml-4">
          <input
            onChange={(e) => handleFilter(e)}
            value="rejected"
            type="checkbox"
          />{" "}
          Rejected
        </label>
      </div>

    <LeaveRequestForm
        leaveRequests={leaveRequests}
        setLeaveRequests={setLeaveRequests}
        editingLeaveRequest={editingLeaveRequest}
        setEditingLeaveRequest={setEditingLeaveRequest}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <AllLeaveList
        leaveRequests={filteredLeaveRequests}
        setLeaveRequests={setLeaveRequests}
        editingLeaveRequest={editingLeaveRequest}
        setEditingLeaveRequest={setEditingLeaveRequest}
      />
    </div>
  );
};

export default Manage;
