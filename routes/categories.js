const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const Category = require('../models/Category');

// @route   GET api/categories
// @desc    Get all categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/categories/get-all-with-course
// @desc    Get all categories with courses
// @access  Private
router.get('/get-all-with-course', auth, async (req, res) => {
  try {
    const category = await Category.find().populate({ path: 'childrenIds' });
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   GET api/categories/:id/courses
// @desc    Get courses by categoryId
// @access  Private
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const course = await Category.findById(req.params.id).populate({
      path: 'courseIds',
    });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   POST api/categories
// @desc    Create a new categories
// @access  Private
router.post(
  '/',
  auth,
  [check('name', 'Name is required').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, childrenIds, courseIds } = req.body;
    try {
      const newCategory = new Category({
        name,
        childrenIds: childrenIds || [],
        courseIds: courseIds || [],
      });

      await newCategory.save();
      res.json(newCategory);
    } catch (err) {
      console.error(err);
      res.status(500).send('Sever Error');
    }
  }
);

// @route   PUT api/categories
// @desc    Update a category by id
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, childrenIds, courseIds } = req.body;

  try {
    let category = await Category.findById(req.params.id);
    category.name = name ? name : category.name;
    category.childrenIds = childrenIds ? childrenIds : category.childrenIds;
    category.courseIds = courseIds ? courseIds : category.courseIds;
    await category.save();
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sever Error');
  }
});

// @route   DELETE api/categories
// @desc    Delete a category by id
// @access  Private
router.delete('/', (req, res) => {
  res.send({ msg: 'Category deleted successfully' });
});

module.exports = router;
