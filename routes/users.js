import express from 'express';
import admin from '../firebaseAdmin.js';
import User from '../models/User.js';


const router = express.Router();

const verifySession = async (req, res, next) => {
  const sessionCookie = req.cookies?.session;
  if (!sessionCookie) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid session' });
  }
};


router.get('/me', verifySession, async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    res.json({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
  } catch {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

router.get('/:uid', async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.params.uid);
    res.json({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
  } catch {
    res.status(404).json({ message: 'User not found' });
  }
});

router.get('/username/:username', verifySession, async (req, res) => {
 const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ uid: user.uid });
});

export default router;
