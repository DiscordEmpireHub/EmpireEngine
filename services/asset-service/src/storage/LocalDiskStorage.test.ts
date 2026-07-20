import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LocalDiskStorage } from "./LocalDiskStorage.js";

const PNG_1X1_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

function createPngBuffer(): Buffer {
  return Buffer.from(PNG_1X1_BASE64, "base64");
}

describe("LocalDiskStorage", () => {
  let rootDir: string;
  let storage: LocalDiskStorage;

  beforeEach(async () => {
    rootDir = await mkdtemp(join(tmpdir(), "asset-service-test-"));
    storage = new LocalDiskStorage(rootDir);
  });

  afterEach(async () => {
    await rm(rootDir, { recursive: true, force: true });
  });

  it("saves an image asset and extracts its dimensions", async () => {
    const metadata = await storage.save({
      id: "card-ace",
      category: "card_face",
      mimeType: "image/png",
      buffer: createPngBuffer(),
    });

    expect(metadata).toMatchObject({
      id: "card-ace",
      category: "card_face",
      mimeType: "image/png",
      width: 1,
      height: 1,
    });
  });

  it("returns the saved buffer through get()", async () => {
    const buffer = createPngBuffer();
    await storage.save({ id: "card-ace", category: "card_face", mimeType: "image/png", buffer });

    const record = await storage.get("card-ace");

    expect(record?.buffer.equals(buffer)).toBe(true);
  });

  it("returns null from get() for an unknown id", async () => {
    const record = await storage.get("missing");

    expect(record).toBeNull();
  });

  it("generates a webp preview for image assets", async () => {
    await storage.save({
      id: "card-ace",
      category: "card_face",
      mimeType: "image/png",
      buffer: createPngBuffer(),
    });

    const preview = await storage.getPreview("card-ace");

    expect(preview).not.toBeNull();
  });

  it("returns null preview for non-image assets", async () => {
    await storage.save({
      id: "sfx-flip",
      category: "sfx",
      mimeType: "audio/mpeg",
      buffer: Buffer.from("fake-audio"),
    });

    const preview = await storage.getPreview("sfx-flip");

    expect(preview).toBeNull();
  });

  it("lists only assets matching the given category", async () => {
    await storage.save({ id: "card-ace", category: "card_face", mimeType: "image/png", buffer: createPngBuffer() });
    await storage.save({ id: "sfx-flip", category: "sfx", mimeType: "audio/mpeg", buffer: Buffer.from("x") });

    const cardFaces = await storage.list("card_face");

    expect(cardFaces).toHaveLength(1);
    expect(cardFaces[0]?.id).toBe("card-ace");
  });

  it("lists all assets when no category filter is given", async () => {
    await storage.save({ id: "card-ace", category: "card_face", mimeType: "image/png", buffer: createPngBuffer() });
    await storage.save({ id: "sfx-flip", category: "sfx", mimeType: "audio/mpeg", buffer: Buffer.from("x") });

    const all = await storage.list();

    expect(all).toHaveLength(2);
  });
});
