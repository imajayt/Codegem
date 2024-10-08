import Collection from "../models/collection.js";
import User from "../models/user.js";
import Share from "../models/submodels/share.js";
import Streak from "../models/streak.js";
import Challenge from "../models/challenge.js";
import Code from "../models/code.js";
import { createError, isUndefined } from "../utils/functions.js";

export const getCollections = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const collections = await Collection.find({ owner: { $ne: userId } })
      .populate("codes")
      .populate("owner")
      .exec();

    res.status(200).json(collections);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const getUserCollections = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if the user has a collection named "Saved"
    const savedCollection = await Collection.findOne({
      owner: userId,
      name: "Saved",
    });

    // If "Saved" collection doesn't exist, create it
    if (!savedCollection) {
      const newSavedCollection = new Collection({
        name: "Saved",
        description: "The collection of your saved codes.",
        owner: userId,
      });
      await newSavedCollection.save();
    }

    const collections = await Collection.find({ owner: userId })
      .populate("codes")
      .populate("owner")
      .exec();

    res.status(200).json(collections);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const getCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findById(collectionId)
      .populate("codes")
      .populate("owner")
      .exec();
    res.status(200).json(collection);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const getCollectionCodes = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findById(collectionId, {
      codes: 1,
      _id: 0,
    })
      .populate("codes")
      .exec();

    res.status(200).json(collection?.codes || []);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const getCollectionStreaks = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findById(collectionId, {
      streaks: 1,
      _id: 0,
    })
      .populate("streaks")
      .exec();
    console.log(collection);
    res.status(200).json(collection?.streaks || []);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const getCollectionChallenges = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const collection = await Collection.findById(collectionId, {
      challenges: 1,
      _id: 0,
    })
      .populate("challenges")
      .exec();

    res.status(200).json(collection?.challenges || []);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const createCollections = async (req, res, next) => {
  try {
    const collections = await Collection.create({
      ...req.body,
      owner: req?.user?._id,
    });
    res.status(200).json(collections);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const createCollectionCode = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    let { title, code, ...rest } = req.body;
    if (isUndefined(title) || isUndefined(code))
      return next(
        createError(res, 400, "Make sure to provide all the fields.")
      );

    const createdCode = await Code.create({
      user: req.user._id,
      title,
      code,
      ...rest,
    });

    await Collection.findByIdAndUpdate(
      collectionId,
      { $push: { codes: createdCode._id } },
      { new: true }
    );

    res.status(200).json(createdCode);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const createCollectionStreak = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    let { title, streak, ...rest } = req.body;
    if (isUndefined(title) || isUndefined(streak[0].code))
      return next(createError(res, 400, "Title and Streak, both are required"));

    const createdStreak = await Streak.create({
      user: req.user._id,
      title,
      streak,
      ...rest,
    });

    await Collection.findByIdAndUpdate(
      collectionId,
      { $push: { streaks: createdStreak._id } },
      { new: true }
    );

    res.status(200).json(createdStreak);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const createCollectionChallenge = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    let { title, challenge, solution, groupId, ...rest } = req.body;
    if (isUndefined(title) || isUndefined(challenge) || isUndefined(solution))
      return next(
        createError(res, 400, "Title, Challenge and Solution are required")
      );

    const createdChallenge = await Challenge.create({
      user: req.user._id,
      title,
      challenge,
      solution,
      ...rest,
    });

    await Collection.findByIdAndUpdate(
      collectionId,
      { $push: { challenges: createdChallenge._id } },
      { new: true }
    );

    res.status(200).json(createdChallenge);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const updateCollections = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const collections = await Collection.findByIdAndUpdate(
      collectionId,
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).json(collections);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const shareCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    let { friendIds } = req.body; // ids of users

    // Validate that friendIds is an array of valid user IDs
    if (
      !Array.isArray(friendIds) ||
      friendIds.some((userId) => typeof userId !== "string")
    ) {
      return res.status(400).json({ error: "Invalid friendIds format" });
    }
    let collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const shares = await Promise.all(
      friendIds.map(async (id) => {
        const shareObj = await Share.create({
          from: req.user._id,
          to: id,
          post: collectionId,
          postType: "collection",
          sharedTo: "friend", // friend/group
        });
        return shareObj._id;
      })
    );

    ////// sharing includes updating sender, receiver and the post being shared //////
    // updating code, adding user to shares array
    await Promise.all(
      shares.map(async (shareId) => {
        await Collection.findByIdAndUpdate(
          collectionId,
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

    res.status(200).json({ message: "Collection shared successfully." });
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
export const starCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    const collection = await Collection.findById(collectionId);
    if (!collection)
      return next(createError(res, 403, "Collection not exist."));

    const userHasStared = collection.stars.includes(req.user?._id);

    if (userHasStared) {
      await Collection.findByIdAndUpdate(
        collectionId,
        { $pull: { stars: req.user?._id } },
        { new: true }
      );
      res.status(200).json({ message: "Removed star successfully" });
    } else {
      await Collection.findByIdAndUpdate(
        collectionId,
        { $addToSet: { stars: req.user?._id } },
        { new: true }
      );
      res.status(200).json({ message: "Stared successfully" });
    }
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const deleteCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    const deletedCollection = await Collection.findByIdAndDelete(collectionId);
    res.status(200).json(deletedCollection);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};

export const deleteWholeCollection = async (req, res, next) => {
  try {
    const deletedCollection = await Collection.deleteMany();
    res.status(200).json(deletedCollection);
  } catch (error) {
    next(createError(res, 500, error.message));
  }
};
