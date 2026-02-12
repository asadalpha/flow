import Job from "../models/Job.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

export const getAllJobs = catchAsync(async (req, res, next) => {
  // Filter by user and optional query params (status, etc.)
  // Filter by user and optional query params (status, etc.)
  // user field is enforced from token to prevent IDOR
  const queryObj = { ...req.query, user: req.user.id };
  const jobs = await Job.find(queryObj).sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: { jobs },
  });
});

export const createJob = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const newJob = await Job.create(req.body);

  res.status(201).json({
    status: "success",
    data: { job: newJob },
  });
});

export const updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { job },
  });
});

export const deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!job) {
    return next(new AppError("No job found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getJobStats = catchAsync(async (req, res, next) => {
  const stats = await Job.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});
