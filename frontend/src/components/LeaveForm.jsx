import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const LeaveRequestForm = ({ leaveRequests, setLeaveRequests, editingLeaveRequest, setEditingLeaveRequest }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
  const dateConvert = (isoString) => isoString ? isoString.slice(0,10) : ''
  useEffect(() => {
    if (editingLeaveRequest) {
      setFormData({
        leaveType: editingLeaveRequest.leaveType,
        startDate: dateConvert(editingLeaveRequest.startDate),
        endDate: dateConvert(editingLeaveRequest.endDate),
        reason: editingLeaveRequest.reason,
      });
    } else {
      setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
    }
  }, [editingLeaveRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLeaveRequest) {
        const response = await axiosInstance.put(`/api/leave-requests/${editingLeaveRequest._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveRequests(leaveRequests.map((leaveRequest) => (leaveRequest._id === response.data._id ? response.data : leaveRequest)));
      } else {
        const response = await axiosInstance.post('/api/leave-requests', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setLeaveRequests([...leaveRequests, response.data]);
      }
      setEditingLeaveRequest(null);
      setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      alert('Failed to save leave request.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{editingLeaveRequest ? 'Edit Leave Request' : 'Add Leave Request'}</h1>
      <input
        type="text"
        placeholder="Leave Type"
        value={formData.leaveType}
        onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        required
        type="date"
        placeholder="Start Date"
        value={formData.startDate}
        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        required
        type="date"
        placeholder="End Date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Reason (optional)"
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingLeaveRequest ? 'Update Leave Request' : 'Add Leave Request'}
      </button>
    </form>
  );
};

export default LeaveRequestForm;
