# Manifesto de Assets da Engine (2D Sprites, Áudio & Partículas)

> **Nota de revisão:** a versão anterior deste documento descrevia um pipeline 3D
> (malhas, materiais PBR). A implementação real da Engine
> (`packages/phaser-adapter/src/PhaserGameEngine.ts`) é **2D, baseada em Phaser** —
> `GameEngine.render()` desenha um `sprite` a partir de um `assetId` já carregado,
> não existe conceito de malha 3D nem de material separado da textura. Este
> documento foi reescrito para espelhar exatamente o contrato real:
> `AssetDescriptor` (`packages/types/src/asset.ts`) e o `asset-service`
> (`services/asset-service`).

## 0. Como este documento mapeia para o código real

```ts
// packages/types/src/asset.ts
type AssetCategory = "sprite" | "spritesheet" | "audio" | "particle-effect" | "font" | "tilemap";

interface AssetDescriptor {
  assetId: string;   // ver padrão de nomenclatura abaixo
  category: AssetCategory;
  url: string;        // resolvido em runtime como `${ENGINE_ASSET_SERVICE_URL}/assets/:assetId`
  width?: number;
  height?: number;
  frameWidth?: number;  // apenas category === "spritesheet"
  frameHeight?: number; // apenas category === "spritesheet"
}
```

Todo `assetId` citado neste documento deve casar com o validador real do
`asset-service` (`services/asset-service/src/validation.ts`):

```ts
const ASSET_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
```

Ou seja: **apenas** letras, números, `_` e `-`. Por isso os temas abaixo usam
`classic` / `modern_minimal` / `cyber_neon` (minúsculo, snake_case) em vez de
`Classic` / `Modern_Minimal` / `Cyber_Neon` — mistura de maiúsculas no
`assetId` funciona no validador, mas quebra a convenção do resto do projeto
(ids de jogo, chaves de manifest são sempre minúsculas) e cria risco de
mismatch client/servidor. **Não existe "malha base + material" como dois
assets separados** — no 2D, cada combinação objeto+tema já é a imagem final,
um único `assetId`.

**Cobertura:** os 30 jogos abaixo vêm de `EmpireGames/gameslist.txt`
(identificação oficial, padrão `prefix-platform-name-min_players-max_players`).
A versão anterior deste documento não cobria `game-party-word_association-4-8`
— corrigido na Seção 4.

---

## 1. Padrão de Nomenclatura para `assetId`

| Tipo de asset | Categoria (`AssetCategory`) | Padrão de `assetId` | Observação |
| :--- | :--- | :--- | :--- |
| Sprite 2D (arte completa, já com o tema aplicado) | `sprite` | `[nome_do_objeto]_[tema]` | Sem asset "base" separado — cada tema é uma imagem própria. |
| Spritesheet (múltiplos frames — ex. captura de peça, flip de carta) | `spritesheet` | `[nome_do_objeto]_[tema]` | Requer `frameWidth`/`frameHeight` no `AssetDescriptor`. |
| Efeito sonoro | `audio` | `sfx_[evento]_[variante]` | Mantido do desenho original — já era compatível. |
| Efeito de partícula (fumaça, confete, brilho) | `particle-effect` | `vfx_[evento]_[tema]` | Usa a categoria `particle-effect` do motor, antes não utilizada neste doc. |
| Animação pura por tween (sem imagem própria) | *(não é asset)* | — | Ver Seção 5 — implementada via `engine.animate()` no código do jogo, não é um arquivo binário. |

**Temas válidos (3, aplicados a todo `[tema]` acima):** `classic`,
`modern_minimal`, `cyber_neon`.

---

## 2. Tabela de Assets Visuais (Sprite / Spritesheet)

Cada linha abaixo vira, na prática, **3 arquivos de imagem** (um por tema),
registrados no `asset-service` com `category: "sprite"` (ou `"spritesheet"`
onde indicado).

