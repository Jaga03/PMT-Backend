import admin from '../firebaseAdmin.js';

export const verifySession = async (req, res, next) => {
  const sessionCookie = req.cookies.session || '';
  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
