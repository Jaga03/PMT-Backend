import express from 'express';
import admin from '../firebaseAdmin.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/sessionLogin', async (req, res) => {
  const { token } = req.body;
  const expiresIn = 5 * 24 * 60 * 60 * 1000;

  try {
    const sessionCookie = await admin.auth().createSessionCookie(token, { expiresIn });
    res.cookie('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true, 
      sameSite: 'lax',
    });
    res.json({ message: 'Session cookie created' });
  } catch (error){
    console.error('Session login error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.json({ message: 'Logged out' });
});

router.post('/register', async (req, res) => {
  const { uid, username, email } = req.body;

  const exists = await User.findOne({ username: { $regex: `^${username}$`, $options: 'i' } });
  if (exists) return res.status(400).json({ message: 'Username already taken' });

  const user = new User({ uid, username, email });
  await user.save();
  res.json(user);
});

router.get('/check-username/:username', async (req, res) => {
  const username = req.params.username;
  const exists = await User.findOne({
    username: { $regex: `^${username}$`, $options: 'i' }
  });
  res.json({ exists: !!exists });
});


export default router;
