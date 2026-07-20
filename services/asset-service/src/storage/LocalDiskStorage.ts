import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import type { AssetStorage } from "./AssetStorage.js";
import type { AssetMetadata, AssetRecord, SaveAssetInput } from "./types.js";

const MANIFEST_FILE = "manifest.json";
const PREVIEW_MAX_DIMENSION = 256;

export class LocalDiskStorage implements AssetStorage {
  constructor(private readonly rootDir: string) {}

  async save(input: SaveAssetInput): Promise<AssetMetadata> {
    await mkdir(this.rootDir, { recursive: true });

    const dimensions = await this.extractImageDimensions(input.buffer, input.mimeType);
    const metadata: AssetMetadata = {
      id: input.id,
      category: input.category,
      mimeType: input.mimeType,
      ...dimensions,
      createdAt: new Date().toISOString(),
    };

    await writeFile(this.assetPath(input.id), input.buffer);
    if (dimensions) {
      await this.writePreview(input.id, input.buffer);
    }

    const manifest = await this.readManifest();
    manifest[input.id] = metadata;
    await this.writeManifest(manifest);

    return metadata;
  }

  async get(id: string): Promise<AssetRecord | null> {
    const manifest = await this.readManifest();
    const metadata = manifest[id];
    if (!metadata) return null;

    const buffer = await readFile(this.assetPath(id));
    return { ...metadata, buffer };
  }

  async getPreview(id: string): Promise<Buffer | null> {
    const previewExists = await this.fileExists(this.previewPath(id));
    if (!previewExists) return null;
    return readFile(this.previewPath(id));
  }

  async list(category?: string): Promise<AssetMetadata[]> {
    const manifest = await this.readManifest();
    const entries = Object.values(manifest);
    return category ? entries.filter((entry) => entry.category === category) : entries;
  }

  private async writePreview(id: string, buffer: Buffer): Promise<void> {
    const preview = await sharp(buffer)
      .resize(PREVIEW_MAX_DIMENSION, PREVIEW_MAX_DIMENSION, { fit: "inside" })
      .webp()
      .toBuffer();
    await writeFile(this.previewPath(id), preview);
  }

  private async extractImageDimensions(
    buffer: Buffer,
    mimeType: string,
  ): Promise<{ width: number; height: number } | undefined> {
    if (!mimeType.startsWith("image/")) return undefined;
    const { width, height } = await sharp(buffer).metadata();
    return width && height ? { width, height } : undefined;
  }

  private async readManifest(): Promise<Record<string, AssetMetadata>> {
    const manifestExists = await this.fileExists(this.manifestPath());
    if (!manifestExists) return {};
    const raw = await readFile(this.manifestPath(), "utf-8");
    return JSON.parse(raw) as Record<string, AssetMetadata>;
  }

  private async writeManifest(manifest: Record<string, AssetMetadata>): Promise<void> {
    await writeFile(this.manifestPath(), JSON.stringify(manifest, null, 2));
  }

  private assetPath(id: string): string {
    return join(this.rootDir, id);
  }

  private previewPath(id: string): string {
    return join(this.rootDir, `${id}.preview.webp`);
  }

  private manifestPath(): string {
    return join(this.rootDir, MANIFEST_FILE);
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch {
      return false;
    }
  }
}
