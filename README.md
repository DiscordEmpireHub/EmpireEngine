# EmpireEngine

Game Engine and Asset Pack for EmpireHub and EmpireGames.

## Visão Geral

É o "packzão" fixo do console — o motor de renderização (Phaser) e a biblioteca central de assets (imagens, sons, efeitos) e templates de cena reutilizáveis (tabuleiro, mão de cartas, drag-and-drop, animações). É consumida diretamente como lib por `EmpireServer`, `EmpireClient`, `EmpireGames` e `EmpireSite` — não roda como serviço HTTP com porta própria (veja [`ARCHITECTURE.md`](../../../docs/project-planning-and-instructions/ARCHITECTURE.md)). Nunca importa nada específico de um jogo, do Client ou do Site — a dependência é sempre na direção contrária.

## Estrutura

```
EmpireEngine/
├── engineassets/              # assets binários — separados do código-fonte
│   ├── 2d/                      # sprites, ilustrações 2D
│   ├── 3d/                      # modelos/texturas 3D (uso pontual — ex.: dado, vista de cima)
│   ├── audio/
│   │   ├── music/
│   │   ├── sfx/                  # efeitos sonoros de gameplay
│   │   └── ui/                    # sons de interface
│   ├── fonts/
│   ├── textures/
│   └── ui/                      # elementos visuais de interface (botões, ícones)
└── src/
    ├── index.ts                # ponto de entrada / exports públicos do pacote
    ├── assetsPath.ts           # getAssetsPath() — consumido pelo EmpireServer para servir os binários
    ├── core/                   # núcleo do motor
    │   ├── Application.ts
    │   ├── EventBus.ts
    │   └── SceneManager.ts
    ├── assets/
    │   └── AssetLoader.ts        # carregamento de assets em runtime
    ├── audio/
    │   └── AudioManager.ts
    ├── input/
    │   ├── DragDrop.ts
    │   └── InputManager.ts
    └── graphics/
        ├── scenes/               # templates de cena reutilizáveis pelos jogos
        │   ├── BaseBoardScene.ts
        │   └── BaseCardScene.ts
        ├── components/           # elementos visuais reutilizáveis
        │   ├── ChipStack.ts
        │   ├── Dice3D.ts
        │   ├── HandContainer.ts
        │   └── Token3D.ts
        └── animations/
            ├── CardFlipAnimation.ts
            └── DiceRollAnimation.ts
```

> Todas as pastas de `engineassets/` só têm `.gitkeep` por enquanto (nenhum asset real ainda). Este README será ampliado com a API pública real (`render`, `play`, `animate`) assim que a codificação começar.
