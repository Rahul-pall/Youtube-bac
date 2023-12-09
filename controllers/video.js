import { createError } from "../error.js";
import usermodel from "../models/users.js"
import videomodel from "../models/video.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new videomodel({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (err) {
    next(err);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await videomodel.findById(req.params.id);
    if (!video) return next(createError(404, "video not found"));
    if (req.user.id === video.userId) {
      const updatedVideo = await videomodel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updateVideo);
    } else {
      return next(createError(404, "You can update only your video"));
    }
  } catch (err) {
    next(err);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await videomodel.findById(req.params.id);
    if (!video) return next(createError(404, "video not found"));
    if (req.user.id === video.userId) {
      await videomodel.findByIdAndDelete(
        req.params.id,
      );
      res.status(200).json("th video has been deleted successfully");
    } else {
      return next(createError(404, "You can delete only your video"));
    }
  } catch (err) {
    next(err);
  }
};

export const getVideo = async (req, res, next) => {
  try{
  const video= await videomodel.findById(req.params.id);
  res.status(200).json(video)
  }
  catch(err){
  next(err);
  }
};

export const addView = async (req, res, next) => {
  try{
  await videomodel.findByIdAndUpdate(req.params.id,{
              $inc:{views:1}
  });
  res.status(200).json("The views has been increase")
  }
  catch(err){
  next(err);
  }
};

export const random = async (req, res, next) => {
  try{
  const videos= await videomodel.aggregate([{$sample:{size:3}}])
  res.status(200).json(videos)
  }
  catch(err){
  next(err);
  }
};

export const trend = async (req, res, next) => {
  try{
  const videos= await videomodel.find().sort({views:-1})
  res.status(200).json(videos)
  }
  catch(err){
  next(err);
  }
};

export const sub = async (req, res, next) => {
  try{
  const user= await usermodel.findById(req.user.id);
  const subscribedChannels=user.subscribedUsers;

  const list = await Promise.all(
              subscribedChannels.map(chanelId=>{
                            return videomodel.find({userId:chanelId})
              })
  );
  res.status(200).json(list.flat().sort((a,b)=>b.createdAt-a.createdAt))
  }
  catch(err){
  next(err);
  }
};

export const getbyTag = async (req, res, next) => {
              const tags =req.query.tags.split(",")
              console.log(tags)
              try{
              const videos= await videomodel.find({tags:{$in:tags}}).limit(20);
              res.status(200).json(videos)
              }
              catch(err){
              next(err);
              }
};

export const search = async (req, res, next) => {
              const query =req.query.q
              try{
              const videos= await videomodel.find(
                 {title:{$regex: query,$options:"i"},
              }).limit(40);
              res.status(200).json(videos)
              }
              catch(err){
              next(err);
              }
};
