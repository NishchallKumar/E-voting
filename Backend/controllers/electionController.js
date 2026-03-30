const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// Helper function to update election statuses based on dates
const updateElectionStatuses = async () => {
  const now = new Date();
  await Election.updateMany(
    { startDate: { $lte: now }, endDate: { $gt: now }, status: 'upcoming' },
    { status: 'active' }
  );
  await Election.updateMany(
    { endDate: { $lte: now }, status: 'active' },
    { status: 'ended' }
  );
};

// @route   POST api/elections
// @desc    Create an election (admin only)
// @access  Private/Admin
exports.createElection = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  try {
    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    await election.save();
    res.json(election);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/elections
// @desc    Get all elections (filtered by role)
// @access  Private
exports.getElections = async (req, res) => {
  try {
    await updateElectionStatuses(); // Ensure statuses are current

    let elections;
    if (req.user.role === 'admin') {
      elections = await Election.find().populate('createdBy', 'name');
    } else {
      elections = await Election.find({ status: { $in: ['upcoming', 'active'] } });
    }
    res.json(elections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/elections/:id
// @desc    Get single election
// @access  Private
exports.getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }
    res.json(election);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Election not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   PUT api/elections/:id
// @desc    Update election (admin only)
// @access  Private/Admin
exports.updateElection = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;

  try {
    let election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }

    // Update fields
    if (title) election.title = title;
    if (description) election.description = description;
    if (startDate) election.startDate = startDate;
    if (endDate) election.endDate = endDate;

    await election.save();
    res.json(election);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Election not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/elections/:id
// @desc    Delete election (admin only)
// @access  Private/Admin
exports.deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }

    // Delete associated candidates and votes
    await Candidate.deleteMany({ electionId: req.params.id });
    await Vote.deleteMany({ electionId: req.params.id });
    await election.remove();

    res.json({ msg: 'Election removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Election not found' });
    }
    res.status(500).send('Server error');
  }
};