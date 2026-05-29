const LeaveRequest = require('../models/LeaveRequest');

const getLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ userId: req.user.id });
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addLeaveRequest = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;
    try {
        const checkConflict = await LeaveRequest.findOne({
            userId: req.user.id,   
            startDate: { $lt: new Date(endDate) },
            endDate: { $gt: new Date(startDate) },
            status: { $in: ['pending', 'approved'] }, 
        });
        if (checkConflict) {
            return res.status(409).json({ message: 'Leave request conflicts with an existing requested leave.' });
        }
        const leaveRequest = await LeaveRequest.create({ userId: req.user.id, leaveType, startDate, endDate, reason });
        res.status(201).json(leaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLeaveRequest = async (req, res) => {
    const { leaveType, startDate, endDate, reason } = req.body;
    try {
        const checkConflict = await LeaveRequest.findOne({
            _id: { $ne: req.params.id }, // Exclude current request
            userId: req.user.id,   
            startDate: { $lt: new Date(endDate) },
            endDate: { $gt: new Date(startDate) },
            status: { $in: ['pending', 'approved'] },
        });
        if (checkConflict) {
            console.log("Conflict detected with leave request ID:", checkConflict.status, checkConflict.startDate, checkConflict.endDate);
            return res.status(409).json({ message: 'Leave request conflicts with an existing requested leave.' });
        }
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
        
        leaveRequest.leaveType = leaveType || leaveRequest.leaveType;
        leaveRequest.startDate = startDate || leaveRequest.startDate;
        leaveRequest.endDate = endDate || leaveRequest.endDate;
        leaveRequest.reason = reason;

        const updatedLeaveRequest = await leaveRequest.save();
        res.json(updatedLeaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLeaveRequest = async (req, res) => {
    try {
        const leaveRequest = await LeaveRequest.findByIdAndDelete(req.params.id);
        if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });
        res.json({ message: 'Leave request removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const reviewLeaveRequest = async (req, res) => {
    const { status, reviewComment } = req.body;
    try {
        const leaveRequest = await LeaveRequest.findById(req.params.id);
        if (!leaveRequest) return res.status(404).json({ message: 'Leave request not found' });

        leaveRequest.status = status;
        leaveRequest.reviewComment = reviewComment;
        const updatedLeaveRequest = await leaveRequest.save();
        res.json(updatedLeaveRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getAllLeaveRequests = async (req, res) => {
    try {
        const leaveRequests = await LeaveRequest.find({ });
        res.json(leaveRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getLeaveRequests, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, getAllLeaveRequests, reviewLeaveRequest };