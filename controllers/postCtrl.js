const Posts = require("../models/postModel");
const Comments = require("../models/commentModel");
const Users = require("../models/userModel");

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  createPost: async (req, res, next) => {
    try {
      const { content, images } = req.body;

      if (!content?.trim() && (!images || images.length === 0)) {
        return res.status(400).json({ msg: "Please add text or photo(s)." });
      }

      const newPost = new Posts({
        content,
        images,
        user: req.user._id,
      });
      await newPost.save();

      res.json({
        msg: "Post created successfully.",
        newPost: {
          ...newPost._doc,
          user: req.user,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  createAnonymousPost: async (req, res, next) => {
    try {
      const { content, images } = req.body;

      if (!content?.trim() && (!images || images.length === 0)) {
        return res.status(400).json({ msg: "Please add text or photo(s)." });
      }

      const newPost = new Posts({
        content,
        images,
        user: null,
        isAnonymous: true,
      });
      await newPost.save();

      res.json({
        msg: "Anonymous post created successfully.",
        newPost: newPost._doc,
      });
    } catch (err) {
      next(err);
    }
  },

  getAnonymousPosts: async (req, res, next) => {
    try {
      const features = new APIfeatures(
        Posts.find({ isAnonymous: true }),
        req.query
      ).paginating();

      const posts = await features.query.sort("-createdAt");

      res.json({
        msg: "Success",
        result: posts.length,
        posts,
      });
    } catch (err) {
      next(err);
    }
  },

  getPosts: async (req, res, next) => {
    try {
      const features = new APIfeatures(
        Posts.find({
          user: [...req.user.following, req.user._id],
        }),
        req.query
      ).paginating();
      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      res.json({
        msg: "Success",
        result: posts.length,
        posts,
      });
    } catch (err) {
      next(err);
    }
  },

  updatePost: async (req, res, next) => {
    try {
      const { content, images } = req.body;

      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      )
        .populate("user likes", "avatar username fullname")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      res.json({
        msg: "Post updated successfully.",
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  likePost: async (req, res, next) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post.length > 0) {
        return res
          .status(400)
          .json({ msg: "You have already liked this post" });
      }

      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        {
          new: true,
        }
      );

      if (!like) {
        return res.status(400).json({ msg: "Post does not exist." });
      }

      res.json({ msg: "Post liked successfully." });
    } catch (err) {
      next(err);
    }
  },

  unLikePost: async (req, res, next) => {
    try {
      const like = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        {
          new: true,
        }
      );

      if (!like) {
        return res.status(400).json({ msg: "Post does not exist." });
      }

      res.json({ msg: "Post unliked successfully." });
    } catch (err) {
      next(err);
    }
  },

  getUserPosts: async (req, res, next) => {
    try {
      const features = new APIfeatures(
        Posts.find({ user: req.params.id }),
        req.query
      ).paginating();
      const posts = await features.query.sort("-createdAt");

      res.json({
        posts,
        result: posts.length,
      });
    } catch (err) {
      next(err);
    }
  },

  getPost: async (req, res, next) => {
    try {
      const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      if (!post) {
        return res.status(400).json({ msg: "Post does not exist." });
      }

      res.json({ post });
    } catch (err) {
      next(err);
    }
  },

  getPostDiscover: async (req, res, next) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const query = {
        $or: [
          { user: { $nin: newArr }, isAnonymous: false },
          { isAnonymous: true }
        ]
      };

      if (req.user.interests && req.user.interests.length > 0) {
        query.category = { $in: req.user.interests };
      }

      const features = new APIfeatures(
        Posts.find(query),
        req.query
      ).paginating();

      const posts = await features.query
        .sort("-createdAt")
        .populate("user likes", "avatar username fullname followers")
        .populate({
          path: "comments",
          populate: {
            path: "user likes ",
            select: "-password",
          },
        });

      res.json({
        msg: "Success",
        result: posts.length,
        posts,
      });
    } catch (err) {
      next(err);
    }
  },

  deletePost: async (req, res, next) => {
    try {
      const post = await Posts.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
      });

      await Comments.deleteMany({ _id: { $in: post.comments } });

      res.json({
        msg: "Post deleted successfully.",
        newPost: {
          ...post._doc,
          user: req.user,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  reportPost: async (req, res, next) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        reports: req.user._id,
      });
      if (post.length > 0) {
        return res
          .status(400)
          .json({ msg: "You have already reported this post" });
      }

      const report = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { reports: req.user._id },
        },
        {
          new: true,
        }
      );

      if (!report) {
        return res.status(400).json({ msg: "Post does not exist." });
      }

      res.json({ msg: "Post reported successfully." });
    } catch (err) {
      next(err);
    }
  },

  savePost: async (req, res, next) => {
    try {
      const user = await Users.find({
        _id: req.user._id,
        saved: req.params.id,
      });
      if (user.length > 0) {
        return res
          .status(400)
          .json({ msg: "You have already saved this post." });
      }

      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: { saved: req.params.id },
        },
        {
          new: true,
        }
      );

      if (!save) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      res.json({ msg: "Post saved successfully." });
    } catch (err) {
      next(err);
    }
  },

  unSavePost: async (req, res, next) => {
    try {
      const save = await Users.findOneAndUpdate(
        { _id: req.user._id },
        {
          $pull: { saved: req.params.id },
        },
        {
          new: true,
        }
      );

      if (!save) {
        return res.status(400).json({ msg: "User does not exist." });
      }

      res.json({ msg: "Post removed from collection successfully." });
    } catch (err) {
      next(err);
    }
  },

  getSavePost: async (req, res, next) => {
    try {
      const features = new APIfeatures(
        Posts.find({ _id: { $in: req.user.saved } }),
        req.query
      ).paginating();

      const savePosts = await features.query.sort("-createdAt");

      res.json({
        savePosts,
        result: savePosts.length,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = postCtrl;
