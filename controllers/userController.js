const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  User.find({})
    .populate({
      path: "thoughts",
      select: "-__v -username",
    })
    .populate({
      path: "friends",
      select: "-__v",
    })
    .select("-__v")
    .then((dbUserData) => {
      res.status(200).json({
        status: "success",
        data: { users: dbUserData },
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

exports.getUserById = async (req, res) => {
  console.log(req.params.id);
  User.findById(req.params.id)
    .populate({
      path: "thoughts",
      select: "-__v -username",
    })
    .populate({
      path: "friends",
      select: "-__v",
    })
    .select("-__v")
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({
          status: "fail",
          message: "There is no user with that id.",
        });
      }
      res.status(200).json({
        status: "success",
        user: dbUserData,
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

exports.createUser = async (req, res) => {
  User.create(req.body)
    .then((dbUserData) => {
      res.status(201).json({
        status: "success",
        data: dbUserData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.updateUser = async (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  })
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({
          status: "fail",
          message: "There is no user with that id.",
        });
      }
      res.status(200).json({
        status: "success",
        user: dbUserData,
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

exports.deleteUser = async (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((dbUserData) => {
      if (!dbUserData) {
        return res.status(404).json({
          status: "fail",
          message: "There is no user with that id.",
        });
      }
      res.status(200).json({
        status: "success",
        user: dbUserData,
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

exports.addFriend = async (req, res) => {
  try {
    user = await User.findById(req.params.id);
    friend = await User.findById(req.params.friendId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that ID!",
      });
    }

    if (!friend) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that ID to add as a friend!",
      });
    }

    user.friends.addToSet(req.params.friendId);
    friend.friends.addToSet(req.params.id);

    await user.save();
    await friend.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
        friend,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "There has been an error!",
      error: err,
    });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    user = await User.findById(req.params.id);
    friend = await User.findById(req.params.friendId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that ID!",
      });
    }

    if (!friend) {
      return res.status(404).json({
        status: "fail",
        message: "There is no user with that ID to add as a friend!",
      });
    }

    user.friends.pull(req.params.friendId);
    friend.friends.pull(req.params.id);

    await user.save();
    await friend.save();

    res.status(200).json({
      status: "success",
      data: {
        user,
        friend,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "There has been an error!",
      error: err,
    });
  }
};
