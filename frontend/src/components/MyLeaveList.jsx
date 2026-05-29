import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const MyLeaveList = ({
  leaveRequests,
  setLeaveRequests,
  setEditingLeaveRequest,
}) => {
  const { user } = useAuth();

  const handleDelete = async (leaveRequestId) => {
    try {
      await axiosInstance.delete(`/api/leave-requests/${leaveRequestId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLeaveRequests(
        leaveRequests.filter(
          (leaveRequest) => leaveRequest._id !== leaveRequestId,
        ),
      );
    } catch (error) {
      alert("Failed to delete leave request.");
    }
  };

  return (
    <div>
      {leaveRequests.map((leaveRequest) => (
        <div
          key={leaveRequest._id}
          className="bg-white p-4 mb-4 rounded shadow"
        >
          <h2 className="font-bold">{leaveRequest.leaveType}</h2>
          <p>{leaveRequest.reason}</p>
          <p>{leaveRequest.status}</p>
          <p>{leaveRequest.reviewComment}</p>
          <p className="text-sm text-gray-500">
            Dates: {new Date(leaveRequest.startDate).toLocaleDateString()} to{" "}
            {new Date(leaveRequest.endDate).toLocaleDateString()}
          </p>
          <div className="mt-2">
            <button
              onClick={() => setEditingLeaveRequest(leaveRequest)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(leaveRequest._id)}
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

export default MyLeaveList;
