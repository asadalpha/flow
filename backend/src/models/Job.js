import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'A job must have a company name'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'A job must have a role/title'],
    trim: true,
  },
  description: {
    type: String,
  },
  applicationLink: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Not Applied', 'Applied', 'Ghosted', 'Rejected', 'Interview', 'Offer'],
    default: 'Not Applied',
  },
  notes: {
    type: String,
  },
  dateApplied: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Job must belong to a user'],
  },
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
