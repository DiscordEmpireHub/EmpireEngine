import Phaser from "phaser";

export interface EngineSceneOptions {
  key: string;
  onReady: () => void;
}

export class EngineScene extends Phaser.Scene {
  private readonly notifyReady: () => void;

  constructor(options: EngineSceneOptions) {
    super(options.key);
    this.notifyReady = options.onReady;
  }

  create(): void {
    this.notifyReady();
  }
}
