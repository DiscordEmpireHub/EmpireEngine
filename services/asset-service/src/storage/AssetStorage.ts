import type { AssetMetadata, AssetRecord, SaveAssetInput } from "./types.js";

export interface AssetStorage {
  save(input: SaveAssetInput): Promise<AssetMetadata>;
  get(id: string): Promise<AssetRecord | null>;
  getPreview(id: string): Promise<Buffer | null>;
  list(category?: string): Promise<AssetMetadata[]>;
}
