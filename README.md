# Locates App

Design system da plataforma web **app.locates.com.br** (Next.js + Tailwind CSS v4 + shadcn/ui sobre Base UI, ícones lucide, mapa Mapbox GL), extraído em 24/09/2026 do CSS e JS publicados pelo próprio site e mesclado em 28/09/2026 com o design system "Locates" gerado no UX Pilot (27 componentes React). Os tokens são os do código em produção; nada foi estimado a partir de imagem.

## Personalidade

Ferramenta de análise imobiliária para quem "desenvolve, projeta ou investe em real estate". A interface é clara, branca e densa de dados; o roxo Locates marca o que é ação ou seleção, e o verde aparece pouco (logo e sinais positivos). O mapa é o protagonista: o chrome fica neutro para não competir com as camadas.

## Princípios

1. **O mapa é a informação central.** A interface é a moldura: brancos, divisores sutis e superfícies escuras (`navy-950`) só quando estão sobre o mapa.
2. **Roxo conduz ação e seleção.** `primary` marca botão principal, item selecionado, anel de foco e link. Não use roxo como decoração.
3. **Lilás para estados atenuados.** Hover e repouso atenuado (`secondary`, `muted`, `accent`) usam `lilac-50`, nunca cinza frio.
4. **Densidade com clareza.** Tamanhos de 10 a 16px nos painéis, números com `tabular-nums`, pesos bem marcados em Montserrat.

## Conteúdo e voz

- Português do Brasil, tratamento neutro e acolhedor: "Seja bem-vindo(a)", "Insira suas informações de acesso".
- Rótulos curtos no imperativo ou infinitivo: "Entrar", "Registre-se", "Esqueci minha senha".
- Números no padrão brasileiro: `R$ 12.480/m²`, `+6,2%`, `1.284`. Use `font-variant-numeric: tabular-nums` em colunas.

## Cor

- **Primária:** `color-brand-primary` #4f3c88 (= `primary`, `ring`, `sidebar-primary`). Hover e pressed: `color-brand-primary-dark` #3c2963.
- **Lilás de apoio:** `lilac-50` #f1edff é o `secondary`, o `muted` e o `accent` do shadcn, então todo hover suave do app é lilás, não cinza. Seleção usa `color-brand-primary-light` #bca9f5; navegação por teclado usa `lilac-highlight` #d4c8f5.
- **Verde:** `color-brand-secondary` #4fe48b é cor de marca, não de texto (1,6:1 no branco). Para texto positivo use `color-green-700` ou `color-brand-secondary-dark` (este só ≥18px).
- **Neutros:** `background` #f9f9f9 (canvas), `card`/`popover` #fff, `foreground` = `color-gray-primary` #1a1a1a, `muted-foreground` = `color-gray-secondary` #767676, `border`/`input` = `color-gray-border` #e0e0e0.
- **Sinais:** erro `destructive` #e40014 (botão destrutivo a 10% de fundo), alerta nas escalas `amber`/`orange`, informativo `blue`, positivo `green`/`emerald`. As escalas Tailwind listadas são só os passos que o app usa de fato.
- **Superfícies escuras:** `navy-950` #12122a e `navy-900` #1e1e3f para overlays sobre o mapa.
- **Só tema claro.** O CSS traz variantes `dark:` do shadcn, mas não define os tokens do tema escuro; o app não tem modo escuro.

Contraste, pares que falham e onde evitar: `color-gray-secondary` sobre `background` dá 4,3:1 (texto <14px fica abaixo de AA); `color-brand-primary-light` como texto/placeholder sobre branco dá 2,2:1; `text-disabled` #bdbdbd é ilegível por design.

## Tipografia

- **Montserrat** (Google Fonts, variável 100–900) é a fonte única da UI: `--font-sans: var(--font-montserrat)`.
- **Geist Mono** está carregada (`--font-geist-mono`) para números técnicos e códigos.
- Escala Tailwind (xs 12 → 4xl 36) mais tamanhos arbitrários densos: 13, 11, 10, 9,5 e 8px nos painéis. Pesos 300 (frase institucional), 400, 500 (labels, botões), 600 (títulos, links), 700 (CTA, KPIs).
- Títulos em roxo (`title-2xl` em `color-brand-primary`); corpo em `foreground`; apoio em `color-gray-secondary`. Labels uppercase levam tracking de 0.05 a 0.15em.

## Espaço, forma e profundidade

- Base `--spacing` 4px. Formulários com `gap` de 20px, CTA a 32px do último campo, cards com 16px (sm 12px).
- Raio base `--radius` 10px (`radius-lg`, botões). Popup 8px, card de login 16px, painéis flutuantes sobre o mapa 18px, pills `radius-full`.
- Sombras neutras (preto 8–25%), sem tinta de cor. `shadow-popup` nos popups do mapa, `shadow-float` em painéis, `shadow-xl` no card de login, `shadow-sheet` (para cima) no bottom sheet mobile.
- Layout: topbar `header-height` 72px; painel lateral `side-panel-width` 484px que desliza sobre o mapa; mobile respeita `env(safe-area-inset-bottom)`.

## Iconografia

Ícones **lucide-react** em traço 2px, 16px dentro de botões (`[&_svg]:size-4`), `currentColor`. Estado inativo em `color-gray-secondary`, hover em `color-brand-primary`. Nada de ícones preenchidos ou emoji.

## Movimento

Transições curtas (150ms `transition-colors`/`transition-all`, `ease-out` cubic-bezier(0,0,.2,1)); botões descem 1px no clique; drawers entram deslizando 2,5rem; `animate-pulse` em skeletons e `animate-spin` em loaders.