| Asset (prefixo do `assetId`) | Categoria | Jogos (`gameslist.txt`) | Descrição visual base | Tema `classic` | Tema `modern_minimal` | Tema `cyber_neon` |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`board_mat_felt`** | sprite | `game-card-truco-2-4`, `game-card-hearts-4-4`, `game-card-blackjack-2-8`, `game-card-president-3-8`, `game-card-solitaire-1-1`, `game-card-poker_texas_holdem-2-8`, `game-card-spades-4-4`, `game-card-crazy_eights-2-7`, `game-card-cheat-3-10`, `game-card-rummy-2-4`, `game-tabletop-yahtzee-2-6`, `game-board-dominoes-2-4` | Fundo de mesa retangular/oval, cantos arredondados. | Feltro verde-cassino profundo, textura de tecido visível. | Cinza-concreto fosco, textura lisa. | Placa preta fosca com trilhas de circuito impressas em azul emissivo. |
| **`board_base_wood`** | sprite | `game-board-chess-2-2`, `game-board-checkers-2-2`, `game-board-ludo-2-4`, `game-board-reversi-2-2`, `game-board-backgammon-2-2`, `game-board-mancala-2-2`, `game-tabletop-gomoku-2-2`, `game-tabletop-dots_and_boxes-2-4`, `game-tabletop-battleship-2-2`, `game-tabletop-sudoku-1-1`, `game-tabletop-shuffleboard-2-4` | Retângulo com moldura rebaixada. | Nogueira escura, veios sutis. | Carvalho claro acetinado, linhas retas. | Fibra de carbono trançada, bordas em alumínio anodizado escuro. |
| **`token_disc_flat`** | sprite | `game-board-checkers-2-2`, `game-board-reversi-2-2`, `game-board-backgammon-2-2`, `game-tabletop-gomoku-2-2`, `game-board-ludo-2-4`, `game-tabletop-yahtzee-2-6` | Disco circular de perfil baixo. | Baquelite polida (conjunto Marfim / Preto Ébano). | Cerâmica fosca (conjunto Cinza-Claro / Grafite). | Acrílico translúcido com núcleo emissivo (conjunto Cyan / Magenta). |
| **`dice_d6_standard`** | spritesheet (6 frames, uma por face) | `game-tabletop-yahtzee-2-6`, `game-board-backgammon-2-2`, `game-board-ludo-2-4` | Cubo visto em 2D com pintas. | Branco brilhante, pintas pretas (1 em vermelho). | Preto fosco, pintas brancas. | Vidro fumê translúcido, pintas em verde neon. |
| **`card_back`** | sprite | Todos os 10 jogos de carta (`truco`, `hearts`, `blackjack`, `president`, `solitaire`, `poker_texas_holdem`, `spades`, `crazy_eights`, `cheat`, `rummy`) | Verso de carta, retângulo com cantos arredondados. | Padronagem arabesca azul-marinho e bordas brancas. | Padrão geométrico monocromático minimalista. | Malha vetorial roxo/laranja com borda holográfica. |
| **`card_face_set`** | spritesheet (52 frames + coringas) | *(mesmos 10 jogos de carta acima)* | Frente de carta — mesma malha do verso. | Fundo creme, naipes em Vermelho Crimson / Preto Carbono. | Fundo branco, naipes em linhas finas sans-serif. | Fundo preto, naipes em neon alto-contraste. |
| **`chess_piece_{king\|queen\|bishop\|knight\|rook\|pawn}_{white\|black}`** | sprite | `game-board-chess-2-2` | 6 peças × 2 cores = 12 sprites por tema. | Madeira entalhada (Claras: Bordo / Escuras: Palisandro). | Metal fosco (Claras: Alumínio Escovado / Escuras: Aço Carbono). | Polímero semi-translúcido (Claras: Azul Glacial / Escuras: Âmbar). |
| **`domino_tile_standard`** | sprite | `game-board-dominoes-2-4` | Retângulo com friso central e pintas. | Baquelite marfim, cavidades pretas, pino de latão. | Cerâmica preta fosca, cavidades brancas. | Metálico cinza-chumbo, pintas em LED branco. |
| **`grid_board_matrix`** | sprite | `game-tabletop-tic_tac_toe-2-2`, `game-tabletop-gomoku-2-2`, `game-tabletop-battleship-2-2`, `game-tabletop-minesweeper-1-1`, `game-tabletop-sudoku-1-1`, `game-arcade-tetris-1-1`, `game-tabletop-dots_and_boxes-2-4` | Grade quadriculada plana. | Madeira compensada, linhas em marquetaria contrastante. | Metal escovado grafite, linhas finas a laser. | Fundo escuro, linhas de grade emissivas (glow cyan). |
| **`marker_symbol_x`** / **`marker_symbol_o`** | sprite | `game-tabletop-tic_tac_toe-2-2` (ambos), `game-tabletop-battleship-2-2` (hit/miss), `game-tabletop-minesweeper-1-1` (bandeira, só `x`), `game-tabletop-sudoku-1-1` (dígito de anotação) | Marca 2D preenchida. | X vermelho carmim / O azul cobalto, traço tipo pincel sólido. | X cinza-escuro / O contorno branco fino, geométrico. | X magenta neon com glow / O cyan neon com glow. |
| **`pawn_classic`** | sprite | `game-board-ludo-2-4`, `game-arcade-sheep_fight-2-2` (unidade simples) | Peão clássico visto de frente (base cônica, cabeça esférica). | Plástico brilhante (Vermelho, Azul, Amarelo, Verde). | Tons pastéis acetinados (Rosa, Azul-névoa, Sage, Mostarda). | Contorno translúcido com núcleo emissivo nas 4 cores primárias neon. |
| **`backgammon_inlay_zone`** | sprite | `game-board-backgammon-2-2`, `game-tabletop-shuffleboard-2-4` | Superfície com triângulos intercalados. | Marquetaria clara/queimada tradicional. | Serigrafia cinza sobre policarbonato. | Painel acrílico com triângulos delimitados por LED RGB. |
| **`dice_cup_holder`** | sprite | `game-tabletop-yahtzee-2-6`, `game-board-backgammon-2-2` | Copo cônico visto de perfil. | Couro marrom-café, feltro interno verde. | Alumínio escovado, interior emborrachado preto. | Fibra de carbono preta, interior em feltro cinza-escuro. |
| **`mancala_board_pits`** | sprite | `game-board-mancala-2-2`, `game-tabletop-yahtzee-2-6` (contadores) | Bloco com 12 cavas circulares + 2 depósitos. | Madeira maciça, gemas em vidro soprado translúcido. | Pedra-sabão/mármore, gemas em metal polido. | Bandeja acrílica escura, cavas retroiluminadas, gemas UV. |
| **`puck_disc_heavy`** | sprite | `game-tabletop-shuffleboard-2-4`, `game-arcade-pong-2-2` | Disco metálico de perfil baixo. | Aço cromado, capa plástica (Azul/Vermelho). | Cerâmica densa, anel emborrachado (Preto/Branco). | Liga titânio com anel periférico emissivo neon. |
| **`dots_connector_set`** | sprite | `game-tabletop-dots_and_boxes-2-4`, `game-tabletop-battleship-2-2` (grade) | Pinos e hastes de conexão. | Pinos cromados, hastes plásticas coloridas. | Pinos e hastes em polímero branco/preto acetinado. | Pinos metálicos, hastes acrílicas que acendem ao fechar linha. |
| **`arcade_block_modular`** | sprite | `game-arcade-tetris-1-1`, `game-arcade-snake-1-1`, `game-arcade-pong-2-2` (paletas) | Blocos/barras retrô. | Plástico rígido estilo brinquedo de encaixe anos 80. | Cerâmica lisa, bordas vivas, saturação reduzida. | Estética Voxel/Synthwave, neon interno. |
| **`ui_hud_frame_panel`** | sprite | **Todos os 30 jogos** (UI/placar/turnos) | Moldura/painel retangular com recorte para texto. | Madeira nobre, interior em papel pergaminho. | Glassmorphism — vidro fumê semi-transparente, borda em alumínio. | Placa holográfica translúcida, detalhes neon, scanline sutil. |

