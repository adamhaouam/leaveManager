const AllLeaveList = ({ leaveRequests }) => {
  return (
    <div>
      {leaveRequests.map((leaveRequest) => (
        <div
          key={leaveRequest._id}
          className="bg-gray-100 p-4 mb-4 rounded shadow"
        >
          <h2 className="font-bold">{leaveRequest.leaveType}</h2>
          <p>{leaveRequest.reason}</p>
          <p>{leaveRequest.status}</p>
          <p>Review's comment:</p>
          <p>{leaveRequest.reviewComment}</p>
          <p className="text-sm text-gray-500">
            Dates: {new Date(leaveRequest.startDate).toLocaleDateString()} to{" "}
            {new Date(leaveRequest.endDate).toLocaleDateString()}
          </p>
          <div className="mt-2"></div>
        </div>
      ))}
    </div>
  );
};

export default AllLeaveList;
