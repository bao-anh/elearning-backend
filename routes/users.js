const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get('/', (req, res) => {
  res.send({ msg: 'Get all users' });
});

module.exports = router;
