const Category = require('../models/Category');

exports.getAllCategory = async () => {
  return await Category.find();
};

exports.getAllCategoryWithPopulate = async () => {
  return await Category.find().populate({ path: 'childrenIds' });
};

exports.getCategoryById = async (categoryId) => {
  return await Category.findById(categoryId);
};

exports.getCategoryByIdWithPopulate = async (categoryId, userId) => {
  return await Category.findById(categoryId).populate({
    path: 'courseIds',
    populate: { path: 'progressIds', match: { userId } },
  });
};
