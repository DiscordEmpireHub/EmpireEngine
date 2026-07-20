import type { GameEngine } from "@empire/engine-core";
import type { AssetDescriptor } from "@empire/engine-types";
import { describe, expect, it, vi } from "vitest";
import { AssetLoader } from "./AssetLoader.js";

function createFakeEngine(loadAsset: GameEngine["loadAsset"]): GameEngine {
  return {
    loadAsset,
    render: vi.fn(),
    play: vi.fn(),
    animate: vi.fn(),
    destroyObject: vi.fn(),
    onSceneReady: vi.fn(() => () => {}),
  };
}

const descriptor: AssetDescriptor = { assetId: "card-ace", category: "sprite", url: "/assets/card-ace.png" };

describe("AssetLoader", () => {
  it("delegates to engine.loadAsset on the first call", async () => {
    const loadAsset = vi.fn().mockResolvedValue(undefined);
    const loader = new AssetLoader(createFakeEngine(loadAsset));

    await loader.load(descriptor);

    expect(loadAsset).toHaveBeenCalledWith(descriptor);
  });

  it("does not call engine.loadAsset again for an already-loaded asset", async () => {
    const loadAsset = vi.fn().mockResolvedValue(undefined);
    const loader = new AssetLoader(createFakeEngine(loadAsset));

    await loader.load(descriptor);
    await loader.load(descriptor);

    expect(loadAsset).toHaveBeenCalledTimes(1);
  });

  it("shares the in-flight promise for concurrent loads of the same asset", async () => {
    let resolveLoad: () => void = () => {};
    const loadAsset = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveLoad = resolve;
        }),
    );
    const loader = new AssetLoader(createFakeEngine(loadAsset));

    const first = loader.load(descriptor);
    const second = loader.load(descriptor);
    resolveLoad();
    await Promise.all([first, second]);

    expect(loadAsset).toHaveBeenCalledTimes(1);
  });

  it("evicts the cache entry and allows a retry when loadAsset rejects", async () => {
    const loadAsset = vi.fn().mockRejectedValueOnce(new Error("network error")).mockResolvedValueOnce(undefined);
    const loader = new AssetLoader(createFakeEngine(loadAsset));

    await expect(loader.load(descriptor)).rejects.toThrow("network error");
    await loader.load(descriptor);

    expect(loadAsset).toHaveBeenCalledTimes(2);
  });

  it("loads distinct assets independently", async () => {
    const loadAsset = vi.fn().mockResolvedValue(undefined);
    const loader = new AssetLoader(createFakeEngine(loadAsset));

    await loader.load(descriptor);
    await loader.load({ assetId: "card-king", category: "sprite", url: "/assets/card-king.png" });

    expect(loadAsset).toHaveBeenCalledTimes(2);
  });
});
