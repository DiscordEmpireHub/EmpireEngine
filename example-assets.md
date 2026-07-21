# Arquitetura Global de Assets da Engine (3D, Áudio & Animações)

**Padrão de Nomenclatura para Invocação na Engine:**
* **Malha 3D / Objeto Base:** `[NOME_DO_OBJETO]`
* **Material / Textura:** `[NOME_DO_OBJETO]_[TEMA]` (Temas: `Classic`, `Modern_Minimal`, `Cyber_Neon`)
* **Efeito Sonoro (SFX):** `sfx_[EVENTO]_[VARIANTE]`
* **Animação / VFX:** `anim_[TIPO]_[EVENTO]`

---

## 1. Tabela Unificada de Assets de Malha 3D e Materiais (PBR)

| Asset (Identificador da Mesh) | Onde é Compartilhado no Ecossistema | Geometria / Mesh Base | Textura 01: `Classic` | Textura 02: `Modern_Minimal` | Textura 03: `Cyber_Neon` |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`board_mat_felt`** | *Todos os 10 Jogos de Cartas, Yahtzee, Dominoes.* | Plano retangular/oval com cantos arredondados e borda chanfrada. | Feltro verde-cassino profundo com rugosidade alta. | Neoprene cinza-concreto fosco. | Placa polimérica preta fosca com circuitos impressos em azul emissivo. |
| **`board_base_wood`** | *Chess, Checkers, Ludo, Reversi, Backgammon, Mancala, Gomoku, Dots and Boxes, Battleship, Sudoku, Shuffleboard.* | Bloco 3D retangular maciço com moldura rebaixada e chanfro industrial. | Madeira Nogueira escura envernizada com veios sutis. | Madeira Carvalho Claro (*Scandinavian White Oak*) acetinada. | Placa de fibra de carbono trançada com bordas de alumínio anodizado escuro. |
| **`token_disc_flat`** | *Checkers, Reversi, Backgammon, Gomoku, Marcadores de Ludo/Yahtzee.* | Cilindro de perfil baixo com bordas arredondadas e ranhura no topo. | Baquelite polida (Conjunto: Marfim / Preto Ébano). | Cerâmica técnica fosca (Conjunto: Cinza-Claro / Grafite). | Acrílico translúcido com núcleo LED (Conjunto: Cyan emissivo / Magenta emissivo). |
| **`dice_d6_standard`** | *Yahtzee, Backgammon, Ludo.* | Cubo 3D perfeito com vértices arredondados e 21 pintas rebaixadas. | Resina acrílica branca brilhante com cavidades pretas (1 em vermelho). | Polímero preto fosco com cavidades gravadas em branco puro. | Cubo de vidro fumê translúcido com cavidades gravadas acesas em verde neon. |
| **`card_back_mesh`** | *Todos os 10 Jogos de Baralho.* | Plano ultrafino retangular com cantos arredondados. | Padronagem clássica arabesca/treliça em azul-marinho e bordas brancas. | Padrão geométrico abstrato monocromático minimalista. | Malha vetorial Cyberpunk em degradê roxo/laranja com borda holográfica. |
| **`card_face_set`** | *Todos os 10 Jogos de Baralho.* | Plano ultrafino retangular (mesma malha do verso). | Fundo creme/marfim clássico, naipes em Vermelho Crimson e Preto Carbono. | Fundo branco puro, naipes estilizados em linhas finas com tipografia sans-serif. | Fundo preto profundo, naipes em cores neon de alto contraste (Vermelho, Amarelo, Cyan, Roxo). |
| **`chess_set_staunton`** | *Chess.* | 6 Malhas 3D (Rei, Rainha, Bispo, Cavalo, Torre, Peão) com base circular. | Madeira entalhada polida (Claras: Bordo / Escuras: Palisandro). | Metal fundido fosco (Claras: Alumínio Escovado / Escuras: Aço Carbono Fosco). | Malhas em polímero semi-translucido (Claras: Azul Glacial / Escuras: Amarelo Âmbar). |
| **`domino_tile_standard`** | *Dominoes.* | Paralelepípedo com friso rebaixado central e cava de pintas. | Baquelite creme/marfim, cavidades pretas e pino central (*spinner*) de latão. | Bloco cerâmico totalmente preto fosco com cavidades pintadas em branco. | Estrutura metálica cinza-chumbo com frizo central e pintas acesas em LED branco. |
| **`grid_board_matrix`** | *Tic Tac Toe, Gomoku, Battleship, Minesweeper, Sudoku, Tetris, Dots and Boxes.* | Estrutura matricial plana em baixo-relevo com divisórias quadradas. | Madeira compensada com linhas em marquetaria de tom contrastante. | Metal escovado cinza-grafite com linhas finas gravadas a laser. | Grid escuro com linhas de grade emissivas que alteram o brilho ao passar o cursor. |
| **`marker_symbol_xo`** | *Tic Tac Toe, Battleship (Hits/Misses), Minesweeper (Bandeiras), Sudoku.* | Geometrias 3D volumétricas: 'X', Toro 3D ('O') e Pinos de Marcação. | Plástico emborrachado maciço (X: Vermelho Carmim / O: Azul Cobalto). | Peças em gesso polido fosco (X: Cinza Escuro / O: Branco Leite). | Holo-projetores translúcidos (X: Vermelho Neon Emissivo / O: Azul Neon Emissivo). |
| **`pawn_classic_ludo`** | *Ludo, Sheep Fight (unidades simples), Marcadores de Trilha.* | Peão clássico (base cônica, pescoço afunilado e cabeça esférica). | Plástico injetado brilhante tradicional (Vermelho, Azul, Amarelo, Verde). | Resina acetinada em tons pastéis (Rosa Seco, Azul Névoa, Sage, Mostarda). | Vidro polimérico com iluminação de fibra óptica interna nas cores primárias neon. |
| **`backgammon_inlay_zone`** | *Backgammon, Shuffleboard (Zonas).* | Superfície rebaixada com recortes triangulares intercalados. | Marquetaria tradicional de madeira clara e madeira queimada. | Impressão serigráfica minimalista em tons de cinza sobre base de policarbonato. | Painel touch acrílico com triângulos delimitados por fita de LED RGB. |
| **`dice_cup_holder`** | *Yahtzee, Backgammon.* | Cilindro cônico oco com rebordo espesso e fundo reforçado. | Couro sintético marrom-café costurado com feltro interno verde. | Alumínio escovado exterior com revestimento interno em borracha preta. | Fibra de carbono preta com revestimento interno em feltro cinza-escuro atômico. |
| **`mancala_board_pits`** | *Mancala, Yahtzee (Contadores).* | Bloco esculpido com 12 cavas esféricas, 2 depósitos (*Kalahs*) e Gemas. | Tabuleiro em madeira maciça com gemas em vidro soprado translúcido. | Bloco monolítico de pedra-sabão/mármore com gemas em metal polido esférico. | Bandeja moldada em acrílico escuro com cavas iluminadas por baixo e gemas em acrílico UV. |
| **`puck_disc_heavy`** | *Shuffleboard, Pong (Física).* | Disco metálico de perfil baixo com concavidade no topo. | Aço inoxidável cromado com capas plásticas (Azul e Vermelho). | Disco cerâmico denso com anéis emborrachados em Preto e Branco. | Disco de liga metálica titânio com anel periférico emissivo em Neon. |
| **`dots_connector_set`** | *Dots and Boxes, Battleship (Grade).* | Pinos cilíndricos verticais e hastes retangulares horizontais/verticais. | Pinos em metal cromado e hastes em plástico rígido colorido. | Pinos e hastes em polímero sintético branco e preto acetinado. | Pinos de base metálica com hastes de acrílico que acendem totalmente ao fechar linha. |
| **`arcade_block_modular`** | *Tetris, Snake, Pong (Paletas).* | Blocos cúbicos chanfrados (*Beveled Cubes*), esferas e barras. | Plástico rígido retrô estilo brinquedo de encaixe dos anos 80. | Blocos de cerâmica lisa com bordas vivas e cores com saturação reduzida. | Blocos estilizados em estética Voxel / Synthwave com neon interno brilhante. |
| **`ui_hud_frame_panel`** | *Todos os 30 Jogos (UI/Placar/Turnos).* | Molduras e painéis planos retangulares com recortes em bisel para texto. | Madeira nobre de contorno com interior em papel pergaminho para placares. | *Glassmorphism*: Vidro fumê semi-transparente fosco com bordas em alumínio. | Interface HUD Sci-Fi: Placa holográfica translúcida com detalhes neon e scanner visual. |

