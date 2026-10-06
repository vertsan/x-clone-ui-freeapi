import ImageKit from "imagekit";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

// The ImageKit client is optional: without keys (e.g. in local dev without
// credentials configured) the app still runs and text-only posts work,
// media uploads are skipped instead of crashing on initialization.
export const imagekit: ImageKit | null =
  publicKey && privateKey && urlEndpoint
    ? new ImageKit({ publicKey, privateKey, urlEndpoint })
    : null;
