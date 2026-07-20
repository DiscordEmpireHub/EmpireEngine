# Graph Report - EmpireEngine  (2026-07-20)

## Corpus Check
- 38 files · ~4,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 315 nodes · 426 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee3183ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- index.ts
- package.json
- SceneManager
- compilerOptions
- package.json
- tsconfig.json
- tsconfig.json
- index.ts
- README.md
- package.json
- index.ts
- tsconfig.json
- PhaserGameEngine
- PhaserGameEngine.test.ts
- package.json
- compilerOptions
- devDependencies

## God Nodes (most connected - your core abstractions)
1. `LocalDiskStorage` - 17 edges
2. `PhaserGameEngine` - 13 edges
3. `AssetStorage` - 13 edges
4. `AssetMetadata` - 13 edges
5. `compilerOptions` - 13 edges
6. `AssetRecord` - 9 edges
7. `GameEngine` - 8 edges
8. `SceneManager` - 8 edges
9. `EventBus` - 7 edges
10. `FakeAssetStorage` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CreateAppOptions` --references--> `AssetStorage`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/storage/AssetStorage.ts
- `createApp()` --calls--> `createAdminAuthMiddleware()`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/adminAuth.ts
- `FakeAssetStorage` --implements--> `AssetStorage`  [EXTRACTED]
  services/asset-service/src/app.test.ts → services/asset-service/src/storage/AssetStorage.ts
- `createApp()` --calls--> `createAssetsRouter()`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/routes/assets.ts
- `createApp()` --calls--> `createUploadRouter()`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/routes/upload.ts

## Import Cycles
- None detected.

## Communities (18 total, 1 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, @empire/engine-types, description, devDependencies, typescript, vitest, @empire/engine-types, typescript (+11 more)

### Community 1 - "index.ts"
Cohesion: 0.09
Nodes (7): EventBus, EventListener, Unsubscribe, GameEngine, Scene, SceneManager, SceneNotRegisteredError

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (14): description, devEngines, packageManager, name, name, onFail, version, private (+6 more)

### Community 3 - "SceneManager"
Cohesion: 0.15
Nodes (6): FakeAssetStorage, AssetStorage, LocalDiskStorage, AssetMetadata, AssetRecord, SaveAssetInput

### Community 4 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module, moduleResolution (+6 more)

### Community 5 - "package.json"
Cohesion: 0.14
Nodes (13): description, devDependencies, typescript, typescript, main, name, private, scripts (+5 more)

### Community 6 - "tsconfig.json"
Cohesion: 0.17
Nodes (11): compilerOptions, composite, outDir, rootDir, exclude, extends, include, src (+3 more)

### Community 7 - "tsconfig.json"
Cohesion: 0.22
Nodes (8): compilerOptions, composite, outDir, rootDir, extends, include, src, ../../tsconfig.base.json

### Community 8 - "index.ts"
Cohesion: 0.43
Nodes (5): AssetCategory, AssetDescriptor, AnimateParams, PlaySoundOptions, RenderParams

### Community 10 - "package.json"
Cohesion: 0.08
Nodes (25): @empire/engine-core, dependencies, @empire/engine-core, @empire/engine-types, description, devDependencies, phaser, typescript (+17 more)

### Community 11 - "index.ts"
Cohesion: 0.13
Nodes (7): EngineScene, EngineSceneOptions, AssetLoadError, ObjectNotFoundError, SceneNotReadyError, PhaserGameEngine, PhaserGameEngineConfig

### Community 12 - "tsconfig.json"
Cohesion: 0.13
Nodes (14): compilerOptions, composite, lib, outDir, rootDir, exclude, extends, include (+6 more)

### Community 13 - "PhaserGameEngine"
Cohesion: 0.15
Nodes (15): createAdminAuthMiddleware(), createApp(), CreateAppOptions, asyncHandler(), AsyncRouteHandler, AssetNotFoundError, InvalidAssetIdError, MissingAdminApiKeyError (+7 more)

### Community 14 - "PhaserGameEngine.test.ts"
Cohesion: 0.22
Nodes (5): BootedScene, MockGame, MockLoader, MockScene, MockSprite

### Community 15 - "package.json"
Cohesion: 0.10
Nodes (19): express, multer, dependencies, express, multer, sharp, description, main (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.13
Nodes (14): node, compilerOptions, composite, lib, outDir, rootDir, types, exclude (+6 more)

### Community 17 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, supertest, @types/express, @types/multer, @types/node, @types/supertest, typescript, vitest (+7 more)

## Knowledge Gaps
- **123 isolated node(s):** `name`, `version`, `private`, `description`, `build` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `LocalDiskStorage` connect `SceneManager` to `PhaserGameEngine`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `AssetStorage` connect `SceneManager` to `PhaserGameEngine`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08901515151515152 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._