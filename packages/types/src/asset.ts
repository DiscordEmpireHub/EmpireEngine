export type AssetCategory =
  | "sprite"
  | "spritesheet"
  | "atlas"
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
  // Obrigatório quando category === "atlas": URL do arquivo de dados do atlas
  // (empacotamento livre, tamanhos de frame variáveis). Formato inferido pela
  // extensão do arquivo: ".xml" (Sparrow/Starling) ou ".json" (TexturePacker).
  atlasDataUrl?: string;
}
