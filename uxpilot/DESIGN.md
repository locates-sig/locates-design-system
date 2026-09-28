---
colors:
  background: "#f9f9f9"
  foreground: "#1a1a1a"
  card:
    DEFAULT: "#ffffff"
    foreground: "#1a1a1a"
  popover:
    DEFAULT: "#ffffff"
    foreground: "#1a1a1a"
  primary:
    DEFAULT: "#4f3c88"
    foreground: "#ffffff"
    dark: "#3c2963"
    light: "#bca9f5"
  secondary:
    DEFAULT: "#f1edff"
    foreground: "#4f3c88"
    dark: "#319f55"
    light: "#85ffb5"
  muted:
    DEFAULT: "#f1edff"
    foreground: "#767676"
  accent:
    DEFAULT: "#f1edff"
    foreground: "#4f3c88"
    highlight: "#d4c8f5"
  destructive:
    DEFAULT: "#e40014"
    foreground: "#ffffff"
    soft: "#fef2f2"
    text: "#e71d36"
  border: "#e0e0e0"
  input: "#e0e0e0"
  ring: "#4f3c88"
  sidebar:
    DEFAULT: "#ffffff"
    foreground: "#1a1a1a"
    primary: "#4f3c88"
    primary-foreground: "#ffffff"
    accent: "#f1edff"
    accent-foreground: "#4f3c88"
    border: "#e0e0e0"
    ring: "#4f3c88"
  gray:
    primary: "#1a1a1a"
    secondary: "#767676"
    border: "#e0e0e0"
    disabled: "#bdbdbd"
    50: "#f9fafb"
    100: "#f3f4f6"
    200: "#e5e7eb"
    300: "#d1d5dc"
    400: "#99a1af"
    500: "#6a7282"
    600: "#4a5565"
    700: "#364153"
    800: "#1e2939"
    900: "#101828"
  lilac:
    50: "#f1edff"
    150: "#dacbff"
    200: "#ddd2ff"
    highlight: "#d4c8f5"
  navy:
    900: "#1e1e3f"
    950: "#12122a"
  green:
    50: "#f0fdf4"
    100: "#dcfce7"
    200: "#b9f8cf"
    300: "#7bf1a8"
    500: "#00c758"
    600: "#00a544"
    700: "#008138"
    800: "#016630"
    900: "#0d542b"
  amber:
    100: "#fef3c6"
    400: "#fcbb00"
    500: "#f99c00"
    600: "#dd7400"
    700: "#b75000"
    800: "#953d00"
  blue:
    50: "#eff6ff"
    200: "#bedbff"
    300: "#90c5ff"
    400: "#54a2ff"
    700: "#1447e6"
    800: "#193cb8"
typography:
  fontFamily:
    sans: "Montserrat, system-ui, sans-serif"
    mono: "Geist Mono, monospace"
  fontSize:
    micro-10: "0.625rem"
    micro-11: "0.6875rem"
    xs: "0.75rem"
    sm: "0.875rem"
    base: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    2xl: "1.5rem"
    3xl: "1.875rem"
    4xl: "2.25rem"
  fontWeight:
    light: "300"
    normal: "400"
    medium: "500"
    semibold: "600"
    bold: "700"
  lineHeight:
    none: "1"
    tight: "1.2"
    snug: "1.25"
    normal: "1.3"
    relaxed: "1.5"
spacing:
  0.5: "0.125rem"
  1: "0.25rem"
  1.5: "0.375rem"
  2: "0.5rem"
  2.5: "0.625rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.25rem"
  6: "1.5rem"
  8: "2rem"
  10: "2.5rem"
  12: "3rem"
  16: "4rem"
rounded:
  xs: "0.25rem"
  sm: "0.375rem"
  md: "0.5rem"
  DEFAULT: "0.625rem"
  lg: "0.625rem"
  2xl: "1rem"
  panel: "1.125rem"
  4xl: "2rem"
  full: "9999px"
shadows:
  hairline: "0 0 0 1px #e0e0e0"
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
  soft: "0 2px 12px rgba(0, 0, 0, 0.08)"
  popup: "0 4px 12px rgba(0, 0, 0, 0.15)"
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
  float: "0 8px 24px rgba(0, 0, 0, 0.12)"
  sheet: "0 -2px 8px rgba(0, 0, 0, 0.12)"
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  2xl: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
borderWidth:
  DEFAULT: "1px"
  2: "2px"
---

# Locates

