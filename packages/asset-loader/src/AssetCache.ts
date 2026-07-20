export class AssetCache {
  private readonly entries = new Map<string, Promise<void>>();

  get(assetId: string): Promise<void> | undefined {
    return this.entries.get(assetId);
  }

  set(assetId: string, promise: Promise<void>): void {
    this.entries.set(assetId, promise);
  }

  evict(assetId: string): void {
    this.entries.delete(assetId);
  }

  clear(): void {
    this.entries.clear();
  }
}
