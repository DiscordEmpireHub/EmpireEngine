export class AssetNotFoundError extends Error {
  constructor(id: string) {
    super(`Asset not found: ${id}`);
    this.name = "AssetNotFoundError";
  }
}

export class InvalidAssetIdError extends Error {
  constructor(id: string) {
    super(`Invalid asset id: ${id}`);
    this.name = "InvalidAssetIdError";
  }
}

export class MissingAdminApiKeyError extends Error {
  constructor() {
    super("ADMIN_API_KEY environment variable is required to start the asset service");
    this.name = "MissingAdminApiKeyError";
  }
}
