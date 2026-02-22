import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config({ path: ".env.local" });

const {
    FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY,
    SEED_ADMIN_EMAIL,
    SEED_ADMIN_PASSWORD,
} = process.env;

if (
    !FIREBASE_ADMIN_PROJECT_ID ||
    !FIREBASE_ADMIN_CLIENT_EMAIL ||
    !FIREBASE_ADMIN_PRIVATE_KEY
) {
    console.error("Missing Firebase Admin credentials in .env.local.");
    process.exit(1);
}

if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    console.error("Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD.");
    process.exit(1);
}

const privateKey = FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n");

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
          credential: cert({
              projectId: FIREBASE_ADMIN_PROJECT_ID,
              clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
              privateKey,
          }),
      });

const auth = getAuth(app);
const firestore = getFirestore(app);

async function main() {
    let user;
    try {
        user = await auth.getUserByEmail(SEED_ADMIN_EMAIL);
        console.log(`Admin already exists: ${user.uid}`);
    } catch {
        user = await auth.createUser({
            email: SEED_ADMIN_EMAIL,
            password: SEED_ADMIN_PASSWORD,
            emailVerified: true,
        });
        await auth.setCustomUserClaims(user.uid, { role: "admin" });
        console.log(`Created admin user: ${user.uid}`);
    }

    const configRef = firestore.doc("appConfig/main");
    const configSnap = await configRef.get();
    if (configSnap.exists) {
        console.log("appConfig/main already exists.");
        return;
    }

    const configPath = new URL("../lib/default-config.json", import.meta.url);
    const configRaw = await readFile(configPath, "utf-8");
    const defaultConfig = JSON.parse(configRaw);
    await configRef.set(defaultConfig, { merge: false });
    console.log("Created appConfig/main with default config.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