---

## 2. Tabela de Assets de Efeitos Sonoros (SFX)

| Asset (Identificador da Função) | Onde é Utilizado no Ecossistema | Descrição do Efeito Sonoro | Variações por Material / Contexto |
| :--- | :--- | :--- | :--- |
| **`sfx_piece_place`** | *Chess, Checkers, Dominoes, Reversi, Gomoku, Tic Tac Toe, Sudoku, Dots & Boxes.* | Som seco e tátil de impacto de uma peça sendo assentada no tabuleiro. | `_felt` (Feltro/Suave)<br>`_wood` (Baque de madeira nobre)<br>`_plastic` (Clique estalado)<br>`_metal` (Impacto metálico frio) |
| **`sfx_piece_slide`** | *Shuffleboard, Checkers, Backgammon, Chess, Tetris, Snake.* | Ruído contínuo de atrito e deslizamento de um objeto sobre a superfície. | `_felt` (Rascar suave)<br>`_wood` (Deslizamento amadeirado)<br>`_metal` (Fricção metálica polida) |
| **`sfx_card_draw`** | *Todos os 10 jogos de cartas.* | Fricção rápida e suave de uma carta sendo puxada do monte/baralho. | N/A (Padrão de celulose/papel couché encerado) |
| **`sfx_card_shuffle`** | *Todos os 10 jogos de cartas.* | Sequência rápida de batidas de cartas se intercalando (*Riffle shuffle*). | N/A (Padrão de baralho) |
| **`sfx_card_discard`** | *Truco, Poker, Blackjack, Solitaire, Rummy, Cheat, Crazy Eights.* | Batida leve de uma ou mais cartas caindo no centro da mesa/pilha de descarte. | `_felt` (Mesa estofada)<br>`_wood` (Mesa rígida) |
| **`sfx_card_flip`** | *Solitaire, Memory, Poker, Blackjack.* | Estalo rápido de rotação de uma carta revelando a face. | N/A (Padrão) |
| **`sfx_dice_roll`** | *Yahtzee, Backgammon, Ludo.* | Chocalhar agitado e múltiplos impactos estocásticos do dado quicando. | `_cup_leather` (Dentro do copo de couro)<br>`_cup_plastic` (Dentro de copo rígido)<br>`_table_wood` (Quicando na madeira)<br>`_table_felt` (Quicando no feltro) |
| **`sfx_timer_tick`** | *Todos os jogos com controle de tempo limite.* | Pulsar ritmado marcando os segundos finais do turno. | `_classic` (Relógio mecânico analógico)<br>`_digital` (Beep minimalista curto)<br>`_synth` (Pulso grave e tenso) |
| **`sfx_timer_expired`** | *Todos os jogos com controle de tempo limite.* | Alerta sonoro de estouro de tempo/perda de vez. | `_classic` (Campainha mecânica)<br>`_digital` (Bip contínuo de aviso)<br>`_synth` (Frequência descendente) |
| **`sfx_turn_pass`** | *Todos os 30 jogos (turn-based).* | Efeito de transição indicando que a vez foi passada ao próximo jogador. | `_classic` (Sino suave/Glockenspiel)<br>`_modern` (Chime digital limpo)<br>`_cyber` (Whoosh sintético com pitch subindo) |
| **`sfx_match_win`** | *Todos os 30 jogos.* | Fanfarra ou efeito positivo de celebração de vitória. | `_classic` (Fanfarra orquestral triunfal)<br>`_modern` (Acorde harmônico expansivo)<br>`_cyber` (Arpejo retro-futurista com synth) |
| **`sfx_match_lose`** | *Todos os 30 jogos.* | Acorde melancólico ou efeito negativo de derrota. | `_classic` (Acorde menor de orquestra)<br>`_modern` (Tom grave abafado)<br>`_cyber` (Erro de sistema/Glitch descendente) |
| **`sfx_match_draw`** | *Chess, Checkers, Tic Tac Toe, Reversi, etc.* | Som neutro de encerramento de partida em empate. | `_classic` (Nota sustentada de piano)<br>`_modern` (Tom sintético constante)<br>`_cyber` (Frequência estática neutra) |
| **`sfx_capture_eliminate`** | *Chess, Checkers, Ludo, Battleship, Minesweeper.* | Som de peça sendo capturada ou destruída no tabuleiro. | `_solid` (Remoção física com estalo)<br>`_explosion` (Impacto/Estouro para Battleship/Minesweeper) |
| **`sfx_score_point`** | *Tetris, Snake, Dots & Boxes, Yahtzee, Shuffleboard, Pong.* | Som curto e gratificante ao somar pontos ou fechar uma caixa/linha. | `_bell` (Sininho de ponto clássico)<br>`_coin` (Efeito estilo moedinha arcade)<br>`_synth` (Trill ascendente) |
| **`sfx_ui_click`** | *Todos os 30 jogos (Menus e HUD).* | Resposta tátil ao clicar em botões, selecionar opções ou peças. | `_classic` (Clique mecânico de madeira)<br>`_modern` (Toque suave de vidro/pop)<br>`_cyber` (Bip tátil de alta frequência) |

