const Participant = require('../models/Participant');

exports.getAllParticipant = async () => {
  return await Participant.find();
};

exports.getParticipantById = async (participantId) => {
  return await Participant.findById(participantId);
};

exports.getParticipantByIdWithPopulateTest = async (participantId) => {
  return await Participant.findById(participantId).populate({
    path: 'testId',
    populate: { path: 'questionIds', populate: { path: 'childrenIds' } },
  });
};
