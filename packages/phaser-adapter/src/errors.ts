export class SceneNotReadyError extends Error {
  constructor() {
    super(
      "PhaserGameEngine: scene ainda nao esta pronta. Aguarde onSceneReady antes de chamar metodos do engine.",
    );
    this.name = "SceneNotReadyError";
  }
}

export class ObjectNotFoundError extends Error {
  constructor(objectId: string) {
    super(`Object not found: ${objectId}`);
    this.name = "ObjectNotFoundError";
  }
}

export class AssetLoadError extends Error {
  constructor(assetId: string, reason: string) {
    super(`Failed to load asset ${assetId}: ${reason}`);
    this.name = "AssetLoadError";
  }
}
