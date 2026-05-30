import { useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";
import PendingLeaveList from "../components/PendingLeaveList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Pending = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState(null);
  const navigate = useNavigate();

  const filteredLeaveRequests = leaveRequests.filter(
    (request) => request.status === "pending",
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Pending Leave Requests</h1>
      <PendingLeaveList
        leaveRequests={filteredLeaveRequests}
        setLeaveRequests={setLeaveRequests}
        editingLeaveRequest={editingLeaveRequest}
        setEditingLeaveRequest={setEditingLeaveRequest}
      />
    </div>
  );
};

export default Pending;
