const express = require('express');
const router = express.Router();

// @route   GET api/topics
// @desc    Get all topics
// @access  Private
router.get('/', (req, res) => {
  res.send({ msg: 'Get all topics' });
});

module.exports = router;
