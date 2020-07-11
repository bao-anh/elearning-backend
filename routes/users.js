const express = require('express');
const router = express.Router();
const parser = require('../config/parse');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { handleUnprocessableEntity } = require('../util');
const {
  getUserByIdWithPopulateCourse,
  getUserByEmail,
  getUserById,
} = require('../services/user');

const User = require('../models/User');

// @route   GET api/users/:id/courses
// @desc    Get all user's courses and user's progress
// @access  Private
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const courses = await getUserByIdWithPopulateCourse(req.user._id);
    handleUnprocessableEntity(courses, res);
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
      let user = await getUserByEmail(email);
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
    const user = await getUserById(req.user._id);
    user.courseIds.push(req.body.courseId);
    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   PUT api/users
// @desc    Update user's info with image
// @access  Private
router.put('/with-image', auth, parser.single('imageURL'), async (req, res) => {
  try {
    const { name } = req.body;

    const user = await getUserById(req.user._id);

    user.name = name;
    user.imageURL = req.file ? req.file.path : null;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/users
// @desc    Update user's info without image
// @access  Private
router.put('/without-image', auth, async (req, res) => {
  try {
    const { name } = req.body;

    const user = await getUserById(req.user._id);

    user.name = name;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