---

## 3. Tabela de Efeitos Sonoros (`audio`)

Sem alteração estrutural em relação à versão anterior — os nomes já
respeitavam `sfx_[evento]_[variante]`, compatível com `category: "audio"`.
Uma variante `_neon` foi adicionada a `sfx_piece_place` para dar ao tema
`cyber_neon` um som próprio (antes só existiam variantes de material físico:
feltro/madeira/plástico/metal, nenhuma digital).

| Asset (`assetId` = prefixo + variante) | Onde é usado | Descrição do efeito | Variações |
| :--- | :--- | :--- | :--- |
| **`sfx_piece_place`** | Chess, Checkers, Dominoes, Reversi, Gomoku, Tic Tac Toe, Sudoku, Dots & Boxes | Impacto seco de peça assentada. | `_felt`, `_wood`, `_plastic`, `_metal`, `_neon` (novo — bipe sintético curto, para tema `cyber_neon`) |
| **`sfx_piece_slide`** | Shuffleboard, Checkers, Backgammon, Chess, Tetris, Snake | Atrito/deslizamento contínuo. | `_felt`, `_wood`, `_metal` |
| **`sfx_card_draw`** | 10 jogos de carta | Fricção rápida ao puxar carta. | N/A |
| **`sfx_card_shuffle`** | 10 jogos de carta | Riffle shuffle. | N/A |
| **`sfx_card_discard`** | Truco, Poker, Blackjack, Solitaire, Rummy, Cheat, Crazy Eights | Carta caindo na pilha. | `_felt`, `_wood` |
| **`sfx_card_flip`** | Solitaire, Poker, Blackjack | Estalo de rotação da carta. | N/A |
| **`sfx_dice_roll`** | Yahtzee, Backgammon, Ludo | Chocalhar + impactos. | `_cup_leather`, `_cup_plastic`, `_table_wood`, `_table_felt` |
| **`sfx_timer_tick`** | Todos com tempo limite | Pulsar dos segundos finais. | `_classic`, `_digital`, `_synth` |
| **`sfx_timer_expired`** | Todos com tempo limite | Estouro de tempo. | `_classic`, `_digital`, `_synth` |
| **`sfx_turn_pass`** | Todos os 30 jogos | Transição de vez. | `_classic`, `_modern`, `_cyber` |
| **`sfx_match_win`** | Todos os 30 jogos | Celebração de vitória. | `_classic`, `_modern`, `_cyber` |
| **`sfx_match_lose`** | Todos os 30 jogos | Efeito negativo de derrota. | `_classic`, `_modern`, `_cyber` |
| **`sfx_match_draw`** | Chess, Checkers, Tic Tac Toe, Reversi, etc. | Encerramento neutro em empate. | `_classic`, `_modern`, `_cyber` |
| **`sfx_capture_eliminate`** | Chess, Checkers, Ludo, Battleship, Minesweeper | Peça capturada/destruída. | `_solid`, `_explosion` |
| **`sfx_score_point`** | Tetris, Snake, Dots & Boxes, Yahtzee, Shuffleboard, Pong | Soma de pontos. | `_bell`, `_coin`, `_synth` |
| **`sfx_ui_click`** | Todos os 30 jogos | Clique de UI/menu. | `_classic`, `_modern`, `_cyber` |

