import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const resolveCredentialPath = () => {
    const configuredPath = process.env.FIREBASE_SDK_ADMIN_JSON_PATH;

    if (!configuredPath) {
        return null;
    }

    const candidatePaths = [
        configuredPath,
        configuredPath.replace('\\Documentos\\', '\\Documents\\'),
        path.resolve(process.cwd(), configuredPath),
    ];

    return candidatePaths.find((candidatePath) => fs.existsSync(candidatePath)) ?? null;
};

const credentialPath = resolveCredentialPath();

if (credentialPath) {
    const serviceAccount = require(credentialPath);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.warn('Firebase Admin credentials not found. Firebase-dependent routes will return 503 until FIREBASE_SDK_ADMIN_JSON_PATH points to a valid service account file.');
}

export const isFirebaseAdminAvailable = () => admin.apps.length > 0;

export default admin;