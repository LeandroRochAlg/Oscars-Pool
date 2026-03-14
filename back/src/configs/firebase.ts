import admin from 'firebase-admin';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

type ServiceAccountLike = {
    project_id: string;
    client_email: string;
    private_key: string;
};

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

const resolveCredentialFromEnv = (): ServiceAccountLike | null => {
    const rawJson = process.env.FIREBASE_SDK_ADMIN_JSON;
    const base64Json = process.env.FIREBASE_SDK_ADMIN_JSON_BASE64;

    const parseJson = (value: string): ServiceAccountLike | null => {
        try {
            const parsed = JSON.parse(value) as ServiceAccountLike;

            if (!parsed?.project_id || !parsed?.client_email || !parsed?.private_key) {
                return null;
            }

            return {
                ...parsed,
                private_key: parsed.private_key.replace(/\\n/g, '\n'),
            };
        } catch {
            return null;
        }
    };

    if (rawJson) {
        return parseJson(rawJson);
    }

    if (base64Json) {
        try {
            const decoded = Buffer.from(base64Json, 'base64').toString('utf-8');
            return parseJson(decoded);
        } catch {
            return null;
        }
    }

    return null;
};

const credentialPath = resolveCredentialPath();
const credentialFromEnv = resolveCredentialFromEnv();

if (credentialFromEnv || credentialPath) {
    const serviceAccount = credentialFromEnv ?? require(credentialPath as string);

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    console.warn('Firebase Admin credentials not found. Firebase-dependent routes will return 503 until FIREBASE_SDK_ADMIN_JSON_PATH, FIREBASE_SDK_ADMIN_JSON, or FIREBASE_SDK_ADMIN_JSON_BASE64 is configured.');
}

export const isFirebaseAdminAvailable = () => admin.apps.length > 0;

export default admin;