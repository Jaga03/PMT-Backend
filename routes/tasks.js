import express from 'express';
import Task from '../models/Task.js';
import { verifySession } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

const router = express.Router();


router.get('/assigned/me', verifySession, async (req, res) => {
  const myUid = req.user.uid;

  // Get projects created by the current user
  const myProjects = await Project.find({ owner: myUid });
  const projectIds = myProjects.map(p => p._id.toString());

  // Fetch tasks where user is either assigned or created the project
  const tasks = await Task.find({
    $or: [
      { assignedTo: myUid },
      { projectId: { $in: projectIds } }
    ]
  });

  res.json(tasks);
});


router.post('/', verifySession, async (req, res) => {
  const { projectId, title, description, deadline, assignedUsername } = req.body;

  const project = await Project.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const assignee = await User.findOne({
    username: new RegExp(`^${assignedUsername}$`, 'i')
  });
  if (!assignee) return res.status(400).json({ message: 'User not found' });

  const task = new Task({
    projectId,
    title,
    description,
    deadline,
    assignedTo: assignee.uid,
    createdBy: req.user.uid,
  });

  await task.save();
  res.json(task);
});




router.put('/:id', verifySession, async (req, res) => {
  const task = await Task.findById(req.params.id);
  const project = await Project.findById(task.projectId);
  if (!task || !project) return res.status(404).json({ message: 'Not found' });

  if (req.body.status && req.user.uid !== project.owner) {
    return res.status(403).json({ message: 'Only project owner can change task status' });
  }

  Object.assign(task, req.body);
  await task.save();
  res.json(task);
});

export default router;
