import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'Progress', 'Completed'],
    default: 'Pending'
  },
  deadline: Date,
  assignedTo: {
    type: String,
    required: true
  },
  createdBy: String,
 
}, {
  timestamps: true
});

export default mongoose.model('Task', TaskSchema);
