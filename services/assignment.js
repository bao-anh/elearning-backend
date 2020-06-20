const Assignment = require('../models/Assignment');

exports.getAllAssignment = async () => {
  return await Assignment.find();
};

exports.getAssignmentById = async (assignmentId) => {
  return await Assignment.findById(assignmentId);
};

exports.getAssignmentByIdWithPopulateProgress = async (
  assignmentId,
  userId
) => {
  return await Assignment.findById(assignmentId).populate({
    path: 'progressIds',
    match: { userId },
  });
};

exports.getAssignmentByIdWithPopulate = async (assignmentId, userId) => {
  return await Assignment.findById(assignmentId)
    .populate({
      path: 'questionIds',
      populate: { path: 'childrenIds' },
    })
    .populate({
      path: 'participantIds',
      populate: { path: 'userId' },
    })
    .populate({ path: 'progressIds', match: { userId } });
};
