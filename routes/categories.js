const express = require('express');
const router = express.Router();

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', (req, res) => {
  res.send({ msg: 'Get all categories' });
});

// @route   POST api/categories
// @desc    Create a new categories
// @access  Private
router.post('/', (req, res) => {
  res.send({ msg: 'Category created successfully' });
});

// @route   PUT api/categories
// @desc    Update a category by id
// @access  Private
router.put('/:id', (req, res) => {
  res.send({ msg: 'Category updated successfully' });
});

// @route   DELETE api/categories
// @desc    Delete a category by id
// @access  Private
router.delete('/', (req, res) => {
  res.send({ msg: 'Category deleted successfully' });
});

module.exports = router;