---

## 3. Tabela de Assets de Animações e VFX

| Asset (Identificador da Função) | Onde é Utilizado no Ecossistema | Tipo de Animação | Descrição Visual e Comportamento | Variações / Estilos |
| :--- | :--- | :--- | :--- | :--- |
| **`anim_card_deal`** | *Todos os 10 jogos de cartas.* | Procedural / Trilha | Trajetória fluida da carta saindo do monte central até a mão do jogador. | `_linear` (Movimento direto)<br>`_arc` (Parábola elegante com elevação) |
| **`anim_card_flip`** | *Solitaire, Memory, Poker, Blackjack.* | Transformação 3D | Rotação de 180° no eixo Y da malha da carta revelando a face frontal. | `_standard` (Giro simples na mesa)<br>`_snap` (Giro rápido no ar com leve projeção) |
| **`anim_card_fan`** | *Todos os 10 jogos de cartas.* | Layout dinâmico | Abertura/Alinhamento das cartas em arco na mão do jogador. | `_compact` (Sobreposição fechada)<br>`_wide` (Abertura ampla de leitura) |
| **`anim_piece_hop`** | *Chess, Checkers, Ludo, Backgammon.* | Parábola 3D | Movimento de elevação e translação de uma peça saltando de uma casa para outra. | `_smooth` (Arco suave contínuo)<br>`_snappy` (Salto rápido com amortecimento na chegada) |
| **`anim_dice_shake_throw`** | *Yahtzee, Backgammon, Ludo.* | Física / Chaveamento | Animação do copo/mão sacudindo os dados e lançando-os na mesa com rotação randômica. | `_cup` (Lançamento caindo do copo)<br>`_hand` (Lançamento direto da mão) |
| **`anim_turn_indicator`** | *Todos os 30 jogos.* | Looping de UI/HUD | Elemento visual destacando o avatar/placar do jogador atual da vez. | `_pulse` (Pulso de luz/escala suave)<br>`_rotate` (Anel giratório ao redor da foto)<br>`_bounce` (Seta flutuante apontando) |
| **`anim_timer_warning`** | *Todos os jogos com tempo limite.* | Looping de UI/HUD | Alteração no contador de tempo indicando escassez (ex: últimos 5 segundos). | `_flash` (Piscar em vermelho)<br>`_shake` (Treme-treme mecânico da UI) |
| **`anim_win_banner`** | *Todos os 30 jogos.* | Interface / VFX | Entrada triunfal do painel/modal de vitória ao encerrar a partida. | `_confetti` (Entrada do banner com explosão de confetes)<br>`_fade_zoom` (Pop-up elegante com transparência e zoom)<br>`_laser_scan` (Revelação por varredura de luz) |
| **`anim_lose_banner`** | *Todos os 30 jogos.* | Interface / VFX | Entrada do painel/modal indicando derrota. | `_slide_down` (Queda lenta e pesada do painel)<br>`_desaturate` (Pausa com congelamento e perda de cor da tela) |
| **`anim_tile_clear`** | *Tetris, Minesweeper, Match Games.* | VFX de Malha | Desaparecimento ou quebra das peças ao completar uma linha/combinação. | `_dissolve` (Desintegração em partículas)<br>`_shrink` (Redução de escala a zero com elasticidade)<br>`_flash` (Brilho intenso e sumiço) |
| **`anim_puck_slide`** | *Shuffleboard, Pong.* | Física / Movimento | Deslizamento com amortecimento gradual por atrito de parada. | N/A (Calculado via física/vetor de força) |
| **`anim_ui_attention`** | *Todos os 30 jogos.* | UI Micro-interação | Animação em botões jogáveis para atrair a atenção do usuário (ex: botão "Passar Vez"). | `_pulse_scale` (Aumento e redução sutil de tamanho)<br>`_shimmer` (Passagem de feixe de luz reflexivo) |