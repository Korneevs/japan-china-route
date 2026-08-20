import { rename, rm } from "node:fs/promises";

const clientRoot = new URL("../dist/client/", import.meta.url);
const nestedRoot = new URL("japan-china-route/", clientRoot);
const nestedAssets = new URL("_next/", nestedRoot);
const publicAssets = new URL("_next/", clientRoot);

// GitHub Pages already mounts the artifact at /japan-china-route/. Keep the
// URL prefix in HTML, but move the emitted files to the artifact root so the
// public path is not duplicated.
await rm(publicAssets, { recursive: true, force: true });
await rename(nestedAssets, publicAssets);
await rm(nestedRoot, { recursive: true, force: true });
