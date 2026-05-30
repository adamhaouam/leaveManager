import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ReviewDialog from '../components/reviewDialog';
import { useState } from 'react';

const PendingLeaveList = ({ leaveRequests, setLeaveRequests, setEditingLeaveRequest }) => {
  const { user } = useAuth();
  const [reviewComment, setReviewComment] = useState('');

  const handleReview = async (leaveRequest, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/leave-requests/manage/${leaveRequest._id}`, { status: newStatus, reviewComment: reviewComment }, {
        headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response.data, response.data._id, newStatus);
        setLeaveRequests(leaveRequests.map((lr) => 
        lr._id === response.data._id ? { ...lr, status: newStatus, reviewComment: reviewComment } : lr
      ));
      document.querySelector('#reviewRequest').close()
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
            <button
              onClick={() => document.querySelector('#reviewRequest').showModal()}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Review
            </button>

            <ReviewDialog leaveRequest={leaveRequest} onClose={() => document.querySelector('#reviewRequest').close()} onApprove={() => handleReview(leaveRequest, 'approved')} onReject={() => handleReview(leaveRequest, 'rejected') } setReviewComment={setReviewComment}/>

          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingLeaveList;