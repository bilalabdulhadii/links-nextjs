import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        LINKS_FIREBASE_API_KEY: process.env.LINKS_FIREBASE_API_KEY,
        LINKS_FIREBASE_AUTH_DOMAIN: process.env.LINKS_FIREBASE_AUTH_DOMAIN,
        LINKS_FIREBASE_PROJECT_ID: process.env.LINKS_FIREBASE_PROJECT_ID,
        LINKS_FIREBASE_STORAGE_BUCKET: process.env.LINKS_FIREBASE_STORAGE_BUCKET,
        LINKS_FIREBASE_MESSAGING_SENDER_ID:
            process.env.LINKS_FIREBASE_MESSAGING_SENDER_ID,
        LINKS_FIREBASE_APP_ID: process.env.LINKS_FIREBASE_APP_ID,
    },
};

export default nextConfig;
