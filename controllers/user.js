import { createError } from "../error.js";
import usermodel from "../models/users.js";
import videoModel from "../models/video.js"

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await usermodel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "you can update only your account"));
  }
};

export const deleteuser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await usermodel.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "you can delete only your account"));
  }
};

export const getuser = async (req, res, next) => {
  try {
              const user=await usermodel.findById(req.params.id);
              res.status(200).json(user)
  } catch (err) {
    next(err);
  }
};

export const subscribe = async (req, res, next) => {
  try {
           await usermodel.findByIdAndUpdate(req.user.id,{
              $push:{subscribedUsers:req.params.id},
           })   
           await usermodel.findByIdAndUpdate(req.params.id,{
              $inc:{subscribers:1}
           })
           res.status(200).json("subscription is successfull")
  } catch (err) {
    next(err);
  }
};

export const unsbscribe = async (req, res, next) => {
              try {
                            await usermodel.findByIdAndUpdate(req.user.id,{
                               $pull:{subscribedUsers:req.params.id},
                            })   
                            await usermodel.findById(req.params.id,{
                               $inc:{subscribers:-1}
                            })
                            res.status(200).json("UnSubscription is successfull")
                   } catch (err) {
                     next(err);
                   }
};

export const like = async (req, res, next) => {
  const id= req.user.id;
  const videoId =req.params.videoId;
  try {
    await videoModel.findByIdAndUpdate(videoId,{
      $addToSet:{likes:id},
      $pull:{dislikes:id}
    })
    res.status(200).json("the vidoe has been liked")
  } catch (err) {
    next(err);
  }
};

export const dislike = async (req, res, next) => {
    const id= req.user.id;
  const videoId =req.params.videoId;
  try {
    await videoModel.findByIdAndUpdate(videoId,{
      $addToSet:{dislikes:id},
      $pull:{likes:id}
    })
    res.status(200).json("the vidoe has been disliked")
  }
  catch (err) {
    next(err);
  }
};
