import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import ReviewDialog from '../components/reviewDialog';
import { useState, useEffect } from 'react';
import LEAVE_TYPES from "../constants/leaveTypes";
import STATUS_TYPES from "../constants/statusTypes";

const PendingLeaveList = ({ leaveRequests, setLeaveRequests, editingLeaveRequest,setEditingLeaveRequest }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userNames, setUserNames] = useState([]);

  useEffect(() => {
    const fetchUserNames = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/users", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setUserNames(response.data);
      } catch (error) {
        alert("Failed to fetch leave requests.");
      }
    };

    fetchUserNames();
  }, [user]);

  const getUserName = (userId) => {
    return userNames.filter((user) => user._id === userId)[0]?.name || "Unknown User";
  };

  const getLeaveTypeLabel = (leaveTypeValue) => {
    const leaveType = LEAVE_TYPES.find((type) => type.value === leaveTypeValue);
    return leaveType ? leaveType.label : leaveTypeValue;
  };

  const getStatusLabel = (statusValue) => {
    const status = STATUS_TYPES.find((s) => s.value === statusValue);
    return status ? status.label : statusValue;
  };


  return (
    <div>
      {leaveRequests.map((leaveRequest) => (
        <div
          key={leaveRequest._id}
          className="bg-white p-4 mb-4 rounded shadow grid items-center gap-1.5 grid-cols-[5rem_1fr] " 
        >
          <span className="font-semibold content-end justify-self-end">User:</span>
          <span>{getUserName(leaveRequest.userId)}</span>

          <span className="font-semibold content-end justify-self-end">Type:</span>
          <span>{getLeaveTypeLabel(leaveRequest.leaveType)}</span>
          {leaveRequest.reason && (
            <>
              <span className="font-semibold justify-self-end">Reason:</span>
              <p>{leaveRequest.reason}</p>
            </>)}
          
          <span className="font-semibold justify-self-end">Status:</span>
          <span class={leaveRequest.status}>{getStatusLabel(leaveRequest.status)}</span>
          
          
          
          <span className="font-semibold justify-self-end">Dates:</span>
          <span><b>{new Date(leaveRequest.startDate).toLocaleDateString()}</b> to{" "}
            <b>{new Date(leaveRequest.endDate).toLocaleDateString()}</b></span>

          {leaveRequest.reviewComment && (
            <>
              <span className="font-semibold justify-self-end">Comment:</span>
              <p>{leaveRequest.reviewComment}</p>
            </>)}
            
          <button className="col-span-2 w-full bg-pink-600 text-white text-lg p-2 rounded" onClick={() => {
            setEditingLeaveRequest(leaveRequest);
            setIsOpen(true);
          }}>
            Review
          </button>
            
        </div>
      ))}
      <ReviewDialog 
              leaveRequest={editingLeaveRequest}
              leaveRequests={leaveRequests}
              setLeaveRequests={setLeaveRequests}
              isOpen={isOpen}
              setIsOpen={setIsOpen} 
            />
    </div>

  );
};

export default PendingLeaveList;