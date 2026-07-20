import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import type { AssetStorage } from "./storage/AssetStorage.js";
import type { AssetMetadata, AssetRecord, SaveAssetInput } from "./storage/types.js";

const ADMIN_API_KEY = "test-admin-key";

class FakeAssetStorage implements AssetStorage {
  private readonly records = new Map<string, AssetRecord>();
  private readonly previews = new Map<string, Buffer>();

  seed(record: AssetRecord, preview?: Buffer): void {
    this.records.set(record.id, record);
    if (preview) this.previews.set(record.id, preview);
  }

  async save(input: SaveAssetInput): Promise<AssetMetadata> {
    const metadata: AssetMetadata = {
      id: input.id,
      category: input.category,
      mimeType: input.mimeType,
      createdAt: new Date(0).toISOString(),
    };
    this.records.set(input.id, { ...metadata, buffer: input.buffer });
    return metadata;
  }

  async get(id: string): Promise<AssetRecord | null> {
    return this.records.get(id) ?? null;
  }

  async getPreview(id: string): Promise<Buffer | null> {
    return this.previews.get(id) ?? null;
  }

  async list(category?: string): Promise<AssetMetadata[]> {
    const all = [...this.records.values()];
    return category ? all.filter((entry) => entry.category === category) : all;
  }
}

describe("asset-service app", () => {
  let storage: FakeAssetStorage;
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    storage = new FakeAssetStorage();
    app = createApp({ storage, adminApiKey: ADMIN_API_KEY });
  });

  it("returns a stored asset's raw bytes with immutable cache headers", async () => {
    storage.seed({
      id: "card-ace",
      category: "card_face",
      mimeType: "image/png",
      createdAt: new Date(0).toISOString(),
      buffer: Buffer.from("fake-png"),
    });

    const response = await request(app).get("/assets/card-ace");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("image/png");
    expect(response.headers["cache-control"]).toBe("public, max-age=31536000, immutable");
    expect(response.body).toEqual(Buffer.from("fake-png"));
  });

  it("returns 404 for an unknown asset id", async () => {
    const response = await request(app).get("/assets/missing");

    expect(response.status).toBe(404);
  });

  it("returns 400 for an asset id containing path traversal characters", async () => {
    const response = await request(app).get("/assets/..%2F..%2Fetc%2Fpasswd");

    expect(response.status).toBe(400);
  });

  it("returns a preview when one exists", async () => {
    storage.seed(
      {
        id: "card-ace",
        category: "card_face",
        mimeType: "image/png",
        createdAt: new Date(0).toISOString(),
        buffer: Buffer.from("fake-png"),
      },
      Buffer.from("fake-webp-preview"),
    );

    const response = await request(app).get("/assets/card-ace/preview");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("image/webp");
  });

  it("returns 404 when no preview exists for an asset", async () => {
    storage.seed({
      id: "sfx-flip",
      category: "sfx",
      mimeType: "audio/mpeg",
      createdAt: new Date(0).toISOString(),
      buffer: Buffer.from("fake-audio"),
    });

    const response = await request(app).get("/assets/sfx-flip/preview");

    expect(response.status).toBe(404);
  });

  it("lists assets filtered by category", async () => {
    storage.seed({
      id: "card-ace",
      category: "card_face",
      mimeType: "image/png",
      createdAt: new Date(0).toISOString(),
      buffer: Buffer.from("x"),
    });
    storage.seed({
      id: "sfx-flip",
      category: "sfx",
      mimeType: "audio/mpeg",
      createdAt: new Date(0).toISOString(),
      buffer: Buffer.from("y"),
    });

    const response = await request(app).get("/assets").query({ category: "card_face" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].id).toBe("card-ace");
  });

  it("rejects uploads without the admin API key", async () => {
    const response = await request(app)
      .post("/assets")
      .field("id", "card-ace")
      .field("category", "card_face")
      .attach("file", Buffer.from("fake-png"), "card-ace.png");

    expect(response.status).toBe(401);
  });

  it("accepts uploads with a valid admin API key", async () => {
    const response = await request(app)
      .post("/assets")
      .set("x-admin-api-key", ADMIN_API_KEY)
      .field("id", "card-ace")
      .field("category", "card_face")
      .attach("file", Buffer.from("fake-png"), "card-ace.png");

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ id: "card-ace", category: "card_face" });
  });

  it("rejects uploads with an invalid asset id", async () => {
    const response = await request(app)
      .post("/assets")
      .set("x-admin-api-key", ADMIN_API_KEY)
      .field("id", "../evil")
      .field("category", "card_face")
      .attach("file", Buffer.from("fake-png"), "card-ace.png");

    expect(response.status).toBe(400);
  });
});
