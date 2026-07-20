# Graph Report - EmpireEngine  (2026-07-20)

## Corpus Check
- 45 files · ~4,579 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 364 nodes · 483 edges · 21 communities (19 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da2c7f13`
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
- AssetCache
- tsconfig.json
- PhaserGameEngine

## God Nodes (most connected - your core abstractions)
1. `LocalDiskStorage` - 17 edges
2. `PhaserGameEngine` - 13 edges
3. `AssetStorage` - 13 edges
4. `AssetMetadata` - 13 edges
5. `compilerOptions` - 13 edges
6. `AssetCache` - 10 edges
7. `AssetRecord` - 9 edges
8. `GameEngine` - 8 edges
9. `SceneManager` - 8 edges
10. `EventBus` - 7 edges

## Surprising Connections (you probably didn't know these)
- `CreateAppOptions` --references--> `AssetStorage`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/storage/AssetStorage.ts
- `AssetLoader` --references--> `AssetCache`  [EXTRACTED]
  packages/asset-loader/src/AssetLoader.ts → packages/asset-loader/src/AssetCache.ts
- `createApp()` --calls--> `createAdminAuthMiddleware()`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/adminAuth.ts
- `FakeAssetStorage` --implements--> `AssetStorage`  [EXTRACTED]
  services/asset-service/src/app.test.ts → services/asset-service/src/storage/AssetStorage.ts
- `createApp()` --calls--> `createAssetsRouter()`  [EXTRACTED]
  services/asset-service/src/app.ts → services/asset-service/src/routes/assets.ts

## Import Cycles
- None detected.

## Communities (21 total, 2 thin omitted)

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
Cohesion: 0.13
Nodes (7): CreateAppOptions, FakeAssetStorage, AssetStorage, LocalDiskStorage, AssetMetadata, AssetRecord, SaveAssetInput

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
Nodes (25): dependencies, @empire/engine-core, @empire/engine-types, description, devDependencies, phaser, typescript, vitest (+17 more)

### Community 11 - "index.ts"
Cohesion: 0.25
Nodes (6): EngineScene, EngineSceneOptions, AssetLoadError, ObjectNotFoundError, SceneNotReadyError, PhaserGameEngineConfig

### Community 12 - "tsconfig.json"
Cohesion: 0.13
Nodes (14): compilerOptions, composite, lib, outDir, rootDir, exclude, extends, include (+6 more)

### Community 13 - "PhaserGameEngine"
Cohesion: 0.17
Nodes (14): createAdminAuthMiddleware(), createApp(), asyncHandler(), AsyncRouteHandler, AssetNotFoundError, InvalidAssetIdError, MissingAdminApiKeyError, app (+6 more)

### Community 14 - "PhaserGameEngine.test.ts"
Cohesion: 0.22
Nodes (5): BootedScene, MockGame, MockLoader, MockScene, MockSprite

### Community 15 - "package.json"
Cohesion: 0.06
Nodes (34): express, multer, dependencies, express, multer, sharp, description, devDependencies (+26 more)

### Community 16 - "compilerOptions"
Cohesion: 0.13
Nodes (14): node, compilerOptions, composite, lib, outDir, rootDir, types, exclude (+6 more)

### Community 17 - "devDependencies"
Cohesion: 0.09
Nodes (21): dependencies, @empire/engine-core, @empire/engine-types, description, devDependencies, typescript, vitest, @empire/engine-core (+13 more)

### Community 18 - "AssetCache"
Cohesion: 0.21
Nodes (3): AssetCache, AssetLoader, descriptor

### Community 19 - "tsconfig.json"
Cohesion: 0.17
Nodes (11): compilerOptions, composite, outDir, rootDir, exclude, extends, include, src (+3 more)

## Knowledge Gaps
- **146 isolated node(s):** `name`, `version`, `private`, `description`, `build` (+141 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `GameEngine` connect `index.ts` to `AssetCache`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `LocalDiskStorage` connect `SceneManager` to `PhaserGameEngine`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `AssetStorage` connect `SceneManager` to `PhaserGameEngine`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _146 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09274193548387097 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._