import { describe, expect, it } from "vitest";
import { AssetCache } from "./AssetCache.js";

describe("AssetCache", () => {
  it("returns undefined for an asset that was never set", () => {
    const cache = new AssetCache();

    expect(cache.get("card-ace")).toBeUndefined();
  });

  it("returns the stored promise for a cached asset", () => {
    const cache = new AssetCache();
    const promise = Promise.resolve();

    cache.set("card-ace", promise);

    expect(cache.get("card-ace")).toBe(promise);
  });

  it("removes an entry on evict", () => {
    const cache = new AssetCache();
    cache.set("card-ace", Promise.resolve());

    cache.evict("card-ace");

    expect(cache.get("card-ace")).toBeUndefined();
  });

  it("removes all entries on clear", () => {
    const cache = new AssetCache();
    cache.set("card-ace", Promise.resolve());
    cache.set("card-king", Promise.resolve());

    cache.clear();

    expect(cache.get("card-ace")).toBeUndefined();
    expect(cache.get("card-king")).toBeUndefined();
  });
});
