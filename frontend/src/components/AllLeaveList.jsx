import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ReviewDialog from './reviewDialog';
import { useState } from 'react';

const AllLeaveList = ({ leaveRequests, setLeaveRequests, editingLeaveRequest, setEditingLeaveRequest }) => {
  const { user } = useAuth();
  const [reviewComment, setReviewComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleReview = async (leaveRequest, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/leave-requests/manage/${leaveRequest._id}`, { status: newStatus, reviewComment: "ACTIONED!!!" }, {
        headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveRequests(leaveRequests.map((lr) => 
        lr._id === response.data._id ? { ...lr, status: newStatus, reviewComment: reviewComment } : lr
      ));
      setIsOpen(false);
      //alert("Request has been " + newStatus + "!");
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
          <p>Review's comment:</p>
          <p>{leaveRequest.reviewComment}</p>
          <p className="text-sm text-gray-500">Dates: {new Date(leaveRequest.startDate).toLocaleDateString()} to {new Date(leaveRequest.endDate).toLocaleDateString()}</p>
          <div className="mt-2">
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllLeaveList;
