const express = require('express');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  addCandidate,
  getCandidatesByElection,
  deleteCandidate,
} = require('../controllers/candidateController');

const router = express.Router();

router.get('/election/:electionId', auth, getCandidatesByElection);
router.post('/', auth, admin, addCandidate);
router.delete('/:id', auth, admin, deleteCandidate);

module.exports = router;