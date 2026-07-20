import express, { type Application, type NextFunction, type Request, type Response } from "express";
import { createAdminAuthMiddleware } from "./adminAuth.js";
import { AssetNotFoundError, InvalidAssetIdError } from "./errors.js";
import { createAssetsRouter } from "./routes/assets.js";
import { createUploadRouter } from "./routes/upload.js";
import type { AssetStorage } from "./storage/AssetStorage.js";

export interface CreateAppOptions {
  storage: AssetStorage;
  adminApiKey: string;
}

export function createApp(options: CreateAppOptions): Application {
  const app = express();

  app.use(createAssetsRouter(options.storage));
  app.use(createAdminAuthMiddleware(options.adminApiKey), createUploadRouter(options.storage));

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    if (err instanceof InvalidAssetIdError) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (err instanceof AssetNotFoundError) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(500).json({ error: "internal server error" });
  });

  return app;
}
