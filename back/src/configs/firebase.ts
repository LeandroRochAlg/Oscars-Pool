import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = require(process.env.FIREBASE_SDK_ADMIN_JSON_PATH || '');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;