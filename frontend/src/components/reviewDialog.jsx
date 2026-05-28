import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';


const ReviewDialog = ({ leaveRequest, onClose, onApprove, onReject, setReviewComment }) => {

  return (
    <dialog id="reviewRequest" className="rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Review Leave Request</h2>
      <h3>Review Comment:</h3>
      <input
        type="text"
        placeholder="Comment (optional)"
        onChange={(e) => setReviewComment(e.target.value)}
      />
      {/* review content here */}
      <p>{leaveRequest.reviewComment}</p>
      <p>{leaveRequest.reason}</p>
      <button 
      className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
      onClick={onApprove}>Approve</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onReject}>Reject</button>
      <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
    </dialog>
  );
};

export default ReviewDialog;