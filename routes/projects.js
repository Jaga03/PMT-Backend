import express from 'express';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { verifySession } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', verifySession, async (req, res) => {
  const project = new Project({
    name: req.body.name,
    description: req.body.description,
    owner: req.user.uid
  });
  await project.save();
  res.json(project);
});


router.get('/', verifySession, async (req, res) => {
  try {
    
    const tasks = await Task.find({ assignedTo: req.user.uid });
    const taskProjectIds = tasks.map(t => t.projectId.toString());

    
    const ownedProjects = await Project.find({ owner: req.user.uid });

    const assignedProjects = await Project.find({
      _id: { $in: taskProjectIds, $nin: ownedProjects.map(p => p._id.toString()) }
    });

    const allProjects = [...ownedProjects, ...assignedProjects];
    res.json(allProjects);
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});


router.put('/:id', verifySession, async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.uid },
    { name: req.body.name, description: req.body.description },
    { new: true }
  );
  if (!project) return res.status(404).json({ message: 'Project not found or not owned' });
  res.json(project);
});


router.delete('/:id', verifySession, async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.uid });
    if (!deleted) return res.status(404).json({ message: 'Project not found or not owned' });

    await Task.deleteMany({ projectId: req.params.id });

    res.json({ message: 'Project and related tasks deleted successfully' });
  } catch (err) {
    console.error('Failed to delete project:', err);
    res.status(500).json({ message: 'Failed to delete project' });
  }
});

export default router;
