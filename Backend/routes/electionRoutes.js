const express = require('express');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const {
  createElection,
  getElections,
  getElectionById,
  updateElection,
  deleteElection,
} = require('../controllers/electionController');

const router = express.Router();

router.get('/', auth, getElections);
router.get('/:id', auth, getElectionById);
router.post('/', auth, admin, createElection);
router.put('/:id', auth, admin, updateElection);
router.delete('/:id', auth, admin, deleteElection);

module.exports = router;