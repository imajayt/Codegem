import Streak from "../models/streak.js";
import Comment from "../models/submodels/comment.js";
import Share from "../models/submodels/share.js";
import Group from "../models/group.js";
import User from "../models/user.js";
import Collection from "../models/collection.js";
import { createError, createNotification, isUndefined } from "../utils/functions.js";

export const getStreaks = async (req, res, next) => {
  try {
    const result = await Streak.find()
      .sort({ createdAt: -1 })
      .populate("user")
      .exec();
    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const getUserStreaks = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await Streak.find({ user: userId }).populate("user").exec();
    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const getLikedStreaks = async (req, res, next) => {
  try {
    const result = await Streak.find({ likes: { $in: [req.user._id] } })
      .populate("user")
      .exec();
    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const getSavedStreaks = async (req, res, next) => {
  try {
    const result = await Collection.findOne(
      { name: "Saved", owner: req.user._id },
      { streaks: 1, _id: 0 }
    )
      .populate("streaks")
      .exec();
    res.status(200).json(result.streaks);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const createStreak = async (req, res, next) => {
  try {
    let { title, streak, groupId, ...rest } = req.body;
    if (isUndefined(title) || isUndefined(streak[0].code))
      return next(createError(res, 400, "Title and Streak, both are required"));

    const userId = req.user._id;

    var result;
    if (groupId) {
      result = await Streak.create({
        user: userId,
        title,
        streak,
        group: groupId,
        ...rest,
      });
      await Group.findByIdAndUpdate(
        groupId,
        { $addToSet: { streaks: result._id } },
        { new: true }
      );
    } else {
      result = await Streak.create({
        user: userId,
        title,
        streak,
        ...rest,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const updateStreak = async (req, res, next) => {
  try {
    const { streakId } = req.params;

    const result = await Streak.findByIdAndUpdate(
      streakId,
      { $set: req.body },
      { new: true }
    );

    await createNotification("Streak Update", "You updated your post.");

    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const likeStreak = async (req, res, next) => {
  try {
    const { streakId } = req.params;

    const streak = await Streak.findById(streakId);
    if (!streak) return next(createError(res, 403, "Streak not exist."));

    const userHasLiked = streak.likes.includes(req.user?._id);

    if (userHasLiked) {
      await Streak.findByIdAndUpdate(
        streakId,
        { $pull: { likes: req.user?._id } },
        { new: true }
      );
      res.status(200).json({ message: "Removed like successfully" });
    } else {
      await Streak.findByIdAndUpdate(
        streakId,
        { $addToSet: { likes: req.user?._id } },
        { new: true }
      );
      res.status(200).json({ message: "Liked successfully" });
    }
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const shareStreak = async (req, res, next) => {
  try {
    const { streakId } = req.params;

    let { friendIds } = req.body; // ids of users

    // Validate that friendIds is an array of valid user IDs
    if (
      !Array.isArray(friendIds) ||
      friendIds.some((userId) => typeof userId !== "string")
    ) {
      return res.status(400).json({ error: "Invalid friendIds format" });
    }
    let streak = await Streak.findById(streakId);
    if (!streak) {
      return res.status(404).json({ error: "Streak not found" });
    }

    const shares = await Promise.all(
      friendIds.map(async (id) => {
        const shareObj = await Share.create({
          from: req.user._id,
          to: id,
          post: streakId,
          postType: "streak",
          sharedTo: "friend", // friend/group
        });
        return shareObj._id;
      })
    );

    ////// sharing includes updating sender, receiver and the post being shared //////
    // updating streak, adding user to shares array
    await Promise.all(
      shares.map(async (shareId) => {
        await Streak.findByIdAndUpdate(
          streakId,
          { $push: { shares: shareId } },
          { new: true }
        );
      })
    );

    // updating each friend, adding shares to receiver
    await Promise.all(
      shares.map(async (shareId, index) => {
        await User.findByIdAndUpdate(
          friendIds[index],
          { $addToSet: { receivedShares: shareId } },
          { new: true }
        );
      })
    );

    // updating current user, adding shares to sender
    await Promise.all(
      shares.map(async (shareId) => {
        await User.findByIdAndUpdate(
          req.user._id,
          { $addToSet: { sentShares: shareId } },
          { new: true }
        );
      })
    );

    res.status(200).json({ message: "Streak shared successfully." });
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const shareStreakInGroups = async (req, res, next) => {
  try {
    const { streakId } = req.params;
    let { groupIds } = req.body;

    // Validate that friendIds is an array of valid user IDs
    if (
      !Array.isArray(groupIds) ||
      groupIds.some((groupId) => typeof groupId !== "string")
    ) {
      return res.status(400).json({ error: "Invalid groupIds format" });
    }

    const streak = await Streak.findById(streakId);
    if (!streak) {
      return res.status(404).json({ error: "Streak not found" });
    }

    const shares = await Promise.all(
      groupIds.map(async (id) => {
        const shareObj = await Share.create({
          from: req.user._id,
          to: id,
          post: streakId,
          postType: "streak",
          sharedTo: "group", // friend/group
        });
        return shareObj._id;
      })
    );

    ////// sharing includes updating sender, receiver and the post being shared //////
    // updating streak, adding user to shares array
    await Promise.all(
      shares.map(async (shareId) => {
        await Streak.findByIdAndUpdate(
          streakId,
          { $push: { shares: shareId } },
          { new: true }
        );
      })
    );

    // updating groups, adding streakId to shares array
    await Promise.all(
      shares.map(async (shareId, index) => {
        await Group.findByIdAndUpdate(
          groupIds[index],
          { $push: { shares: shareId } }, // shareId is the id of the share of post
          { new: true }
        );
      })
    );

    // updating current user, adding shares to sender
    await Promise.all(
      shares.map(async (shareId) => {
        await User.findByIdAndUpdate(
          req.user._id,
          { $addToSet: { sentShares: shareId } },
          { new: true }
        );
      })
    );

    res.status(200).json({ message: "Streak shared successfully." });
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const saveStreak = async (req, res, next) => {
  try {
    const { streakId } = req.params;

    const streak = await Streak.findById(streakId);
    if (!streak) return next(createError(res, 403, "Streak not exist."));

    const findedCollection = await Collection.findOne({
      name: "Saved",
      owner: req.user._id,
    });
    await Collection.findByIdAndUpdate(
      findedCollection._id,
      { $addToSet: { streaks: streakId } },
      { new: true }
    );

    res.status(200).json({ message: "Streak saved successfully." });
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const saveStreakInCollections = async (req, res, next) => {
  try {
    const { streakId } = req.params;
    const { collections } = req.body;

    const streak = await Streak.findById(streakId);
    if (!streak) return next(createError(res, 403, "Streak not exist."));

    await Promise.all(
      collections.map(
        async (collectionId) =>
          await Collection.findByIdAndUpdate(collectionId, {
            $addToSet: { streaks: streakId },
          })
      )
    );

    res
      .status(200)
      .json({ message: "Streak saved in collections successfully." });
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const dislikeStreak = async (req, res, next) => {
  try {
    const { streakId } = req.params;

    const streak = await Streak.findById(streakId);
    if (!streak) return next(createError(res, 403, "Streak not exist."));

    const result = await Streak.findByIdAndUpdate(
      streakId,
      { $addToSet: { likes: req.user?._id } },
      { new: true }
    );
    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const commentStreak = async (req, res, next) => {
  try {
    const { streakId } = req.params;
    const { content } = req.body;

    const code = await Streak.findById(streakId);
    if (!code) return next(createError(res, 403, "Streak not exist"));

    const comment = await Comment.create({
      user: req.user._id,
      post: streakId,
      content,
    });

    await Streak.findByIdAndUpdate(
      streakId,
      { $addToSet: { comments: comment } },
      { new: true }
    );
    res.status(200).json({ message: "Commented Successfully" });
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const deleteStreak = async (req, res, next) => {
  try {
    let { streakId } = req.params;

    const streak = await Streak.findById(streakId);
    if (!streak) return next(createError(res, 403, "Streak not exist"));

    const result = await Streak.findByIdAndDelete(streakId);
    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const deleteStreakCollection = async (req, res, next) => {
  try {
    const result = await Streak.deleteMany();
    res.status(200).json(result);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
