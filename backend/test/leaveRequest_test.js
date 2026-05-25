
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const LeaveRequest = require('../models/LeaveRequest');
const { getLeaveRequests, addLeaveRequest, updateLeaveRequest, deleteLeaveRequest, reviewLeaveRequest } = require('../controllers/leaveRequestController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddLeaveRequest Function Test', () => {

  it('should create a new leave request successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { leaveType: "annual", startDate: "2025-01-01", endDate: "2025-02-02", reason: "Family trip" }
    };

    // Mock leave request that would be created
    const createdLeaveRequest = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub LeaveRequest.create to return the createdLeaveRequest
    const createStub = sinon.stub(LeaveRequest, 'create').resolves(createdLeaveRequest);

    //Stub LeaveRequest.findOne to return null (no conflict)
    const findOneStub = sinon.stub(LeaveRequest, 'findOne').resolves(null);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addLeaveRequest(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdLeaveRequest)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
    findOneStub.restore();
  });

  

  it('should return 500 if an error occurs', async () => {
    // Stub LeaveRequest.create to throw an error
    const createStub = sinon.stub(LeaveRequest, 'create').throws(new Error('DB Error'));

    //Stub LeaveRequest.findOne to return null (no conflict)
    const findOneStub = sinon.stub(LeaveRequest, 'findOne').resolves(null);

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { leaveType: "annual", startDate: "2025-12-01", endDate: "2025-12-10", reason: "Family trip" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addLeaveRequest(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
    findOneStub.restore();
  });


  it('should return 409 if containing conflicting dates', async () => {
    // Mock leave request data
    const existingLeaveRequest = {
      _id: new mongoose.Types.ObjectId(),
      leaveType: "annual",
      startDate: "2025-12-01",
      endDate: "2025-12-10",
      reason: "Family trip",
    };

    

    //Stub LeaveRequest.findOne to return null (no conflict)
    const findOneStub = sinon.stub(LeaveRequest, 'findOne').resolves(true);

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { leaveType: "annual", startDate: "2025-12-03", endDate: "2025-12-08", reason: "Work trip" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addLeaveRequest(req, res);

    // Assertions
    expect(res.status.calledWith(409)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Leave request conflicts with an existing approved leave.' })).to.be.true;

    // Restore stubbed methods
    findOneStub.restore();
  });



});


describe('Update Function Test', () => {

  it('should update leave request successfully', async () => {
    // Mock leave request data
    const leaveRequestId = new mongoose.Types.ObjectId();
    const existingLeaveRequest = {
      _id: leaveRequestId,
      leaveType: "annual",
      startDate: "2025-12-01",
      endDate: "2025-12-10",
      reason: "Family trip",
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub LeaveRequest.findById to return mock leave request
    const findByIdStub = sinon.stub(LeaveRequest, 'findById').resolves(existingLeaveRequest);

    // Mock request & response
    const req = {
      params: { id: leaveRequestId },
      body: { startDate: "2026-12-01", endDate: "2026-12-15" } // Update end date
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateLeaveRequest(req, res);

    // Assertions
    expect(existingLeaveRequest.leaveType).to.equal("annual");
    expect(existingLeaveRequest.startDate).to.equal("2026-12-01");
    expect(existingLeaveRequest.endDate).to.equal("2026-12-15");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if leave request is not found', async () => {
    const findByIdStub = sinon.stub(LeaveRequest, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateLeaveRequest(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Leave request not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(LeaveRequest, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateLeaveRequest(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});



describe('GetLeaveRequest Function Test', () => {

  it('should return tasks for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock leave request data
    const leaveRequests = [
      { _id: new mongoose.Types.ObjectId(), leaveType: "Annual", startDate: "2025-12-01", endDate: "2025-12-10", reason: "Family trip", userId },
      { _id: new mongoose.Types.ObjectId(), leaveType: "Sick", startDate: "2025-12-15", endDate: "2025-12-15", reason: "Illness", userId }
    ];

    // Stub LeaveRequest.find to return mock leave requests
    const findStub = sinon.stub(LeaveRequest, 'find').resolves(leaveRequests);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getLeaveRequests(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(leaveRequests)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub LeaveRequest.find to throw an error
    const findStub = sinon.stub(LeaveRequest, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getLeaveRequests(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteLeaveRequest Function Test', () => {

  it('should delete a leave request successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock leave request found in the database
    const leaveRequestId = new mongoose.Types.ObjectId();
    const leaveRequest = { _id: leaveRequestId };


    // Stub LeaveRequest.findByIdAndDelete to return the mock leave request
    const findByIdAndDeleteStub = sinon.stub(LeaveRequest, 'findByIdAndDelete').resolves(leaveRequestId);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteLeaveRequest(req, res);

    // Assertions
    expect(findByIdAndDeleteStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.json.calledWith({ message: 'Leave request removed' })).to.be.true;

    // Restore stubbed methods
    findByIdAndDeleteStub.restore();
  });

  it('should return 404 if leave request is not found', async () => {
    // Stub LeaveRequest.findByIdAndDelete to return null
    const findByIdAndDeleteStub = sinon.stub(LeaveRequest, 'findByIdAndDelete').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteLeaveRequest(req, res);

    // Assertions
    expect(findByIdAndDeleteStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Leave request not found' })).to.be.true;

    // Restore stubbed methods
    findByIdAndDeleteStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub LeaveRequest.findByIdAndDelete to throw an error
    const findByIdAndDeleteStub = sinon.stub(LeaveRequest, 'findByIdAndDelete').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteLeaveRequest(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdAndDeleteStub.restore();
  });

});


describe('ReviewLeave Function Test', () => {

  it('should update leave request successfully', async () => {
    // Mock leave request data
    const leaveRequestId = new mongoose.Types.ObjectId();
    const existingLeaveRequest = {
      _id: leaveRequestId,
      status: "Pending",
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub LeaveRequest.findById to return mock leave request
    const findByIdStub = sinon.stub(LeaveRequest, 'findById').resolves(existingLeaveRequest);

    // Mock request & response
    const req = {
      params: { id: leaveRequestId },
      body: { status: "Approved" } // Update status
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await reviewLeaveRequest(req, res);

    // Assertions
    expect(existingLeaveRequest.status).to.equal("Approved");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });



  it('should return 404 if leave request is not found', async () => {
    const findByIdStub = sinon.stub(LeaveRequest, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await reviewLeaveRequest(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Leave request not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(LeaveRequest, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await reviewLeaveRequest(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });

});