const Scale = require('../models/Scale');

exports.getOneScale = async () => {
  return await Scale.findOne({});
};
