const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  electionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true,
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can vote only once per election
VoteSchema.index({ userId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);