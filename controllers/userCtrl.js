const Users = require("../models/userModel");

const userCtrl = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({
        $or: [
          { username: { $regex: req.query.username, $options: "i" } },
          { fullname: { $regex: req.query.username, $options: "i" } },
        ],
      })
        .limit(10)
        .select("fullname username avatar");

      res.json({ users });
    } catch (err) {
      next(err);
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id)
        .select("-password")
        .populate("followers following", "-password");

      if (!user) {
        return res.status(400).json({ msg: "requested user does not exist." });
      }

      res.json({ user });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const {
        avatar,
        fullname,
        mobile,
        address,
        story,
        website,
        gender,
      } = req.body;
      if (!fullname) {
        return res.status(400).json({ msg: "Please add your full name." });
      }

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { avatar, fullname, mobile, address, story, website, gender }
      );

      res.json({ msg: "Profile updated successfully." });
    } catch (err) {
      next(err);
    }
  },

  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user._id,
      });
      if (user.length > 0)
        return res
          .status(500)
          .json({ msg: "You are already following this user." });



      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: {
            followers: req.user._id
          },
        },
        { new: true }
      ).populate("followers following", "-password");

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { following: req.params.id } },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      next(err);
    }
  },

  unfollow: async (req, res) => {
    try {
      

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { followers: req.user._id }
        },
        { new: true }
      ).populate('followers following', '-password');

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { following: req.params.id } },
        { new: true }
      );

      res.json({ newUser });
    } catch (err) {
      next(err);
    }
  },

  suggestionsUser: async (req, res, next) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;
      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        {
          $lookup: {
            from: "users",
            localField: "followers",
            foreignField: "_id",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "following",
            foreignField: "_id",
            as: "following",
          },
        },
      ]).project("-password");

      return res.json({
        users,
        result: users.length,
      });
    } catch (err) {
      next(err);
    }
  },

  updateInterests: async (req, res, next) => {
    try {
      const { interests } = req.body;

      await Users.findOneAndUpdate(
        { _id: req.user._id },
        { interests }
      );

      res.json({ msg: "Interests updated successfully." });
    } catch (err) {
      next(err);
    }
  },

  updateAvatarConfig: async (req, res, next) => {
    try {
      const { avatarConfig } = req.body;

      const updatedUser = await Users.findOneAndUpdate(
        { _id: req.user._id },
        { avatarConfig, hasCustomAvatar: true },
        { new: true }
      ).select('-password');

      res.json({ msg: "Avatar saved successfully.", user: updatedUser });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userCtrl;
