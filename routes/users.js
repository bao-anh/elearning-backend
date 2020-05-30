const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

// @route   GET api/users/:id/courses
// @desc    Get all user's courses and user's progress
// @access  Private
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const courses = await User.findById(req.params.id)
      .populate({
        path: 'courseIds',
      })
      .populate({
        path: 'courseIds',
        populate: { path: 'progressIds', match: { userId: req.params.id } },
      });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/users
// @desc    create a user
// @access  Private
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already existed' });
      }
      user = new User({
        name,
        email,
        password,
        roll: 0,
        courseIds: [],
        toeicId: null,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

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

// @route   GET api/users/courses
// @desc    Update courseIds in user
// @access  Private
router.put('/courses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.courseIds.push(req.body.courseId);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

module.exports = router;
