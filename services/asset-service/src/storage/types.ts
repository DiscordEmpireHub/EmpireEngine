export interface AssetMetadata {
  id: string;
  category: string;
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface AssetRecord extends AssetMetadata {
  buffer: Buffer;
}

export interface SaveAssetInput {
  id: string;
  category: string;
  mimeType: string;
  buffer: Buffer;
}
