const ASSET_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;

export function isValidAssetId(id: string): boolean {
  return ASSET_ID_PATTERN.test(id);
}