## Estados e interação

- **Hover:** primário vai de `primary` para `primary-dark`; secundário, listas e menus vão para `lilac-50` (`muted`).
- **Foco:** anel `ring` (roxo) em 2–3px, com 50% de opacidade.
- **Pressionado:** `active:translate-y-px` em botões.
- **Desabilitado:** 50% de opacidade, texto `gray-disabled`, `cursor-not-allowed`.

## Faça e evite

- Faça: `primary` só no botão de ação principal e em links de destaque; `lilac-50` no hover de itens de menu, listas e botões `secondary`; `rounded-lg` (10px) como padrão de botões e caixas; `tabular-nums` em toda coluna numérica.
- Evite: verde `color-brand-secondary` em texto sobre fundo claro; `primary-light` como cor de texto; bordas pretas ou sombras coloridas em painéis sobre o mapa.

## Composição

Dois cenários. **Mapa:** o mapa ocupa o fundo e painéis flutuantes (`radius-panel`, `shadow-float`), barras de ferramentas (`shadow-soft`) e popups (`shadow-popup`) ficam em camadas por cima; o `SidePanel` de 484px desliza da lateral e o `Header` de 72px fica no topo. **Tarefa/autenticação:** o `AuthCard` divide a tela entre a imagem institucional e o card de formulário (`radius-2xl`, `shadow-xl`), com o CTA na base.

## Componentes

27 componentes React (TSX + Tailwind), gerados no UX Pilot sobre estes tokens e compilados em `components/bundle.js` (global `window.LocatesApp`) e `components/bundle.css` (Tailwind v4 com o tema do sistema). O código-fonte está em `uxpilot/src/components/ui/` e só depende de `react` e do helper `cn` (`clsx` + `tailwind-merge`).

| Grupo | Componentes |
| --- | --- |
| Ações | Button, IconButton, ButtonGroup |
| Formulários | Input, SearchInput, Select, Checkbox, Switch, FloatingInput, FormField, Label |
| Status | Badge, Alert, Spinner, Skeleton |
| Dados | MetricCard, Card |
| Navegação | Tabs, DropdownMenu, Header, Sidebar |
| Superfícies | SidePanel, BottomSheet |
| Mapa | MapPopup, MapTooltip, MeasureTag |
| Padrões | AuthCard |

Para usar numa página sem build: carregue `tokens.css`, `components/bundle.css`, React 18 e ReactDOM 18 (UMD) e `components/bundle.js`; depois `React.createElement(LocatesApp.Button, { variant: 'secondary' }, 'Comparar bairros')`. Num projeto React, copie os `.tsx` de `uxpilot/src/components/ui/` e o `cn` de `lib/utils`. `components/static.css` mantém as classes `lc-*` da versão estática anterior, para páginas sem React.

## Telas do BI

`looker/redesign/` aplica este sistema às telas dos relatórios de BI (Looker Studio) capturadas em `looker/` (17 do estudo de área e 10 do Observatório do mercado): protótipos em HTML (`index.html`), capturas em `previews/` e um guia de tema e componentes para refazer o relatório no Looker Studio, com a paleta de gráficos validada e as inconsistências de dados encontradas.

## Ativos

- `Logos/logo.svg`: wordmark roxo com o "O" em anel verde.
- `Imagery/login-locates.png`: mapa estilizado usado no login.
- Favicon (`/favicon.png`) está vazio no servidor (6 bytes) e não foi importado.

## Não sincronizado

- **Rotas autenticadas** (`/home?cidade=4399` e demais) redirecionam para `/login` sem sessão e não foram renderizadas. Tokens, utilitários e o cva do Button vêm do CSS global e dos chunks públicos, que cobrem o app inteiro; a composição específica da home (cards de métrica, gráficos, sidebar, painel da cidade) não pôde ser vista.
- Os componentes **não são o código do app**: foram gerados no UX Pilot a partir destes tokens. Seguem os mesmos valores, mas a composição pode divergir da produção (o `AuthCard` alinha o título à esquerda em negrito; o login real centraliza em semibold).

## Divergências do UX Pilot corrigidas ou anotadas

- `secondary-dark` e `secondary-light` do UX Pilot são **verdes** (#319f55, #85ffb5), mas `secondary` é **lilás**. Não foram importados com esse nome: use `color-brand-secondary-dark` / `-light`.
- O `DESIGN.md` do UX Pilot diz que `gray-secondary` passa AA em qualquer caso; sobre `background` (#f9f9f9) dá 4,3:1, abaixo de AA para texto menor que 14px.
- Os componentes do UX Pilot usam `font-mono` em alguns números (variação do `MetricCard`, valores do `MapPopup`); no app, KPIs usam Montserrat com `tabular-nums`.
- Quatro componentes (Alert, AuthCard, MapPopup, Sidebar) não compilavam em TypeScript: redefiniam `title`/`onSelect` por cima dos atributos HTML. Os tipos foram corrigidos com `Omit<…>` em `uxpilot/src`, sem mudar o comportamento.
- Duas cores que os componentes pedem e o app não tem: `color-amber-300` (borda do `Alert` warning), definida com o valor oficial do Tailwind v4 #ffd230, e `navy-800` (borda do `SidePanel` escuro), mapeada para `navy-900`.
- Cores em `lab()` do Tailwind v4 foram registradas pelo fallback sRGB hex que o próprio CSS traz.
- Fontes vêm do Google Fonts (sem arquivos locais).
