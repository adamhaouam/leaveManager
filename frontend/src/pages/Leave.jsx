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
  const [statusFilter, setStatusFilter] = useState(["pending", "approved"]);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const filteredLeaveRequests = statusFilter.length === 0 
  ? leaveRequests 
  : leaveRequests.filter((request) => statusFilter.includes(request.status));

  useEffect(() => {
    if (!user) {
      //alert('You must be logged in to view leave requests.');
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

  const handleFilter = async (e) => {
    try {
      if (e.target.checked) {
        setStatusFilter([...statusFilter, e.target.value]);
      }
      else {
        setStatusFilter(statusFilter.filter((item) => item !== e.target.value));
      }
    } catch (error) {
      alert('Error adjusting filter.');
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Leave Requests</h1>
      <button
              onClick={() => setIsOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add New
      </button>

      <div className="mb-6">
        Filter by status:
        <label className="ml-4">
          <input 
          onChange={(e) => handleFilter(e)}
          defaultChecked={true}
          value='pending'  type="checkbox" /> Pending
        </label>
        <label className="ml-4">
          <input 
          onChange={(e) => handleFilter(e)}
          defaultChecked={true}
          value='approved' type="checkbox" /> Approved
        </label>
        <label className="ml-4">
          <input 
          onChange={(e) => handleFilter(e)}
          value='rejected' type="checkbox" /> Rejected
        </label>
      </div>


      <LeaveRequestForm
        leaveRequests={leaveRequests}
        setLeaveRequests={setLeaveRequests}
        editingLeaveRequest={editingLeaveRequest}
        setEditingLeaveRequest={setEditingLeaveRequest}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

    <LeaveRequestList leaveRequests={filteredLeaveRequests} setLeaveRequests={setLeaveRequests} setEditingLeaveRequest={setEditingLeaveRequest} />  
    </div>
  );
};

export default LeaveRequests;
