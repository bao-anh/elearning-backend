const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {
  getUserByEmailWithPopulate,
  getUserByIdWithPopulate,
} = require('../services/user');
const auth = require('../middleware/auth');

const User = require('../models/User');

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please enter a vaild email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await getUserByEmailWithPopulate(email);

      if (!user) {
        return res.status(400).json({ msg: 'User is not exist' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credential' });
      }

      const payload = {
        user: {
          _id: user._id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token, user });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await getUserByIdWithPopulate(req.user._id);

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
