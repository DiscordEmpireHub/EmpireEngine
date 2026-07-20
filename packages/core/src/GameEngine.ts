import type {
  AssetDescriptor,
  RenderParams,
  PlaySoundOptions,
  AnimateParams,
} from "@empire/engine-types";

export interface GameEngine {
  loadAsset(descriptor: AssetDescriptor): Promise<void>;
  render(params: RenderParams): void;
  play(options: PlaySoundOptions): void;
  animate(params: AnimateParams): void;
  destroyObject(objectId: string): void;
  onSceneReady(listener: () => void): () => void;
}
