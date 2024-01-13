import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet ✅
  const { content } = req.body;
  // const owner = await User.findById(req.user?._id);

  if (content?.trim() === "") {
    throw new ApiError(400, "Content required.");
  }

  const createdTweet = await Tweet.create({
    content,
    owner: req.user?._id,
  });

  if (!createdTweet) {
    throw new ApiError(500, "Something went wrong while creating a tweet.");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdTweet, "Tweet created successfully."));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const userId = req.body?._id;

  const userTweets = await Tweet.find({
    _id: new mongoose.Types.ObjectId(userId),
  });

  if (!userTweets) {
    throw new ApiError(500, "Error fetching user tweets.");
  }

  console.log(userTweets);
  return res
    .status(200)
    .json(
      new ApiResponse(201, userTweets, "User tweets fetched successfully.")
    );

  //   const tweetAggregate = await User.aggregate(
  //     {
  //       $match: {
  //         _id: new mongoose.Types.ObjectId(userId),
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "owner,
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  // {
  // $unwind: $user
  // }
  //

  //     {
  //       project: {
  //_id:1,
  // content:1,
  // bla bla
  //   },
  //     }
  //   );
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { _id, content } = req.body;

  const updatedTweet = await Tweet.findByIdAndUpdate(
    _id,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(500, "Failed to update tweet.");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, updatedTweet, "Tweet updated successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet

  const { tweetId } = req.params;
  // authorization check
  const tweet = await Tweet.findById(tweetId);
  if (!tweet || tweet.owner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "Unauthorized request.");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(500, "Internal server error");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, deletedTweet, "Tweet deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
