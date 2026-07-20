import { createApp } from "./app.js";
import { MissingAdminApiKeyError } from "./errors.js";
import { LocalDiskStorage } from "./storage/LocalDiskStorage.js";

const DEFAULT_PORT = 4100;
const DEFAULT_STORAGE_ROOT = "./data/assets";

const port = Number(process.env.PORT ?? DEFAULT_PORT);
const storageRoot = process.env.ASSET_STORAGE_ROOT ?? DEFAULT_STORAGE_ROOT;
const adminApiKey = process.env.ADMIN_API_KEY;

if (!adminApiKey) {
  throw new MissingAdminApiKeyError();
}

const storage = new LocalDiskStorage(storageRoot);
const app = createApp({ storage, adminApiKey });

app.listen(port, () => {
  console.log(`asset-service listening on port ${port}`);
});
