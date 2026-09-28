# Telas do BI com o design system Locates

Redesenho das 17 telas do relatório de BI (Looker Studio) capturadas em `looker/`, aplicando os tokens (`tokens.css`) e os componentes do sistema. São protótipos em HTML estático que servem de referência visual e de especificação para refazer o relatório no Looker Studio.

**Como abrir:** abra `index.html` no navegador, ou veja as capturas em `previews/` (1440 px, página inteira). Não há build nem dependências. Os ícones lucide estão embutidos em `assets/icons.js`; a Montserrat vem do Google Fonts via `tokens.css`.

## Telas

| Seção | Tela nova | Capturas originais |
| --- | --- | --- |
| Resumo executivo | `resumo.html` | `resumo/` |
| Mercado · Residencial | `mercado-residencial-venda.html` | `mercado/venda/` (1ª e 2ª) |
| | `mercado-residencial-shortstay.html` | `mercado/shortstay/` |
| | `mercado-residencial-longstay.html` | `mercado/longstay/` (3ª e 4ª) |
| | `mercado-residencial-lancamentos.html` | `mercado/lancamentos/` |
| | `mercado-residencial-evolucao.html` | `mercado/evolutivo/` (1ª e 2ª) |
| Mercado · Comercial | `mercado-comercial-venda.html` | `mercado/venda/` (3ª e 4ª) |
| | `mercado-comercial-aluguel.html` | `mercado/longstay/` (1ª e 2ª) |
| | `mercado-comercial-evolucao.html` | `mercado/evolutivo/` (3ª) |
| Mercado · Obras | `mercado-obras.html` | `cno/` |
| Demográfico | `demografia-2022.html` | `sociodemografico/` (1ª a 3ª) |
| | `demografia-2010-2022.html` | `sociodemografico/` (4ª e 5ª) |
| Socioeconômico | `socioeconomia-2022.html` | `sociodemografico/` (6ª) |
| | `socioeconomia-2010.html` | `sociodemografico/` (7ª e 8ª) |
| Pontos de interesse | `pois-comercio.html` | `pois/` (1ª) |
| | `pois-pgt.html` | `pois/` (2ª) |
| Equipamentos urbanos | `equipamentos-urbanos.html` | `equipamentos-urbanos/` |

A aba **Empresas** não tinha captura. Ela fica na navegação, desabilitada.

## Arquivos

- `assets/bi.css`: camada de relatório sobre `tokens.css` (cabeçalho, abas, cartões, KPIs, tabelas, mapa, gráficos). Só usa tokens do sistema, mais as cores de gráfico abaixo.
- `assets/bi.js`: `window.LBI`, com o shell (cabeçalho, abas, subnavegação e rodapé), formatação pt-BR, gráficos em SVG (colunas, linha, colunas agrupadas, pirâmide, rosca), barras, tabelas, tooltip e um mapa ilustrativo.
- `assets/mercado.js`: os layouts compartilhados de Mercado (listagem, comercial e evolução).
- `assets/icons.js`: o subconjunto de ícones lucide usado (ISC, `lucide-static` 1.48.0).

## O que mudou e por quê

1. **Navegação.** A faixa roxa cheia e os links sublinhados em caixa alta viraram três níveis de controle do sistema. As seções usam `Tabs` *line* (roxo só na aba ativa). Residencial, Comercial e Obras usam `Tabs` *pill*. Venda, Shortstay e os demais modos, assim como o filtro espacial, usam o *segmented*. "Limpar filtros" é um `Button` *outline* no cabeçalho. O cabeçalho de 72 px mostra o logo e o imóvel analisado.
2. **Superfícies.** Canvas `background` #f9f9f9, cartões brancos com borda `border` #e0e0e0, raio 16 px e `shadow-sm`. Os blocos roxos, verdes e lilás de fundo saíram: pela regra do sistema, roxo marca ação e seleção, não decoração.
3. **Títulos.** Os títulos de cartão usam 16 px semibold em `primary`. O verde saiu dos títulos ("Ofertas por **dormitórios**"), porque #4fe48b dá 1,6:1 no branco.
4. **Variações.** As setas verdes claras viraram o badge do `MetricCard`: `green-700` sobre `green-50` para alta, `destructive` para queda, sempre com sinal e seta, e não só a cor.
5. **Tabelas.** O cabeçalho é `gray-50` com rótulo em caixa alta de 11 px. Os números usam `tabular-nums` e ficam alinhados à direita. O vm² usa uma escala sequencial de um só matiz (lilás → `primary`), no lugar do vermelho, que sugeria "ruim". Contagens de anúncios ganharam uma barra inline. O link virou "Ver anúncio" em roxo com o ícone de link externo.
6. **Forma dos gráficos.**
   - Contagens por quartos, banheiros, suítes e hóspedes eram linhas; viraram colunas, porque não há continuidade entre "2 quartos" e "3 quartos".
   - Rótulos de valor só no primeiro, no último, no máximo e no mínimo.
   - A série do vm² não é mais suavizada: a spline do comercial inventava picos entre trimestres.
   - Os quatro gráficos por quartos compartilham a mesma escala.
   - Percentuais que eram "pílulas" com sombra viraram listas de barras.
   - As roscas de 100% com uma única categoria (POIs e PGT) foram removidas, porque repetiam a lista ao lado.
