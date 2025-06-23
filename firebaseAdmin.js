import admin from 'firebase-admin';

let serviceAccount;

if (process.env.NODE_ENV === 'production') {

  const jsonStr = Buffer.from(process.env.FIREBASE_ADMIN_SDK, 'base64').toString('utf-8');
  serviceAccount = JSON.parse(jsonStr);
} else {
 
  serviceAccount = await import('./project-management-tool-dc623-firebase-adminsdk-fbsvc-592df9712b.json', {
    with: { type: 'json' }
  }).then(mod => mod.default);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
