const express = require('express');
const { getLeaveRequests, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, getAllLeaveRequests, reviewLeaveRequest } = require('../controllers/leaveRequestController');
const { protect, requireManager } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getLeaveRequests).post(protect, addLeaveRequest);
router.route('/:id').put(protect, updateLeaveRequest).delete(protect, deleteLeaveRequest);


router.route('/manage').get(protect, requireManager, getAllLeaveRequests);
//router.route('/manage/:id/review').put(protect, requireManager, reviewLeaveRequest);

module.exports = router;