import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import { useState } from "react";

const ReviewDialog = ({
  leaveRequest,
  setLeaveRequests,
  isOpen,
  setIsOpen,
  leaveRequests,
}) => {
  const { user } = useAuth();
  const [reviewComment, setReviewComment] = useState("");
  const handleReview = async (leaveRequest, newStatus, reviewComment) => {
    try {
      const response = await axiosInstance.put(
        `/api/leave-requests/manage/${leaveRequest._id}`,
        { status: newStatus, reviewComment: reviewComment },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );
      setLeaveRequests(
        leaveRequests.map((lr) =>
          lr._id === response.data._id
            ? { ...lr, status: newStatus, reviewComment: reviewComment }
            : lr,
        ),
      );
      setReviewComment("");
      setIsOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update leave request.");
    }
  };

  return (
    <dialog open={isOpen}>
      <div className="bg-white p-4 mb-4 rounded shadow grid items-center gap-1.5 grid-cols-[1fr_1fr] ">
        <h2 className="text-xl font-bold mb-6 col-span-2">
          Review Leave Request
        </h2>
        {leaveRequest?.reason && (
          <>
            <span className="font-semibold justify-self-end">Reason:</span>
            <p>{leaveRequest?.reason}</p>
          </>
        )}
        <label
          className="font-semibold justify-self-end"
          htmlFor="reviewComment"
        >
          Comment:
        </label>
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="(optional)"
          onChange={(e) => setReviewComment(e.target.value)}
        />
        {/* review content here */}
      </div>
      <div className="grid items-center gap-1.5 grid-cols-[1fr_1fr] ">
        <button
          className="mr-2 bg-green-500 text-white p-2 rounded"
          onClick={() => handleReview(leaveRequest, "approved", reviewComment)}
        >
          Approve
        </button>
        <button
          className="bg-red-500 text-white p-2 rounded"
          onClick={() => handleReview(leaveRequest, "rejected", reviewComment)}
        >
          Reject
        </button>
        <button
          className="bg-gray-500 col-span-2 text-white p-2 rounded"
          onClick={() => setIsOpen(false)}
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default ReviewDialog;
