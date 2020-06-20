const Term = require('../models/Term');

exports.getTermById = async (termId) => {
  return await Term.findById(termId);
};
