const Progress = require('../models/Progress');

exports.getAllProgress = async () => {
  return await Progress.find();
};

exports.getProgressById = async (progressId) => {
  return await Progress.findById(progressId);
};