---

## 4. Cobertura Explícita dos 30 Jogos

A versão anterior não citava `game-party-word_association-4-8` em nenhuma
tabela. Correção:

| Jogo | Assets visuais dedicados | Assets compartilhados usados |
| :--- | :--- | :--- |
| `game-party-word_association-4-8` | **`prompt_card_word`** (novo, `sprite`, 3 temas — cartão exibindo a palavra/tema da rodada) | `ui_hud_frame_panel`, `sfx_turn_pass`, `sfx_ui_click`, `sfx_timer_tick`/`sfx_timer_expired`, `sfx_match_win`/`sfx_match_lose` (se houver pontuação por equipe) |

Todos os demais 29 jogos já estavam cobertos (verificado linha a linha contra
`EmpireGames/gameslist.txt`); nenhuma outra lacuna encontrada.

---

## 5. Animações — Partícula real vs. Tween de código

A tabela "Animações e VFX" da versão anterior misturava dois tipos bem
diferentes no motor atual. Separados abaixo:

### 5a. `particle-effect` (asset binário real, categoria `particle-effect`)

| `assetId` | Onde é usado | Descrição |
| :--- | :--- | :--- |
| **`vfx_confetti_{tema}`** | Banner de vitória (todos os 30 jogos) | Textura de partícula de confete, ligada via `AssetDescriptor.category: "particle-effect"`. |
| **`vfx_tile_dissolve_{tema}`** | Tetris, Minesweeper | Textura de partícula de desintegração ao limpar linha/célula. |

### 5b. Animação pura por tween (SEM asset binário)

Estas NÃO são registradas no `asset-service` — são chamadas de
`engine.animate({ objectId, toX, toY, toScale, toRotation, toAlpha,
durationMs, easing })` feitas pelo próprio código do jogo em cima de um
objeto já renderizado (`render()`):

- `anim_piece_hop` — arco parabólico (`toY` intermediário + `toX`/`toY` final).
- `anim_turn_indicator` — pulso de escala (`toScale`) em loop curto.
- `anim_win_banner` / `anim_lose_banner` — fade + scale (`toAlpha` + `toScale`).
- `anim_ui_attention` — pulso de escala sutil em loop.

Cada jogo documenta seus próprios parâmetros de tween no seu
`GAME-DEVELOPMENT-GUIDE.md`/README — não pertence a este manifesto de assets
binários.

---

## 6. Estrutura de Pastas (fonte dos assets, antes do registro no `asset-service`)

```
EmpireEngine/
  assets-source/                     # versionado no git — fonte editável (SVG)
    sprite/
      classic/
        grid_board_matrix_classic.svg
        marker_symbol_x_classic.svg
        marker_symbol_o_classic.svg
        ui_hud_frame_panel_classic.svg
      modern_minimal/
        ...
      cyber_neon/
        ...
    spritesheet/
      <tema>/...
    audio/
      sfx_piece_place_wood.wav
      sfx_piece_place_metal.wav
      sfx_piece_place_neon.wav
      ...
    particle-effect/
      <tema>/...
  services/
    asset-service/
      data/assets/                   # NÃO versionado (.gitignore) — store runtime,
                                      # populado pelo script de seed a partir de assets-source/
```

`assets-source/` é a fonte de verdade editável (SVG vetorial, fácil de
recolorir por tema). O script de seed (`scripts/assets/seed-asset-service.mjs`,
ver `docs/ASSET-DEVELOPMENT-PLAN.md`) rasteriza/copia cada arquivo e faz
`POST /assets` com `x-admin-api-key`, populando `data/assets/` — que é o
diretório realmente servido pelo `asset-service` em runtime.
