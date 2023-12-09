import { createError } from "../error.js";
import commentModel from "../models/comments.js";
import videoModel from "../models/video.js";

export const addcomment = async (req, res, next) => {
  const newcomments = new commentModel({ ...req.body, userId: req.user.id });
  try {
    const savecomment = await newcomments.save();
    res.status(200).json(savecomment);
  } catch (err) {
    next(err);
  }
};

export const deletecomment = async (req, res, next) => {
 try {
  const comment = await commentModel.findById(req.params.id);
  const video = await videoModel.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await commentModel.findByIdAndDelete(req.params.id);
      res.status(200).json("your comment is deleted");
    } else {
      return next(createError(403, "you can delete only your comment"));
    }
  } catch (err) {
    next(err);
  }
};

export const getcomment = async (req, res, next) => {
  try {
    const comments = await commentModel.find({videoId: req.params.videoId});
    res.status(200).json(comments);
    console.log(comments)
  } catch (err) {
    next(err);
  }
};