7. **Ícones.** Os pictogramas desenhados (bonecos, privadas, gotas) foram trocados por lucide em traço de 2 px, `currentColor`.
8. **Mapa.** Os controles usam `shadow-soft` e raio de 10 px. O painel de distância é um slider com a primária. O aviso "somente anúncios georreferenciados" virou um chip `navy-950`. O imóvel é um pino `primary` com anel branco, e o raio de 1 km é um círculo `primary` a 5%. Nos protótipos, o mapa é só ilustrativo; no Looker continua sendo o Google Maps.

## Cores de gráfico

Validadas com o verificador de paleta (OKLCH, daltonismo com Machado 2009): todas passam na faixa de luminosidade, no croma mínimo, na separação entre vizinhas (ΔE CVD ≥ 25) e no piso de visão normal. As três primeiras também passam em todos os pares, então servem para mapas com até três categorias.

| Uso | Cores (em ordem fixa, nunca rotacionar) |
| --- | --- |
| Série única | `primary` #4f3c88 |
| Categórica | 1 `purple-800` #6b21a8 · 2 `blue-400` #54a2ff · 3 `amber-500` #f99c00 · 4 `blue-700` #1447e6 · 5 `emerald-600` #009767 |
| Ordinal (classes A–E, faixas etárias, porte) | #bca9f5 · #957fd6 · #6f5bb0 · #4f3c88 · #3c2963 (claro = menor; classe A = mais escura) |
| Sexo (em todo o relatório) | Mulheres #6b21a8 · Homens #54a2ff |
| Escala sequencial em tabela | mínimo #f1edff → máximo #4f3c88 (texto branco acima da metade) |
| Alta / queda | `green-700` #008138 / `destructive` #e40014, sempre com seta e sinal |

