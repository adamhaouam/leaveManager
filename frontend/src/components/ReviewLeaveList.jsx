import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';


const LeaveRequestForm = ({ leaveRequests, setLeaveRequests, setEditingLeaveRequest }) => {
  const { user } = useAuth();

  const handleDelete = async (leaveRequestId) => {
    try {
      await axiosInstance.delete(`/api/leave-requests/${leaveRequestId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLeaveRequests(leaveRequests.filter((leaveRequest) => leaveRequest._id !== leaveRequestId));
    } catch (error) {
      alert('Failed to delete leave request.');
    }
  };

  const handleReview = async (leaveRequest, newStatus) => {
    try {
      console.log(leaveRequest._id, newStatus);
      const response = await axiosInstance.put(`/api/leave-requests/manage/${leaveRequest._id}`, { ...leaveRequest, status: newStatus }, {
        headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response.data, response.data._id, newStatus);
        setLeaveRequests(leaveRequests.map((lr) => 
        lr._id === response.data._id ? { ...lr, status: newStatus } : lr
      ));
      alert("Request has been " + newStatus + "!");
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update leave request.');
    }
  }

  return (
    <div>
      {leaveRequests.map((leaveRequest) => (
        <div key={leaveRequest._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{leaveRequest.leaveType}</h2>
          <p>{leaveRequest.reason}</p>
          <p>{leaveRequest.status}</p>
          <p className="text-sm text-gray-500">Dates: {new Date(leaveRequest.startDate).toLocaleDateString()} to {new Date(leaveRequest.endDate).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => handleReview(leaveRequest, 'approved')}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Approve
            </button>
            <button
              onClick={() => handleReview(leaveRequest, 'rejected')}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveRequestForm;
