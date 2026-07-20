import { describe, it, expect, vi } from "vitest";
import { SceneManager, SceneNotRegisteredError } from "./SceneManager.js";
import type { Scene } from "./SceneManager.js";

function createScene(id: string) {
  return {
    id,
    init: vi.fn<() => void>(),
    update: vi.fn<(deltaMs: number) => void>(),
    destroy: vi.fn<() => void>(),
  } satisfies Scene;
}

describe("SceneManager", () => {
  it("returns null as the active scene before any scene is activated", () => {
    const manager = new SceneManager();

    expect(manager.getActiveScene()).toBeNull();
  });

  it("calls init and exposes the scene as active when activated", () => {
    const manager = new SceneManager();
    const scene = createScene("lobby");
    manager.register(scene);

    manager.activate("lobby");

    expect(scene.init).toHaveBeenCalledOnce();
    expect(manager.getActiveScene()).toBe(scene);
  });

  it("throws SceneNotRegisteredError when activating an unregistered scene", () => {
    const manager = new SceneManager();

    expect(() => manager.activate("missing")).toThrow(SceneNotRegisteredError);
  });

  it("forwards update deltas to the active scene only", () => {
    const manager = new SceneManager();
    const lobby = createScene("lobby");
    const table = createScene("table");
    manager.register(lobby);
    manager.register(table);
    manager.activate("table");

    manager.update(16);

    expect(table.update).toHaveBeenCalledWith(16);
    expect(lobby.update).not.toHaveBeenCalled();
  });

  it("destroys the scene and clears active state on unregister", () => {
    const manager = new SceneManager();
    const scene = createScene("lobby");
    manager.register(scene);
    manager.activate("lobby");

    manager.unregister("lobby");

    expect(scene.destroy).toHaveBeenCalledOnce();
    expect(manager.getActiveScene()).toBeNull();
  });
});
