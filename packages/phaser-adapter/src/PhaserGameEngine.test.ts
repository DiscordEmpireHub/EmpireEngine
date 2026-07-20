import { describe, it, expect, vi, beforeEach } from "vitest";

interface MockLoader {
  image: ReturnType<typeof vi.fn>;
  spritesheet: ReturnType<typeof vi.fn>;
  audio: ReturnType<typeof vi.fn>;
  tilemapTiledJSON: ReturnType<typeof vi.fn>;
  once: ReturnType<typeof vi.fn>;
  start: ReturnType<typeof vi.fn>;
}

interface MockSprite {
  setScale: ReturnType<typeof vi.fn>;
  setRotation: ReturnType<typeof vi.fn>;
  setDepth: ReturnType<typeof vi.fn>;
  destroy: ReturnType<typeof vi.fn>;
}

interface BootedScene {
  add: { sprite: ReturnType<typeof vi.fn> };
  load: MockLoader;
  sound: { play: ReturnType<typeof vi.fn> };
  tweens: { add: ReturnType<typeof vi.fn> };
  create: () => void;
}

let lastScene: BootedScene | null = null;

vi.mock("phaser", () => {
  class MockScene {
    key: string;
    constructor(key: string) {
      this.key = key;
    }
  }

  class MockGame {
    constructor(config: { scene: InstanceType<typeof MockScene> & { create(): void } }) {
      const scene = config.scene;
      const loadCallbacks = new Map<string, () => void>();

      const mockSprite: MockSprite = {
        setScale: vi.fn(),
        setRotation: vi.fn(),
        setDepth: vi.fn(),
        destroy: vi.fn(),
      };

      Object.assign(scene, {
        add: { sprite: vi.fn(() => mockSprite) },
        load: {
          image: vi.fn(),
          spritesheet: vi.fn(),
          audio: vi.fn(),
          tilemapTiledJSON: vi.fn(),
          once: vi.fn((event: string, callback: () => void) => {
            loadCallbacks.set(event, callback);
          }),
          start: vi.fn(() => loadCallbacks.get("complete")?.()),
        },
        sound: { play: vi.fn() },
        tweens: { add: vi.fn() },
      });

      lastScene = scene as unknown as BootedScene;
      scene.create();
    }
  }

  return {
    default: { Game: MockGame, Scene: MockScene, AUTO: 0 },
  };
});

const { PhaserGameEngine } = await import("./PhaserGameEngine.js");
const { SceneNotReadyError, ObjectNotFoundError } = await import("./errors.js");

function createEngine() {
  lastScene = null;
  const engine = new PhaserGameEngine({ parent: "app", width: 800, height: 600 });
  const scene = lastScene as BootedScene | null;
  if (!scene) throw new Error("test setup failed: scene was not created");
  return { engine, scene };
}

describe("PhaserGameEngine", () => {
  beforeEach(() => {
    lastScene = null;
  });

  it("notifies onSceneReady once the underlying scene boots", () => {
    const { engine } = createEngine();
    const listener = vi.fn();

    engine.onSceneReady(listener);

    expect(listener).toHaveBeenCalledOnce();
  });

  it("renders a sprite through scene.add.sprite with the given params", () => {
    const { engine, scene } = createEngine();

    engine.render({ objectId: "card-1", assetId: "card-ace", x: 10, y: 20 });

    expect(scene.add.sprite).toHaveBeenCalledWith(10, 20, "card-ace", undefined);
  });

  it("throws SceneNotReadyError when render is called before the scene is ready", () => {
    lastScene = null;
    const engine = Object.create(PhaserGameEngine.prototype) as InstanceType<typeof PhaserGameEngine>;

    expect(() => engine.render({ objectId: "x", assetId: "y", x: 0, y: 0 })).toThrow(
      SceneNotReadyError,
    );
  });

  it("plays a sound through scene.sound.play with volume and loop", () => {
    const { engine, scene } = createEngine();

    engine.play({ assetId: "chip-flip", volume: 0.5, loop: false });

    expect(scene.sound.play).toHaveBeenCalledWith("chip-flip", { volume: 0.5, loop: false });
  });

  it("throws ObjectNotFoundError when animating an unknown objectId", () => {
    const { engine } = createEngine();

    expect(() =>
      engine.animate({ objectId: "missing", durationMs: 200 }),
    ).toThrow(ObjectNotFoundError);
  });

  it("animates a previously rendered object through scene.tweens.add", () => {
    const { engine, scene } = createEngine();
    engine.render({ objectId: "card-1", assetId: "card-ace", x: 0, y: 0 });

    engine.animate({ objectId: "card-1", toX: 100, durationMs: 300, easing: "Sine.easeOut" });

    expect(scene.tweens.add).toHaveBeenCalledWith(
      expect.objectContaining({ x: 100, duration: 300, ease: "Sine.easeOut" }),
    );
  });

  it("resolves loadAsset once the loader emits complete", async () => {
    const { engine } = createEngine();

    await expect(
      engine.loadAsset({ assetId: "card-ace", category: "sprite", url: "/assets/card-ace.png" }),
    ).resolves.toBeUndefined();
  });

  it("destroys a rendered object and removes it from tracking", () => {
    const { engine, scene } = createEngine();
    engine.render({ objectId: "card-1", assetId: "card-ace", x: 0, y: 0 });

    engine.destroyObject("card-1");

    const sprite = (scene.add.sprite as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockSprite;
    expect(sprite.destroy).toHaveBeenCalledOnce();
    expect(() => engine.destroyObject("card-1")).toThrow(ObjectNotFoundError);
  });
});
