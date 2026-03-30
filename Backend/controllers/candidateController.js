const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// @route   POST api/candidates
// @desc    Add a candidate to an election (admin only)
// @access  Private/Admin
exports.addCandidate = async (req, res) => {
  const { name, party, electionId } = req.body;

  try {
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ msg: 'Election not found' });
    }

    const candidate = new Candidate({
      name,
      party,
      electionId,
    });

    await candidate.save();
    res.json(candidate);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/candidates/election/:electionId
// @desc    Get all candidates for an election
// @access  Private
exports.getCandidatesByElection = async (req, res) => {
  try {
    const candidates = await Candidate.find({ electionId: req.params.electionId });
    res.json(candidates);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/candidates/:id
// @desc    Delete a candidate (admin only)
// @access  Private/Admin
exports.deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ msg: 'Candidate not found' });
    }

    await candidate.remove();
    res.json({ msg: 'Candidate removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Candidate not found' });
    }
    res.status(500).send('Server error');
  }
};