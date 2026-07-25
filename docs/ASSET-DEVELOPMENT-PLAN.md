# Plano de Desenvolvimento de Assets — EmpireEngine

Companion prático de `example-assets.md` (o manifesto/catálogo). Este
documento é o **plano de execução**: em que ordem os assets são produzidos,
com que ferramenta, e como chegam ao `asset-service` rodando.

## 0. Escopo desta primeira passada

Produzir 30 assets reais (não placeholders desenhados à mão, mas gerados
programaticamente e funcionalmente corretos — carregáveis pelo
`PhaserGameEngine` de verdade) o suficiente para:

1. Provar o pipeline fonte → geração → seed → `asset-service` → jogo.
2. Desbloquear o Tic Tac Toe (`game-tabletop-tic_tac_toe-2-2`) rodando 100%
   via Engine, nos 3 temas.

Os demais 29 jogos ficam como **backlog faseado** (Seção 2) — não são
produzidos nesta passada por volume (30 jogos × múltiplos assets × 3 temas é
um catálogo de centenas de arquivos, fora do escopo de uma única sessão).

## 1. Fase 0 + Fase 1 (produzidas agora)

| # | `assetId` | Categoria | Jogo(s) | Script gerador |
| :-- | :-- | :-- | :-- | :-- |
| 1-3 | `grid_board_matrix_{classic,modern_minimal,cyber_neon}` | sprite | Tic Tac Toe (+ backlog: Gomoku, Battleship, Minesweeper, Sudoku, Tetris, Dots and Boxes) | `scripts/assets/generate-sprites.mjs` |
| 4-6 | `marker_symbol_x_{classic,modern_minimal,cyber_neon}` | sprite | Tic Tac Toe (+ backlog: Battleship, Minesweeper) | idem |
| 7-9 | `marker_symbol_o_{classic,modern_minimal,cyber_neon}` | sprite | Tic Tac Toe | idem |
| 10-12 | `ui_hud_frame_panel_{classic,modern_minimal,cyber_neon}` | sprite | Todos os 30 jogos (compartilhado) | idem |
| 13-15 | `sfx_piece_place_{wood,metal,neon}` | audio | Tic Tac Toe (+ backlog: Chess, Checkers, Dominoes, Reversi, Gomoku, Sudoku, Dots & Boxes) | `scripts/assets/generate-audio.mjs` |
| 16-18 | `sfx_turn_pass_{classic,modern,cyber}` | audio | Todos os 30 jogos | idem |
| 19-21 | `sfx_match_win_{classic,modern,cyber}` | audio | Todos os 30 jogos | idem |
| 22-24 | `sfx_match_lose_{classic,modern,cyber}` | audio | Todos os 30 jogos | idem |
| 25-27 | `sfx_match_draw_{classic,modern,cyber}` | audio | Tic Tac Toe (+ backlog: Chess, Checkers, Reversi) | idem |
| 28-30 | `sfx_ui_click_{classic,modern,cyber}` | audio | Todos os 30 jogos | idem |

Mapeamento de tema → variante de SFX física (onde a Seção 3 do manifesto usa
nomes de material em vez de tema): `classic → _wood`, `modern_minimal →
_metal`, `cyber_neon → _neon` para `sfx_piece_place`; os demais SFX já usam
`_classic`/`_modern`/`_cyber` diretamente.

## 2. Backlog faseado (não produzido nesta passada)

| Fase | Jogos | Assets principais a gerar |
| :-- | :-- | :-- |
| 2 | Gomoku, Battleship, Minesweeper, Sudoku, Tetris, Dots and Boxes | Reutilizam `grid_board_matrix`/`marker_symbol_*` já produzidos + `dots_connector_set`, `arcade_block_modular` |
| 3 | 10 jogos de carta (Truco, Hearts, Blackjack, President, Solitaire, Poker, Spades, Crazy Eights, Cheat, Rummy) | `board_mat_felt`, `card_back`, `card_face_set` (spritesheet 52+coringas) |
| 4 | Chess, Checkers, Ludo, Reversi, Backgammon, Mancala, Dominoes, Yahtzee, Shuffleboard | `board_base_wood`, `token_disc_flat`, `dice_d6_standard`, `chess_piece_*` (12 sprites/tema), `domino_tile_standard`, `backgammon_inlay_zone`, `dice_cup_holder`, `mancala_board_pits`, `puck_disc_heavy` |
| 5 | Tetris, Snake, Pong, Sheep Fight | `arcade_block_modular`, `pawn_classic`, `puck_disc_heavy` |
| 6 | Word Association | `prompt_card_word` |

Cada fase segue o mesmo ciclo da Fase 0+1: gerar em `assets-source/` → seed
no `asset-service` → validar via `GET /assets?category=` → integrar no jogo.

## 3. Pipeline técnico

```
assets-source/<categoria>/<tema>/<assetId>.<ext>   (git, editável)
        │  scripts/assets/generate-sprites.mjs / generate-audio.mjs
        ▼
(gera .svg → rasteriza .png via sharp | sintetiza .wav via PCM puro)
        │  scripts/assets/seed-asset-service.mjs
        ▼
POST http://localhost:${PORT}/assets  (multipart, x-admin-api-key)
        ▼
services/asset-service/data/assets/   (runtime, não versionado)
        │  GET /assets/:id
        ▼
AssetLoader.load(descriptor) → PhaserGameEngine.loadAsset() → render()/play()
```

- **`generate-sprites.mjs`**: monta cada sprite como SVG (gradientes/filtros
  para o tema `cyber_neon`), rasteriza com `sharp` (já é dependência do
  `asset-service`) para PNG 512×512 (board/hud) ou 128×128 (marcador X/O).
- **`generate-audio.mjs`**: sintetiza PCM 16-bit mono 44.1kHz em memória
  (envelope + onda senoidal/quadrada/triangular conforme o tema) e escreve
  WAV via cabeçalho RIFF manual — zero dependências externas de áudio.
- **`seed-asset-service.mjs`**: varre `assets-source/`, infere `category` a
  partir do primeiro segmento do caminho e `assetId` a partir do nome do
  arquivo, faz `POST /assets` para cada um.

## 4. Definição de pronto (Fase 0+1)

- [ ] Os 30 arquivos da Seção 1 existem em `assets-source/`.
- [ ] `asset-service` local rodando com `ADMIN_API_KEY` definido.
- [ ] Todos os 30 registrados com sucesso (`GET /assets` retorna os 30 ids).
- [ ] Tic Tac Toe (`main.tsx`) consegue `loadAsset` + `render`/`play` cada um
  via `PhaserGameEngine` sem erro (verificado em `E1-E4`, task subsequente).