Locates é o sistema de design da plataforma de inteligência e análise imobiliária (app.locates.com.br) voltado para desenvolvedores, projetistas e investidores em real estate. A linguagem visual prioriza clareza, alta densidade de dados e legibilidade em fundos limpos (#F9F9F9 e #FFFFFF). O roxo Locates (#4F3C88) comanda interações, estados ativos e ações primárias, complementado por um suporte lilás suave (#F1EDFF) para estados atenuados e hover. O mapa cartográfico atua como o palco principal, exigindo que a interface em torno mantenha neutralidade cromática e sombras leves de sustentação.

## Principles

1. **O mapa é a informação central**: a interface atua como moldura limpa, utilizando brancos purificados, divisores sutis e superfícies translúcidas/escuras no contexto do mapa sem poluição visual.
2. **Roxo conduz a ação e a seleção**: o uso do roxo Locates é estritamente intencional. Ele marca botões primários, itens selecionados, anéis de foco e links interativos.
3. **Fundo lilás suave para estados atenuados**: qualquer estado de hover ou repouso atenuado (secondary, muted, accent) adota a tinta lilás (#F1EDFF) em vez de tons de cinza frios.
4. **Alta densidade com clareza tipográfica**: interfaces de dados exigem números tabulares (`tabular-nums`), tamanhos calibrados (10px a 16px) e peso estruturado no tipo Montserrat.

## Color & Theming

A paleta é estruturada em torno do tom primário roxo Locates (`primary` #4F3C88), com escurecimento de apoio em interações (`primary-dark` #3C2963) e suporte lilás em botões secundários ou áreas selecionadas (`secondary` #F1EDFF e `primary-light` #BCA9F5).

- **Superfície e Canvas**: O aplicativo opera primariamente sobre o canvas #F9F9F9 com cards e popovers em #FFFFFF puro.
- **Modo Escuro**: O sistema não define paleta oficial em modo escuro no produto em produção. Overlays e painéis específicos sobre o mapa utilizam superfícies escuras dedicadas em tom `navy-950` (#12122A) e `navy-900` (#1E1E3F).
- **Semântica Positiva e de Sinal**: O verde Locates marca a identidade visual (como o anel do logo), enquanto sinais operacionais utilizam a escala `green-700` (#008138) ou `green-500` (#00C758) para garantir contraste acessível de leitura.

## Typography

A tipografia é ancorada pela família **Montserrat** para todas as interfaces web e pela família **Geist Mono** para valores numéricos técnicos, coordenadas e IDs.

- **Display & KPIs**: Títulos de impacto e métricas primárias utilizam `fontSize.3xl` (30px) ou `fontSize.4xl` (36px) com pesos `semibold` (600) ou `bold` (700).
- **Headings**: `title-2xl` (24px), `title-xl` (20px) e `title-lg` (18px) utilizam predominantemente o tom `primary` para ancorar a hierarquia visual.
- **Body & Labels**: Corpo padrão em `fontSize.sm` (14px) e `fontSize.base` (16px). Rótulos de formulário e apoios utilizam `micro-10` (10px) e `micro-11` (11px) com tracking estendido (`0.05em` a `0.15em`) e caixa alta.

## Spacing, Sizing & Density

O sistema adota uma escala de espaçamento baseada no incremento de 4px (`0.25rem`).

- **Densidade em Controles**: Botões e inputs utilizam paddings internos compactos (`px-2.5`, `px-4`, `py-2`) para otimizar espaço de tela.
- **Rhythm e Formulários**: Espaçamento vertical entre campos de formulário é fixado em `gap-5` (20px) com espaçamento de `mt-8` (32px) para o botão de ação principal.
- **Estruturas de Layout**: O cabeçalho possui altura fixada em 72px (`header-height`), o card de autenticação possui largura máxima de 565px (`auth-card-max`), e o painel lateral expansível possui largura de 484px (`side-panel-width`).

## Shape & Elevation

- **Raios de Arredondamento**: O raio base de controle é de 10px (`rounded-lg` / `DEFAULT`). Checkboxes utilizam `rounded-xs` (4px), popups de mapa e botões pequenos utilizam `rounded-md` (8px), painéis flutuantes utilizam `rounded-panel` (18px) e cards de login `rounded-2xl` (16px).
- **Elevação & Sombras**: Sombras neutras sem matiz de cor para evitar concorrência com o mapa. `shadow-sm` para cards discretos, `shadow-popup` para balões de informação cartográfica, `shadow-float` para controles flutuantes sobre o mapa e `shadow-xl` / `shadow-2xl` para diálogos e formulários de autenticação.

## States & Interaction

- **Hover**: Botões e itens primários transitam de `bg-primary` para `bg-primary-dark`. Ações secundárias e listas exibem transição de fundo para `bg-lilac-50` / `bg-muted`.
- **Focus-Visible**: Todos os elementos interativos acionam anel de foco em `ring-primary` com opacidade de 50% e expansão de anel suave.
- **Active & Pressed**: Botões aplicam ligeiro deslocamento vertical de `active:translate-y-px` para feedback tátil instantâneo.
- **Disabled**: Elementos desabilitados operam a 50% de opacidade com cor de texto `text-gray-disabled` (#BDBDBD) e cursor desativado (`cursor-not-allowed`).

## Motion

- **Durações & Curvas**: Animações e transições padrão utilizam a duração curta de 150ms com curva `ease-out` (`cubic-bezier(0, 0, 0.2, 1)`).
- **Deslocamentos**: Painéis laterais deslizam na tela com translate de 2.5rem; loaders e estados de carregamento utilizam rotação contínua (`animate-spin`) e variação de pulso (`animate-pulse`).

## Responsive & Accessibility

- **Breakpoints**: Padrões Tailwind (sm: 640px, md: 768px, lg: 1024px, xl: 1280px, 2xl: 1536px).
- **Acessibilidade de Texto**: Cores de texto `foreground` (#1A1A1A) possuem taxa de contraste superior a 15:1 sobre fundos brancos. Textos auxiliares em `gray-secondary` (#767676) cumprem diretrizes de legibilidade AA para tamanhos padrão.

## Component Conventions

- **Nomenclatura de Variantes**: Variantes de componentes de ação seguem os nomes `default`, `secondary`, `outline`, `ghost`, `destructive` e `link`.
- **Tamanhos**: As escalas de tamanho usam os identificadores `xs`, `sm`, `default`, `lg` e `icon`.
- **Composição de Inputs**: Inputs em fluxos de autenticação utilizam estilo flutuante sem borda lateral (`FloatingInput`), enquanto formulários densos de aplicação utilizam caixa tradicional com borda neutra.

## Content Guidance

- Rótulos e botões devem usar verbo no infinitivo ou imperativo curto em Português do Brasil (ex: "Entrar", "Salvar alterações", "Filtrar por região").
- Números e moeda seguem formatação brasileira: `R$ 12.480/m²`, `+6,2%`. Colunas e tabelas de métricas devem obrigatoriamente utilizar fontes tabulares (`tabular-nums`).

## Do's and Don'ts

### Do's
- Utilize a cor `primary` (`#4F3C88`) para botões de ação principal e links em destaque.
- Aplique o fundo lilás `lilac-50` (`#F1EDFF`) nos estados de hover de itens de menu, listas e botões de variante `secondary`.
- Utilize `font-mono` com a classe `tabular-nums` para colunas numéricas, tabelas de preços e dados do mapa.
- Mantenha `rounded-lg` (10px) como padrão para botões e caixas de interação.

### Don'ts
- Não utilize o tom `secondary` verde (`#4FE48B`) para corpo de texto ou labels sobre fundo claro devido ao baixo contraste.
- Não utilize bordas pretas ou sombras pesadas com tinta de cor em painéis sobre o mapa.
- Não aplique o tom `primary-light` (`#BCA9F5`) como cor de texto sobre fundo branco.

## Composition

A interface do aplicativo organiza-se em um modelo de dois grandes cenários de visualização: a visualização imersiva baseada em mapa cartográfico e a visualização focada em tarefas/autenticação. O mapa atua como plano de fundo contínuo sobre o qual painéis flutuantes (`radius-panel`), barras de ferramentas (`shadow-soft`) e popups (`shadow-popup`) gravitam com separação clara de camadas.

Em fluxos de autenticação e modais, a composição divide-se de forma equilibrada entre uma área institucional ilustrada (com fundo escuro/mapa estilizado) e um card de formulário branco e limpo (`radius-2xl`, `shadow-xl`). O ritmo vertical do formulário mantém margens constantes e alinhamento do CTA em destaque na base.

## Gaps & Decisions

- **Ausência de Modo Escuro Completo**: A aplicação em produção não disponibiliza alternância de tema global para modo escuro; o sistema documenta apenas o tema Claro (`light`) e os tokens de superfícies escuras isoladas para overlay de mapa (`navy-950` / `navy-900`).
- **Fontes de Produção**: A fonte Montserrat e Geist Mono são importadas de distribuidores web padrão para assegurar paridade visual idêntica com a plataforma Locates.