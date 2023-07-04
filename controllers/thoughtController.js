const User = require("../models/User");
const Thought = require("../models/Thought");
const Reaction = require("../models/Reaction");

exports.getAllThoughts = async (req, res) => {
  Thought.find({})
    .populate({
      path: "reactions",
      select: "-__v",
    })
    .select("-__v")
    .sort({ _id: -1 })
    .then((dbThoughtData) => res.json(dbThoughtData))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
};

exports.getThoughtById = async (req, res) => {
  Thought.findById(req.params.id)
    .populate({
      path: "reactions",
      select: "-__v",
    })
    .select("-__v")
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({
          status: "fail",
          message: "There is no thought with that ID!",
        });
      }
      res.status(200).json({
        status: "success",
        thought: dbThoughtData,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: "fail",
        message: "There has been an error!",
        error: err,
      });
    });
};

exports.createThought = async (req, res) => {
  try {
    // Check if user with this username exists
    user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that ID!",
      });
    }

    // Create new thought
    thought = await Thought.create(req.body);

    // Update user with new thought
    user.thoughts.push(thought.id);
    user.save();

    res.status(201).json({
      status: "success",
      thought,
      updateUser: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "There has been an error!",
    });
  }
};

exports.updateThought = async (req, res) => {
  Thought.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        return res.status(404).json({
          status: "fail",
          message: "There is no thought with that ID!",
        });
      }
      res.status(200).json({
        status: "success",
        thought: dbThoughtData,
      });
    })
    .catch((err) =>
      res.status(500).json({
        status: "fail",
        message: "There has been an error!",
        error: err,
      })
    );
};

exports.deleteThought = async (req, res) => {
  try {
    // Create new thought
    thought = await Thought.findByIdAndDelete(req.params.id);

    // Update user with new thought
    user = await User.findOne({ username: thought.username });
    user.thoughts.pull(thought.id);
    user.save();

    res.status(201).json({
      status: "success",
      deletedThought: thought,
      updateUser: user,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "There has been an error!",
    });
  }
};

exports.addReaction = async (req, res) => {
  try {
    // Create new reaction
    reaction = await Reaction.create(req.body);

    // Update thought with new reaction
    thought = await Thought.findById(req.params.id);
    thought.reactions.addToSet(reaction._id);
    thought.save();

    res.status(201).json({
      status: "success",
      reaction,
      updatedThought: thought,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "There has been an error!",
      error: err.message,
    });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    // Create new thought
    reaction = await Reaction.findByIdAndDelete(req.params.reactionId);

    // Update user with new thought
    thought = await Thought.findById(req.params.id);
    thought.reactions.pull(reaction.id);
    thought.save();

    res.status(201).json({
      status: "success",
      reaction,
      updatedThought: thought,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "There has been an error!",
    });
  }
};
