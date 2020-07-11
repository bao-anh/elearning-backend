const { handleUnprocessableEntity } = require('../util');

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

exports.getAssignmentByIdWithPopulateComment = async (assigmentId) => {
  return await Assignment.findById(assigmentId)
    .populate({
      path: 'commentIds',
      populate: [
        {
          path: 'userId',
          select: 'name imageURL',
        },
        {
          path: 'childrenIds',
          populate: {
            path: 'userId',
            select: 'name imageURL',
          },
        },
      ],
    })
    .select('commentIds');
};

const getAssignmentByIdWithPopulate = async (assignmentId, userId) => {
  return await Assignment.findById(assignmentId)
    .populate({
      path: 'questionIds',
      populate: { path: 'childrenIds' },
    })
    .populate({
      path: 'participantIds',
      populate: { path: 'userId' },
    })
    .populate({ path: 'progressIds', match: { userId } })
    .populate({
      path: 'commentIds',
      populate: [
        {
          path: 'userId',
          select: 'name imageURL',
        },
        {
          path: 'childrenIds',
          populate: {
            path: 'userId',
            select: 'name imageURL',
          },
        },
      ],
    });
};

exports.getAssignmentByIdAndReverseParticipant = async (
  assignmentId,
  userId,
  res
) => {
  const assigment = await getAssignmentByIdWithPopulate(assignmentId, userId);

  handleUnprocessableEntity(assigment, res);
  let newAssignment = assigment;
  newAssignment.participantIds = assigment.participantIds.reverse();
  return newAssignment;
};
