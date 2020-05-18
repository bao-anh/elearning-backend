const express = require('express');
const router = express.Router();

// @route   GET api/courses
// @desc    Get all courses
// @access  Private
router.get('/', (req, res) => {
  res.send({ msg: 'Get all courses' });
});

module.exports = router;
