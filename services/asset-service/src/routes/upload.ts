import { Router } from "express";
import multer from "multer";
import { asyncHandler } from "../asyncHandler.js";
import { InvalidAssetIdError } from "../errors.js";
import type { AssetStorage } from "../storage/AssetStorage.js";
import { isValidAssetId } from "../validation.js";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_UPLOAD_BYTES } });

export function createUploadRouter(storage: AssetStorage): Router {
  const router = Router();

  router.post(
    "/assets",
    upload.single("file"),
    asyncHandler(async (req, res) => {
      const { id, category } = req.body as { id?: string; category?: string };

      if (!id || !isValidAssetId(id)) throw new InvalidAssetIdError(id ?? "");
      if (!category) {
        res.status(400).json({ error: "campo 'category' e obrigatorio" });
        return;
      }
      if (!req.file) {
        res.status(400).json({ error: "arquivo 'file' e obrigatorio" });
        return;
      }

      const metadata = await storage.save({
        id,
        category,
        mimeType: req.file.mimetype,
        buffer: req.file.buffer,
      });

      res.status(201).json(metadata);
    }),
  );

  return router;
}
