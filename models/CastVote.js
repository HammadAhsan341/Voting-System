const mongoose = require('mongoose');

const castVoteSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  candidate_name: {
    type: String,
    ref: 'Candidate',
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const CastVote = mongoose.model('CastVote', castVoteSchema);

module.exports = CastVote;
