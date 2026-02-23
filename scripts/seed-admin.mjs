import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config({ path: ".env.local" });

const {
    LINKS_FIREBASE_ADMIN_PROJECT_ID,
    LINKS_FIREBASE_ADMIN_CLIENT_EMAIL,
    LINKS_FIREBASE_ADMIN_PRIVATE_KEY,
    LINKS_SEED_ADMIN_EMAIL,
    LINKS_SEED_ADMIN_PASSWORD,
} = process.env;

const adminProjectId = LINKS_FIREBASE_ADMIN_PROJECT_ID;
const adminClientEmail = LINKS_FIREBASE_ADMIN_CLIENT_EMAIL;
const adminPrivateKey = LINKS_FIREBASE_ADMIN_PRIVATE_KEY;
const seedEmail = LINKS_SEED_ADMIN_EMAIL;
const seedPassword = LINKS_SEED_ADMIN_PASSWORD;

if (!adminProjectId || !adminClientEmail || !adminPrivateKey) {
    console.error("Missing Firebase Admin credentials in .env.local.");
    process.exit(1);
}

if (!seedEmail || !seedPassword) {
    console.error("Missing SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD.");
    process.exit(1);
}

const privateKey = adminPrivateKey.replace(/\\n/g, "\n");

const app = getApps().length
    ? getApps()[0]
    : initializeApp({
          credential: cert({
              projectId: adminProjectId,
              clientEmail: adminClientEmail,
              privateKey,
          }),
      });

const auth = getAuth(app);
const firestore = getFirestore(app);

async function main() {
    let user;
    try {
        user = await auth.getUserByEmail(seedEmail);
        console.log(`Admin already exists: ${user.uid}`);
    } catch {
        user = await auth.createUser({
            email: seedEmail,
            password: seedPassword,
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
