import { Router } from "express";
import { asyncHandler } from "../asyncHandler.js";
import { AssetNotFoundError, InvalidAssetIdError } from "../errors.js";
import type { AssetStorage } from "../storage/AssetStorage.js";
import { isValidAssetId } from "../validation.js";

export function createAssetsRouter(storage: AssetStorage): Router {
  const router = Router();

  router.get(
    "/assets",
    asyncHandler(async (req, res) => {
      const category = typeof req.query.category === "string" ? req.query.category : undefined;
      const assets = await storage.list(category);
      res.json(assets);
    }),
  );

  router.get(
    "/assets/:id/preview",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      if (!isValidAssetId(id)) throw new InvalidAssetIdError(id);

      const preview = await storage.getPreview(id);
      if (!preview) throw new AssetNotFoundError(id);

      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.type("image/webp").send(preview);
    }),
  );

  router.get(
    "/assets/:id",
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      if (!isValidAssetId(id)) throw new InvalidAssetIdError(id);

      const asset = await storage.get(id);
      if (!asset) throw new AssetNotFoundError(id);

      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.type(asset.mimeType).send(asset.buffer);
    }),
  );

  return router;
}