`blue-400` e `amber-500` ficam abaixo de 3:1 no branco. Por isso toda rosca, barra empilhada e gráfico agrupado traz legenda com valores. Os dois tons intermediários do ordinal (#957fd6 e #6f5bb0) são interpolações entre `primary-light` e `primary`; se virarem tokens, entram em `tokens.json`.

## Como aplicar no Looker Studio

**Tema (Tema e layout → Personalizar)**

| Configuração | Valor |
| --- | --- |
| Fonte | Montserrat (títulos e corpo) |
| Fundo da página | #f9f9f9 |
| Fundo do componente | #ffffff · borda #e0e0e0 · raio 16 · sombra ligada |
| Cor do texto | #1a1a1a (principal), #767676 (secundário) |
| Cor de destaque | #4f3c88 |
| Paleta de gráfico | #6b21a8, #54a2ff, #f99c00, #1447e6, #009767 (nesta ordem) |
| Largura da página | 1400 px |

**Componentes**

| Componente | Estilo |
| --- | --- |
| Navegação de seções | Barra de navegação de páginas horizontal ou botões de texto de 14 px; ativo em #4f3c88 semibold com sublinhado de 2 px; inativo em #767676, sem sublinhado |
| Subnavegação (Residencial/…) | Botões com raio 10: ativo com fundo #4f3c88 e texto branco; inativo sem fundo e texto #767676; o grupo fica sobre #f1edff |
| Modos (Venda/…) e filtro espacial | Botões com raio 10: ativo com fundo branco, texto #1a1a1a semibold e sombra; o grupo fica sobre #f3f4f6 |
| Título do cartão | Texto de 16 px semibold em #4f3c88; subtítulo de 12 px em #767676 |
| Visão geral (scorecard) | Rótulo de 11 px em caixa alta #767676; valor de 28 px bold #1a1a1a; comparação com "Cor positiva" #008138 e "Cor negativa" #e40014 |
| Tabela | Cabeçalho com fundo #f9fafb, texto de 11 px #767676; linhas brancas com divisória #f3f4f6, sem zebra; números alinhados à direita |
| Formatação condicional (vm²) | Escala de cores: mín. #f1edff, máx. #4f3c88 (não use vermelho) |
| Barras nas colunas "Anúncios" | Tipo de coluna "Barra", cor #4f3c88 |
| Lista suspensa (Tipologia, Negócio) | Fundo branco, borda #e0e0e0, raio 10, texto de 14 px; rótulo de 10 px em caixa alta #767676 |
| Controle deslizante | Trilho #e5e7eb, faixa e alça #4f3c88 |
| Gráfico de colunas | Barras de até 24 px, cor #4f3c88, rótulos de dados ligados e eixo Y oculto quando todas as barras têm rótulo |
| Série temporal | Linha de 2 px #4f3c88, sem suavização, pontos só no último valor; grade #eeeeee |
| Rosca | Espessura ~30%, paleta categórica em ordem, legenda à direita com valor |
| Link | Texto "Ver anúncio" #4f3c88 semibold, sem sublinhado |
| Rodapé | Branco com borda superior #e0e0e0, logo, telefone e site em #4f3c88 |

## Problemas encontrados nos dados originais

Estes pontos estão nas capturas e devem ser corrigidos na fonte do relatório. Nas telas novas, os valores 1 e 2 já aparecem recalculados.

1. **Crescimento de moradores 2010 → 2022** aparece como +37,4%, que é o valor do sexo feminino. Com 12.036 → 15.995, o correto é **+32,89%**. Afeta o Resumo executivo e a Demografia 2010 × 2022.
2. **Domicílios com 1 morador** aparece como +121,56%, que é o valor dos idosos. Com 845 → 1.822, o correto é **+115,62%**. Afeta as mesmas duas telas.
3. **Pirâmide etária** tem duas faixas começando em 30 ("30-49" e "30-39"); a primeira deveria ser **40-49**.
4. **Pirâmide dos cônjuges**: o rótulo diz "Toda a população casada **asados** (sexo diferente…)", com texto repetido e letra faltando.
5. **Comercial · Aluguel**: o filtro mostra 1 anúncio, mas a tabela lista os 5 anúncios de **venda** (R$ 320 a 750 mil). Falta o filtro de negócio na tabela. Na tela nova, a única linha é um exemplo calculado de vm² × área.
6. **Lançamentos**: o título do mapa diz "Residencial para venda".
7. **Shortstay**: a coluna Nota exibe `null`; a tela nova usa "—".
8. **Resumo**: as classes de rendimento têm triângulos (▲ ▼ ●) sem legenda. Eles foram removidos; se comparam com a cidade, precisam de legenda.

## Valores presumidos nos protótipos

- Rótulos trimestrais da evolução do vm²: T2/2023 a T3/2026 no residencial (14 pontos, como nos gráficos por quartos) e T2/2023 a T2/2026 no comercial (13 pontos). A captura principal não mostrava o eixo.
- Os percentuais menores do estágio da obra (acréscimo e demolição, cerca de 2% cada) e o de "Paralisada" (cerca de 2,1%) foram lidos do gráfico, sem rótulo na captura.
- Títulos de anúncios mantêm o corte da fonte ("…"). "Espaço I…" do shortstay foi lido como "Espaço inteiro".
- A tabela de equipamentos mostra as 8 linhas visíveis das 21.
- Mapas, pontos e manchas de setores são ilustrativos (gerados por semente), não georreferenciados.

## Regenerar os ícones

`assets/icons.js` contém só os ícones usados. Para adicionar um, baixe o pacote `lucide-static` (`npm pack lucide-static`) e copie o miolo do SVG de `package/icons/<nome>.svg` para o objeto `window.LUCIDE`, com a chave igual ao nome usado em `data-lucide`.
