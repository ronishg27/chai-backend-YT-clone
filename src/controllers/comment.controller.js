import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content, video } = req.body;

  console.log("Commented by: ", req.user?._username);
  const createdComment = await Comment.create({
    content,
    video,
    owner: req.user?._id,
  });

  if (!createdComment) {
    throw new ApiError(500, "Failed to post comment on the video.");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdComment, "comment posted successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  // ? authorization check
  const commentId = req.params._id;
  const { content } = req.body;
  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(500, "Unable to update the comment.");
  }

  return res.status(200).json(new ApiResponse(201, "Comment updated."));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  // ? authorization check

  const commentId = req.body?._id;

  const deletedComment = await Comment.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new ApiError(501, "Something went wrong while deleting comment. ");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, deletedComment, "Comment deleted."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
