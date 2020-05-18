const express = require('express');
const router = express.Router();

// @route   POST api/auth
// @desc    Register a user
// @access  Public
router.post('/', (req, res) => {
  res.send({ msg: 'User created successfully' });
});

// @route   GET api/auth
// @desc    Auth user and get token
// @access  Public
router.get('/', (req, res) => {
  res.send({ msg: 'User logged in successfully' });
});

module.exports = router;
