import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import LEAVE_TYPES from "../constants/leaveTypes";
import STATUS_TYPES from "../constants/statusTypes";

const MyLeaveList = ({
  leaveRequests,
  setLeaveRequests,
  setEditingLeaveRequest,
}) => {
  const { user } = useAuth();

  const getLeaveTypeLabel = (leaveTypeValue) => {
    const leaveType = LEAVE_TYPES.find((type) => type.value === leaveTypeValue);
    return leaveType ? leaveType.label : leaveTypeValue;
  };

  const getStatusLabel = (statusValue) => {
    const status = STATUS_TYPES.find((s) => s.value === statusValue);
    return status ? status.label : statusValue;
  };

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
          className="bg-white p-4 mb-4 rounded shadow grid items-center gap-1.5 grid-cols-[auto_1fr] "
        >
          <span className="font-semibold content-end justify-self-end">
            Type:
          </span>
          <span>{getLeaveTypeLabel(leaveRequest.leaveType)}</span>
          {leaveRequest.reason && (
            <>
              <span className="font-semibold justify-self-end">Reason:</span>
              <p>{leaveRequest.reason}</p>
            </>
          )}

          <span className="font-semibold justify-self-end">Status:</span>
          <span class={leaveRequest.status}>
            {getStatusLabel(leaveRequest.status)}
          </span>

          <span className="font-semibold justify-self-end">Dates:</span>
          <span>
            <b>{new Date(leaveRequest.startDate).toLocaleDateString()}</b> to{" "}
            <b>{new Date(leaveRequest.endDate).toLocaleDateString()}</b>
          </span>

          {leaveRequest.reviewComment && (
            <>
              <span className="font-semibold justify-self-end">Comment:</span>
              <p>{leaveRequest.reviewComment}</p>
            </>
          )}

          {leaveRequest.status === "pending" && (
            <>
              <div className="mt-2 flex col-span-2">
                <button
                  onClick={() => setEditingLeaveRequest(leaveRequest)}
                  className="mr-2 bg-blue-400 text-white px-4 py-2 rounded"
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
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyLeaveList;
