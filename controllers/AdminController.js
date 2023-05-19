const Candidate = require('../models/Candidate');
const User = require('../models/Usermodel');
const CastVote = require('../models/CastVote');
const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const register_candidate = async (req, res) => {
  try {
    const candidate = new Candidate({
      candidate_name: req.body.candidate_name,
      cnic: req.body.cnic,
      dob: req.body.dob,
      phonenumber: req.body.phonenumber,
      partyname: req.body.partyname,
      qualification: req.body.qualification
    });

    const candidateData = await Candidate.findOne({ cnic: req.body.cnic });
    if (candidateData) {
      res.status(200).send({ success: false, msg: "This candidate already exists!" });
    }
    else {
      const candidate_data = await candidate.save();
      res.status(200).send({ success: true, data: candidate_data });
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
}
// //Login Admin
const Login_Admin = async (req, res) => {
  try {
    const { cnic, password } = req.body;

    const user = await User.findOne({ cnic});
    if (!user) {
      return res.status(403).send({ success: false, msg: "Admin Data is Not Valid!" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).send({ success: false, msg: "Invalid Id or password" });
    }
    // Generate JWT token
    const token = jwt.sign({ userid: user._id, isAdmin: user.isAdmin }, config.secret_jwt, { expiresIn: '1h' });
    // Successful login
    res.status(200).send({ success: true, token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to Login in Admin Pannel!!", error: error.message });
  }
};
// DELETE
const delete_candidate = async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.status(200).json("Candidate has been deleted");
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}
//update candidate details
const update_candidate = async (req, res) => {
  try {
    const updatedcandidate = await Candidate.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedcandidate)
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}
// display all candidates.
const display_candidates = async (req, res) => {
  try {
    const Candidates = await Candidate.find();
    res.status(200).json(Candidates);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}
// display all voters
const display_voters = async (req, res) => {
  try {
    const voters = await Voter.find();
    res.status(200).json(voters);
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
}

const displayResult = async (req, res) => {
  try {
    const results = await CastVote.aggregate([
      {
        $group: {
          _id: '$candidate_id',
          votes: { $sum: 1 },
        },
      },
      {
        $sort: { votes: -1 },
      },
      {
        $lookup: {
          from: 'candidates',
          localField: '_id',
          foreignField: '_id',
          as: 'candidate',
        },
      },
      {
        $unwind: '$candidate',
      },
      {
        $project: {
          _id: 0,
          candidate_id: '$_id',
          candidate_name: '$candidate.candidate_name',
          partyname: '$candidate.partyname',
          votes: 1,
        },
      },
    ]);

    const winner = results.length > 0 ? results[0] : null;
    let winnerName = null;
    if (winner) {
      winnerName = winner.candidate_name;
      winnerparty = winner.partyname;
      console.log(winnerparty, winnerName);
    }

    res.status(200).json({ success: true, data: results, winnerName });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};






module.exports = {
  register_candidate,
  delete_candidate,
  update_candidate,
  display_candidates,
  displayResult,
  Login_Admin,
  display_voters

}