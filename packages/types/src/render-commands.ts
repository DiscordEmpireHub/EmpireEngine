export interface RenderParams {
  objectId: string;
  assetId: string;
  x: number;
  y: number;
  scale?: number;
  rotation?: number;
  depth?: number;
  frame?: string | number;
}

export interface PlaySoundOptions {
  assetId: string;
  volume?: number;
  loop?: boolean;
}

export interface AnimateParams {
  objectId: string;
  toX?: number;
  toY?: number;
  toScale?: number;
  toRotation?: number;
  toAlpha?: number;
  durationMs: number;
  easing?: string;
}
