import { describe, it, expect, vi, beforeEach } from "vitest";

interface MockLoader {
  image: ReturnType<typeof vi.fn>;
  spritesheet: ReturnType<typeof vi.fn>;
  atlasXML: ReturnType<typeof vi.fn>;
  atlas: ReturnType<typeof vi.fn>;
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
  setInteractive: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  input: object | null;
}

interface BootedScene {
  add: { sprite: ReturnType<typeof vi.fn> };
  load: MockLoader;
  sound: { play: ReturnType<typeof vi.fn> };
  tweens: { add: ReturnType<typeof vi.fn> };
  create: () => void;
}

let lastScene: BootedScene | null = null;
let lastGame: { destroy: ReturnType<typeof vi.fn> } | null = null;

vi.mock("phaser", () => {
  class MockScene {
    key: string;
    constructor(key: string) {
      this.key = key;
    }
  }

  class MockGame {
    destroy = vi.fn();

    constructor(config: { scene: InstanceType<typeof MockScene> & { create(): void } }) {
      const scene = config.scene;
      const loadCallbacks = new Map<string, () => void>();

      const mockSprite: MockSprite = {
        setScale: vi.fn(),
        setRotation: vi.fn(),
        setDepth: vi.fn(),
        destroy: vi.fn(),
        setInteractive: vi.fn(() => {
          mockSprite.input = {};
        }),
        on: vi.fn(),
        off: vi.fn(),
        input: null,
      };

      lastGame = this;

      Object.assign(scene, {
        add: { sprite: vi.fn(() => mockSprite) },
        load: {
          image: vi.fn(),
          spritesheet: vi.fn(),
          atlasXML: vi.fn(),
          atlas: vi.fn(),
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
const { SceneNotReadyError, ObjectNotFoundError, AssetLoadError } = await import("./errors.js");

function createEngine() {
  lastScene = null;
  lastGame = null;
  const engine = new PhaserGameEngine({ parent: "app", width: 800, height: 600 });
  const scene = lastScene as BootedScene | null;
  if (!scene) throw new Error("test setup failed: scene was not created");
  if (!lastGame) throw new Error("test setup failed: game was not created");
  return { engine, scene, game: lastGame };
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

  it("throws ObjectNotFoundError when onObjectClick targets an unknown objectId", () => {
    const { engine } = createEngine();

    expect(() => engine.onObjectClick("missing", vi.fn())).toThrow(ObjectNotFoundError);
  });

  it("makes a rendered object interactive and registers a pointerdown listener", () => {
    const { engine, scene } = createEngine();
    engine.render({ objectId: "card-1", assetId: "card-ace", x: 0, y: 0 });
    const sprite = (scene.add.sprite as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockSprite;
    const listener = vi.fn();

    engine.onObjectClick("card-1", listener);

    expect(sprite.setInteractive).toHaveBeenCalledOnce();
    expect(sprite.on).toHaveBeenCalledWith("pointerdown", listener);
  });

  it("does not call setInteractive again if the object is already interactive", () => {
    const { engine, scene } = createEngine();
    engine.render({ objectId: "card-1", assetId: "card-ace", x: 0, y: 0 });
    const sprite = (scene.add.sprite as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockSprite;

    engine.onObjectClick("card-1", vi.fn());
    engine.onObjectClick("card-1", vi.fn());

    expect(sprite.setInteractive).toHaveBeenCalledOnce();
  });

  it("returns an unsubscribe function that removes the pointerdown listener", () => {
    const { engine, scene } = createEngine();
    engine.render({ objectId: "card-1", assetId: "card-ace", x: 0, y: 0 });
    const sprite = (scene.add.sprite as ReturnType<typeof vi.fn>).mock.results[0]?.value as MockSprite;
    const listener = vi.fn();

    const unsubscribe = engine.onObjectClick("card-1", listener);
    unsubscribe();

    expect(sprite.off).toHaveBeenCalledWith("pointerdown", listener);
  });

  it("loads an atlas via atlasXML when atlasDataUrl ends with .xml", async () => {
    const { engine, scene } = createEngine();

    await engine.loadAsset({
      assetId: "cards-sheet",
      category: "atlas",
      url: "/assets/cards-sheet.png",
      atlasDataUrl: "/assets/cards-sheet.xml",
    });

    expect(scene.load.atlasXML).toHaveBeenCalledWith(
      "cards-sheet",
      "/assets/cards-sheet.png",
      "/assets/cards-sheet.xml",
    );
    expect(scene.load.atlas).not.toHaveBeenCalled();
  });

  it("loads an atlas via atlas (JSON) when atlasDataUrl does not end with .xml", async () => {
    const { engine, scene } = createEngine();

    await engine.loadAsset({
      assetId: "cards-sheet",
      category: "atlas",
      url: "/assets/cards-sheet.png",
      atlasDataUrl: "/assets/cards-sheet.json",
    });

    expect(scene.load.atlas).toHaveBeenCalledWith(
      "cards-sheet",
      "/assets/cards-sheet.png",
      "/assets/cards-sheet.json",
    );
    expect(scene.load.atlasXML).not.toHaveBeenCalled();
  });

  it("throws AssetLoadError when category is atlas but atlasDataUrl is missing", async () => {
    const { engine } = createEngine();

    await expect(
      engine.loadAsset({ assetId: "cards-sheet", category: "atlas", url: "/assets/cards-sheet.png" }),
    ).rejects.toThrow(AssetLoadError);
  });

  it("destroys the underlying Phaser.Game and clears tracked objects", () => {
    const { engine, game } = createEngine();
    engine.render({ objectId: "card-1", assetId: "card-ace", x: 0, y: 0 });

    engine.destroy();

    expect(game.destroy).toHaveBeenCalledWith(true);
    expect(() => engine.destroyObject("card-1")).toThrow(ObjectNotFoundError);
  });
});
