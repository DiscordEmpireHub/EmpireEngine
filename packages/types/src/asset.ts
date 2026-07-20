export type AssetCategory =
  | "sprite"
  | "spritesheet"
  | "audio"
  | "particle-effect"
  | "font"
  | "tilemap";

export interface AssetDescriptor {
  assetId: string;
  category: AssetCategory;
  url: string;
  width?: number;
  height?: number;
  frameWidth?: number;
  frameHeight?: number;
}
