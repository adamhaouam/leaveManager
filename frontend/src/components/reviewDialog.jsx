const ReviewDialog = ({
  leaveRequest,
  onClose,
  onApprove,
  onReject,
  setReviewComment,
  isOpen,
}) => {
  return (
    <dialog id="reviewRequest" open={isOpen}>
      <h2>Review Leave Request</h2>
      <h3>Review Comment:</h3>
      <p>{leaveRequest?.reason}</p>
      <input
        type="text"
        placeholder="Comment (optional)"
        onChange={(e) => setReviewComment(e.target.value)}
      />
      {/* review content here */}

      <button
        className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
        onClick={onApprove}
      >
        Approve
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={onReject}
      >
        Reject
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded"
        onClick={onClose}
      >
        Close
      </button>
    </dialog>
  );
};

export default ReviewDialog;
