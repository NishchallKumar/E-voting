const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// Create election (admin only)
exports.createElection = async (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  try {
    const election = new Election({
      title,
      description,
      startDate,
      endDate,
      createdBy: req.user.id
    });
    await election.save();
    res.json(election);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get all elections (for voters: only active/upcoming? admin gets all)
exports.getElections = async (req, res) => {
  try {
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

// Update election status automatically (could be a cron job, but for simplicity we update on each request)
// Add a helper function to update status based on dates
const updateElectionStatus = async () => {
  const now = new Date();
  await Election.updateMany({ startDate: { $lte: now }, endDate: { $gt: now }, status: 'upcoming' }, { status: 'active' });
  await Election.updateMany({ endDate: { $lte: now }, status: 'active' }, { status: 'ended' });
};

// In getElections, call updateElectionStatus() to keep status up-to-date.