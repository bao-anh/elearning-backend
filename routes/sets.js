const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const { handleUnprocessableEntity } = require('../util');
const { getUserByIdWithPopulateSet, getUserById } = require('../services/user');
const { getSetByIdWithPopulate, getSetById } = require('../services/set');
const { getTermById } = require('../services/term');
const auth = require('../middleware/auth');
const parser = require('../config/parse');

const Set = require('../models/Set');
const Term = require('../models/Term');
const Remember = require('../models/Remember');

// @route   GET api/sets
// @desc    Get set by userId
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userSet = await getUserByIdWithPopulateSet(req.user._id);

    handleUnprocessableEntity(userSet, res);
    res.json(userSet.setIds);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET api/sets
// @desc    Get set by setId
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const set = await getSetByIdWithPopulate(req.params.id, req.user._id);

    handleUnprocessableEntity(set, res);
    res.json(set);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/sets
// @desc    Create a set
// @access  Private
router.post('/', auth, parser.single('imageURL'), async (req, res) => {
  try {
    const { name, description, visiable, editable } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const set = new Set({
        name,
        ownerId: req.user._id,
        description,
        imageURL: req.file ? req.file.path : null,
        visiable,
        editable,
        termIds: [],
      });

      await set.save({ session });

      const user = await getUserById(req.user._id);
      user.setIds.push(set._id);

      await user.save({ session });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Something when wrong' });
    }

    await session.commitTransaction();
    session.endSession();

    res.json('Add new set successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/sets/:id
// @desc    Add set by link
// @access  Private
router.post('/:id', auth, parser.single('imageURL'), async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await getUserById(req.user._id);
      user.setIds.push(req.params.id);
      await user.save({ session });

      const set = await getSetById(req.params.id);

      for (i = 0; i < set.termIds.length; i++) {
        const term = await getTermById(set.termIds[i]._id);
        console.log(term);
        const remember = new Remember({
          userId: req.user._id,
          correct: 0,
          attempt: 0,
        });
        await remember.save({ session });
        term.rememberIds.push(remember._id);
        await term.save({ session });
      }
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Something when wrong' });
    }

    await session.commitTransaction();
    session.endSession();

    res.json('Set added successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST api/sets/:id/terms
// @desc    Create a term in set
// @access  Private
router.post('/:id/terms', auth, parser.single('imageURL'), async (req, res) => {
  try {
    const { name, definition, imageName } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const remember = new Remember({
        userId: req.user._id,
        correct: 0,
        attempt: 0,
      });

      await remember.save({ session });

      const term = new Term({
        name,
        definition,
        imageURL: req.file ? req.file.path : null,
        imageName,
        rememberIds: [remember._id],
      });

      await term.save({ session });

      const set = await getSetById(req.params.id);
      set.termIds.push(term._id);

      await set.save({ session });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Something when wrong' });
    }

    await session.commitTransaction();
    session.endSession();

    res.json('Add new term successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/sets/terms/:id/with-image
// @desc    Update a term with image change in set
// @access  Private
router.put(
  '/terms/:id/with-image',
  auth,
  parser.single('imageURL'),
  async (req, res) => {
    try {
      const { name, definition, imageName } = req.body;

      const term = await getTermById(req.params.id);
      term.name = name;
      term.definition = definition;
      term.imageName = imageName;
      term.imageURL = req.file ? req.file.path : null;

      await term.save();

      res.json('Update term successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/sets/terms/:id/without-image
// @desc    Update a term without image change in set
// @access  Private
router.put('/terms/:id/without-image', auth, async (req, res) => {
  try {
    const { name, definition } = req.body;

    const term = await getTermById(req.params.id);
    term.name = name;
    term.definition = definition;

    await term.save();

    res.json('Update term successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/sets/terms/:id/without-image
// @desc    Update a term without image change in set
// @access  Private
router.delete('/:id/terms/:termId', auth, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const set = await getSetById(req.params.id);
      const termIndex = set.termIds.indexOf(req.params.termId);
      set.termIds.splice(termIndex, 1);

      await set.save({ session });

      await Term.findByIdAndDelete(req.params.termId);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      console.error(err);
      res.status(400).json({ msg: 'Something when wrong' });
    }

    await session.commitTransaction();
    session.endSession();

    res.json('Delete term successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/sets/:id/with-image
// @desc    Update a set with image change
// @access  Private
router.put(
  '/:id/with-image',
  auth,
  parser.single('imageURL'),
  async (req, res) => {
    try {
      const { name, description, visiable, editable } = req.body;

      const set = await getSetById(req.params.id);
      set.name = name;
      set.description = description;
      set.visiable = visiable;
      set.editable = editable;
      set.imageURL = req.file ? req.file.path : null;

      await set.save();

      res.json('Update set successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/sets/:id/without-image
// @desc    Update a set without image change
// @access  Private
router.put('/:id/without-image', auth, async (req, res) => {
  try {
    const { name, description, visiable, editable } = req.body;

    const set = await getSetById(req.params.id);
    set.name = name;
    set.description = description;
    set.visiable = visiable;
    set.editable = editable;

    await set.save();

    res.json('Update set successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
