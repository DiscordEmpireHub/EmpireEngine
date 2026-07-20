import Phaser from "phaser";
import { EventBus } from "@empire/engine-core";
import type { GameEngine } from "@empire/engine-core";
import type {
  AssetDescriptor,
  RenderParams,
  PlaySoundOptions,
  AnimateParams,
} from "@empire/engine-types";
import { EngineScene } from "./EngineScene.js";
import { SceneNotReadyError, ObjectNotFoundError, AssetLoadError } from "./errors.js";

const SCENE_READY_EVENT = "scene-ready";
const SCENE_KEY = "empire-engine-scene";

export interface PhaserGameEngineConfig {
  parent: string | HTMLElement;
  width: number;
  height: number;
}

export class PhaserGameEngine implements GameEngine {
  private readonly game: Phaser.Game;
  private readonly readyEvents = new EventBus();
  private scene: Phaser.Scene | null = null;
  private readonly objectsById = new Map<string, Phaser.GameObjects.GameObject>();

  constructor(config: PhaserGameEngineConfig) {
    const engineScene = new EngineScene({
      key: SCENE_KEY,
      onReady: () => this.handleSceneReady(engineScene),
    });

    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: config.parent,
      width: config.width,
      height: config.height,
      scene: engineScene,
    });
  }

  private handleSceneReady(scene: Phaser.Scene): void {
    this.scene = scene;
    this.readyEvents.emit(SCENE_READY_EVENT, undefined);
  }

  private requireScene(): Phaser.Scene {
    if (!this.scene) {
      throw new SceneNotReadyError();
    }
    return this.scene;
  }

  private requireObject(objectId: string): Phaser.GameObjects.GameObject {
    const object = this.objectsById.get(objectId);
    if (!object) {
      throw new ObjectNotFoundError(objectId);
    }
    return object;
  }

  onSceneReady(listener: () => void): () => void {
    if (this.scene) {
      listener();
      return () => {};
    }
    return this.readyEvents.on(SCENE_READY_EVENT, listener);
  }

  loadAsset(descriptor: AssetDescriptor): Promise<void> {
    const scene = this.requireScene();

    return new Promise((resolve, reject) => {
      this.enqueueAsset(scene, descriptor);

      scene.load.once("complete", () => resolve());
      scene.load.once("loaderror", () =>
        reject(new AssetLoadError(descriptor.assetId, "loader emitted loaderror")),
      );
      scene.load.start();
    });
  }

  private enqueueAsset(scene: Phaser.Scene, descriptor: AssetDescriptor): void {
    switch (descriptor.category) {
      case "spritesheet":
        scene.load.spritesheet(descriptor.assetId, descriptor.url, {
          frameWidth: descriptor.frameWidth ?? descriptor.width ?? 0,
          frameHeight: descriptor.frameHeight ?? descriptor.height ?? 0,
        });
        return;
      case "audio":
        scene.load.audio(descriptor.assetId, descriptor.url);
        return;
      case "tilemap":
        scene.load.tilemapTiledJSON(descriptor.assetId, descriptor.url);
        return;
      case "sprite":
      case "particle-effect":
      case "font":
        scene.load.image(descriptor.assetId, descriptor.url);
        return;
    }
  }

  render(params: RenderParams): void {
    const scene = this.requireScene();
    const sprite = scene.add.sprite(params.x, params.y, params.assetId, params.frame);

    if (params.scale !== undefined) sprite.setScale(params.scale);
    if (params.rotation !== undefined) sprite.setRotation(params.rotation);
    if (params.depth !== undefined) sprite.setDepth(params.depth);

    this.objectsById.set(params.objectId, sprite);
  }

  play(options: PlaySoundOptions): void {
    const scene = this.requireScene();
    scene.sound.play(options.assetId, {
      volume: options.volume,
      loop: options.loop,
    });
  }

  animate(params: AnimateParams): void {
    const scene = this.requireScene();
    const object = this.requireObject(params.objectId);

    scene.tweens.add({
      targets: object,
      x: params.toX,
      y: params.toY,
      scale: params.toScale,
      rotation: params.toRotation,
      alpha: params.toAlpha,
      duration: params.durationMs,
      ease: params.easing ?? "Linear",
    });
  }

  destroyObject(objectId: string): void {
    const object = this.requireObject(objectId);
    object.destroy();
    this.objectsById.delete(objectId);
  }
}
