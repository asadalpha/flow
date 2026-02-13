import mongoose from "mongoose";
import Job from "../models/Job.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const allowedStatuses = new Set([
  "Not Applied",
  "Applied",
  "Ghosted",
  "Rejected",
  "Interview",
  "Offer",
]);

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const pickAllowedFields = (body) => {
  const allowed = [
    "company",
    "role",
    "description",
    "applicationLink",
    "status",
    "notes",
    "dateApplied",
  ];
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key))
  );
};

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
  // Enforce user from auth to prevent IDOR
  const payload = pickAllowedFields(req.body);

  if (!payload.company || !payload.role) {
    return next(new AppError("Company and role are required", 400));
  }

  if (payload.status && !allowedStatuses.has(payload.status)) {
    return next(new AppError("Invalid status value", 400));
  }

  payload.user = req.user.id;

  const newJob = await Job.create(payload);

  res.status(201).json({
    status: "success",
    data: { job: newJob },
  });
});

export const updateJob = catchAsync(async (req, res, next) => {
  if (!validateObjectId(req.params.id)) {
    return next(new AppError("Invalid job id", 400));
  }

  const payload = pickAllowedFields(req.body);

  if (payload.status && !allowedStatuses.has(payload.status)) {
    return next(new AppError("Invalid status value", 400));
  }

  const job = await Job.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    payload,
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
  if (!validateObjectId(req.params.id)) {
    return next(new AppError("Invalid job id", 400));
  }

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
