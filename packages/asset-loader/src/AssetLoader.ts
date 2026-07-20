import type { GameEngine } from "@empire/engine-core";
import type { AssetDescriptor } from "@empire/engine-types";
import { AssetCache } from "./AssetCache.js";

export class AssetLoader {
  private readonly cache: AssetCache;

  constructor(
    private readonly engine: GameEngine,
    cache: AssetCache = new AssetCache(),
  ) {
    this.cache = cache;
  }

  load(descriptor: AssetDescriptor): Promise<void> {
    const cached = this.cache.get(descriptor.assetId);
    if (cached) return cached;

    const loadPromise = this.engine.loadAsset(descriptor).catch((error: unknown) => {
      this.cache.evict(descriptor.assetId);
      throw error;
    });

    this.cache.set(descriptor.assetId, loadPromise);
    return loadPromise;
  }
}
