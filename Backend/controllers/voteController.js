const Vote = require('../models/Vote');
const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// @route   POST api/votes
// @desc    Cast a vote
// @access  Private
exports.castVote = async (req, res) => {
  const { electionId, candidateId } = req.body;
  const userId = req.user.id;

  try {
    // Check election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }
    if (election.status !== 'active') {
      return res.status(400).json({ msg: 'Voting is not active for this election' });
    }

    // Check if user already voted in this election
    const existingVote = await Vote.findOne({ userId, electionId });
    if (existingVote) {
      return res.status(400).json({ msg: 'You have already voted in this election' });
    }

    // Check candidate belongs to election
    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.electionId.toString() !== electionId) {
      return res.status(400).json({ msg: 'Invalid candidate' });
    }

    // Create vote record
    const vote = new Vote({
      userId,
      electionId,
      candidateId,
    });
    await vote.save();

    // Increment candidate's vote count
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    res.json({ msg: 'Vote cast successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      // Duplicate key error (shouldn't happen due to check above, but just in case)
      return res.status(400).json({ msg: 'You have already voted in this election' });
    }
    res.status(500).send('Server error');
  }
};

// @route   GET api/votes/results/:electionId
// @desc    Get results of an election (only if ended)
// @access  Private
exports.getResults = async (req, res) => {
  const { electionId } = req.params;

  try {
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }
    if (election.status !== 'ended') {
      return res.status(400).json({ msg: 'Results are not yet available for this election' });
    }

    const candidates = await Candidate.find({ electionId }).sort({ voteCount: -1 });
    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
    const winner = candidates[0] || null;

    res.json({
      election,
      candidates,
      totalVotes,
      winner,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};