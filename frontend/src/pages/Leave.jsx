import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import LeaveRequestForm from '../components/LeaveForm';
import LeaveRequestList from '../components/LeaveRequestList';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [editingLeaveRequest, setEditingLeaveRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      alert('You must be logged in to view leave requests.');
      navigate('/login');
      return;
    }
    const fetchLeaveRequests = async () => {
      try {
        const response = await axiosInstance.get('/api/leave-requests', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveRequests(response.data);
      } catch (error) {
        alert('Failed to fetch leave requests.');
      }
    };

    fetchLeaveRequests();
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      <LeaveRequestForm
        leaveRequests={leaveRequests}
        setLeaveRequests={setLeaveRequests}
        editingLeaveRequest={editingLeaveRequest}
        setEditingLeaveRequest={setEditingLeaveRequest}
      />

    <LeaveRequestList leaveRequests={leaveRequests} setLeaveRequests={setLeaveRequests} setEditingLeaveRequest={setEditingLeaveRequest} />  
    </div>
  );
};

export default LeaveRequests;
