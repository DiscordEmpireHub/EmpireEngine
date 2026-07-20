# Graph Report - EmpireEngine  (2026-07-20)

## Corpus Check
- 23 files · ~2,125 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 205 nodes · 234 edges · 15 communities (13 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9ec95aa0`
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

## God Nodes (most connected - your core abstractions)
1. `PhaserGameEngine` - 13 edges
2. `compilerOptions` - 13 edges
3. `GameEngine` - 8 edges
4. `SceneManager` - 8 edges
5. `EventBus` - 7 edges
6. `Scene` - 6 edges
7. `EngineScene` - 5 edges
8. `compilerOptions` - 5 edges
9. `scripts` - 4 edges
10. `packageManager` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (15 total, 2 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.10
Nodes (19): dependencies, @empire/engine-types, description, devDependencies, typescript, vitest, @empire/engine-types, typescript (+11 more)

### Community 1 - "index.ts"
Cohesion: 0.15
Nodes (4): EventBus, EventListener, Unsubscribe, GameEngine

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (14): description, devEngines, packageManager, name, name, onFail, version, private (+6 more)

### Community 3 - "SceneManager"
Cohesion: 0.19
Nodes (3): Scene, SceneManager, SceneNotRegisteredError

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
Cohesion: 0.25
Nodes (6): EngineScene, EngineSceneOptions, AssetLoadError, ObjectNotFoundError, SceneNotReadyError, PhaserGameEngineConfig

### Community 12 - "tsconfig.json"
Cohesion: 0.13
Nodes (14): compilerOptions, composite, lib, outDir, rootDir, exclude, extends, include (+6 more)

### Community 14 - "PhaserGameEngine.test.ts"
Cohesion: 0.22
Nodes (5): BootedScene, MockGame, MockLoader, MockScene, MockSprite

## Knowledge Gaps
- **88 isolated node(s):** `name`, `version`, `private`, `description`, `build` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `PhaserGameEngine` connect `PhaserGameEngine` to `index.ts`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Why does `SceneManager` connect `SceneManager` to `index.ts`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._