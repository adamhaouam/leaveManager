const express = require('express');
const { getLeaveRequests, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, reviewLeaveRequest } = require('../controllers/leaveRequestController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getLeaveRequests).post(protect, addLeaveRequest);
router.route('/:id').put(protect, updateLeaveRequest).delete(protect, deleteLeaveRequest);
//router.route('/:id/review').put(protect, reviewLeaveRequest);

module.exports = router;