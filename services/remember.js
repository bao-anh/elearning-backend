const Remember = require('../models/Remember');

exports.getRememberById = async (termId) => {
  return await Remember.findById(termId);
};
