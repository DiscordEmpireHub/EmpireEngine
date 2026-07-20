export interface Scene {
  readonly id: string;
  init?(): void;
  update?(deltaMs: number): void;
  destroy?(): void;
}

export class SceneNotRegisteredError extends Error {
  constructor(sceneId: string) {
    super(`Scene not registered: ${sceneId}`);
    this.name = "SceneNotRegisteredError";
  }
}

export class SceneManager {
  private readonly scenesById = new Map<string, Scene>();
  private activeSceneId: string | null = null;

  register(scene: Scene): void {
    this.scenesById.set(scene.id, scene);
  }

  unregister(sceneId: string): void {
    this.scenesById.get(sceneId)?.destroy?.();
    this.scenesById.delete(sceneId);
    if (this.activeSceneId === sceneId) {
      this.activeSceneId = null;
    }
  }

  activate(sceneId: string): void {
    const scene = this.scenesById.get(sceneId);
    if (!scene) {
      throw new SceneNotRegisteredError(sceneId);
    }

    this.activeSceneId = sceneId;
    scene.init?.();
  }

  getActiveScene(): Scene | null {
    if (!this.activeSceneId) return null;
    return this.scenesById.get(this.activeSceneId) ?? null;
  }

  update(deltaMs: number): void {
    this.getActiveScene()?.update?.(deltaMs);
  }
}
