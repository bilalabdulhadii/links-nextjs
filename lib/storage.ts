import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

export type UploadResult = {
    url: string;
    path: string;
};

export async function uploadMediaFile(
    file: File,
    folder: string,
    options?: { onProgress?: (progress: number) => void },
): Promise<UploadResult> {
    if (!storage) {
        throw new Error("Firebase is not configured.");
    }
    const safeName = file.name.replace(/\s+/g, "-");
    const uuid =
        typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2, 10);
    const path = `${folder}/${Date.now()}-${uuid}-${safeName}`;
    const storageRef = ref(storage, path);
    if (!options?.onProgress) {
        await uploadBytes(storageRef, file, { contentType: file.type });
        const url = await getDownloadURL(storageRef);
        return { url, path };
    }

    return new Promise<UploadResult>((resolve, reject) => {
        const task = uploadBytesResumable(storageRef, file, {
            contentType: file.type,
        });
        task.on(
            "state_changed",
            (snapshot) => {
                const progress = snapshot.totalBytes
                    ? Math.round(
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                              100,
                      )
                    : 0;
                options.onProgress?.(progress);
            },
            (error) => reject(error),
            async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                resolve({ url, path });
            },
        );
    });
}

export async function deleteMediaPath(path?: string | null) {
    if (!path || !storage) {
        return;
    }
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
}
