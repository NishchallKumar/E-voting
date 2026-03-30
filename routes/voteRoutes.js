const express = require('express');
const auth = require('../middleware/authMiddleware');
const { castVote, getResults } = require('../controllers/voteController');
const router = express.Router();

router.post('/', auth, castVote);
router.get('/results/:electionId', auth, getResults);

module.exports = router;