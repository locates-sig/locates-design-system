# Telas do BI com o design system Locates

Redesenho das telas dos relatórios de BI (Looker Studio) capturadas em `looker/`: as 17 telas do **estudo de área** (imóvel 6523, Itacorubi, raio de 1 km) e as 10 telas do **Observatório do mercado** (Florianópolis inteira, versão 3.0), aplicando os tokens (`tokens.css`) e os componentes do sistema. São protótipos em HTML estático que servem de referência visual e de especificação para refazer o relatório no Looker Studio.

**Como abrir:** abra `index.html` no navegador, ou veja as capturas em `previews/` (1440 px, página inteira). Não há build nem dependências. Os ícones lucide estão embutidos em `assets/icons.js`; a Montserrat vem do Google Fonts via `tokens.css`.

## Telas

### Estudo de área

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

### Observatório do mercado

Capturas em `looker/observatorio/`. Mesmo sistema visual; o cabeçalho mostra "Observatório do mercado · Florianópolis-SC" e as abas são as do Observatório. Em cada modalidade, as abas pill alternam Ofertas e Valorização, e o segmented alterna Residencial e Comercial.

| Seção | Tela nova | Capturas originais |
| --- | --- | --- |
| Venda · Ofertas | `observatorio-venda-residencial.html` | `venda/` (1ª e 2ª) |
| | `observatorio-venda-comercial.html` | `venda/` (3ª e 4ª) |
| Venda · Valorização | `observatorio-venda-valorizacao-residencial.html` | `valorizacao/` (1ª a 3ª) |
| | `observatorio-venda-valorizacao-comercial.html` | `valorizacao/` (4ª) |
| Longstay · Ofertas | `observatorio-longstay-residencial.html` | `longstay/` (1ª e 2ª) |
| | `observatorio-longstay-comercial.html` | `longstay/` (3ª e 4ª) |
| Longstay · Valorização | `observatorio-longstay-valorizacao-residencial.html` | `valorizacao/` (5ª e 6ª) |
| | `observatorio-longstay-valorizacao-comercial.html` | `valorizacao/` (7ª) |
| Obras | `observatorio-obras.html` | `obras/` |
| Sociodemográfico | `observatorio-sociodemografico.html` | `sociodemografico/` |

A aba **Shortstay** do Observatório não tinha captura e fica desabilitada.

O que mudou em relação ao original, além do que vale para o estudo de área:

- **Valorização:** o eixo Y começava em zero, o que achatava toda a série numa linha reta no topo do gráfico. Agora a escala acompanha os dados, com rótulo só no primeiro, no último, no máximo e no mínimo. As variações de 3, 6 e 12 meses viraram badges com seta e sinal, na barra de resumo e em cada gráfico por quartos. Os quatro gráficos por quartos compartilham a mesma escala.
- **Mês sem dado:** no longstay, outubro/2025 não aparece no eixo da fonte. A série mostra esse mês como lacuna (tracejado cinza), sem ligar os pontos como se houvesse dado.
- **Ofertas:** as linhas de dormitórios, banheiros e suítes viraram colunas, e as tabelas de faixa usam a escala lilás → roxo no lugar do vermelho. Os emojis dos títulos de anúncio foram removidos.
- **Obras:** a pizza de status com uma só fatia (100% Ativa) saiu, porque repetia o filtro. O incorporador sem nome (732 obras) aparece como "Não informado no CNO". A tipologia agrupa as três categorias menores em "Outros".
- **Sociodemográfico:** os comparativos 2010 × 2022 usam o mesmo cartão das telas de demografia. Nas três tabelas de crescimento dos bairros, a variação usa a escala sequencial lilás → roxo.

`assets/observatorio.js` (`window.LBI_OBS`) tem a navegação, o contexto do cabeçalho, o mapa da cidade e o layout de Valorização.

## Arquivos

- `assets/bi.css`: camada de relatório sobre `tokens.css` (cabeçalho, abas, cartões, KPIs, tabelas, mapa, gráficos). Só usa tokens do sistema, mais as cores de gráfico abaixo.
- `assets/bi.js`: `window.LBI`, com o shell (cabeçalho, abas, subnavegação e rodapé), formatação pt-BR, gráficos em SVG (colunas, linha, colunas agrupadas, pirâmide, rosca), barras, tabelas, tooltip e um mapa ilustrativo.
- `assets/mercado.js`: os layouts compartilhados de Mercado (listagem, comercial e evolução), usados também pelo Observatório.
- `assets/observatorio.js`: navegação, cabeçalho e layout de Valorização do Observatório.
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

### Observatório

9. **Valorização · Venda residencial · 3 quartos:** a série vai de 12.505 (09/2025) a 12.664 (08/2026), uma alta de 1,27%, mas o cartão mostra **−5,87%** em 12 meses (e −4,89% em 3 meses, contra −2,35% pela série). As outras variações batem com as séries. A tela nova repete os valores da fonte; vale revisar o cálculo desse cartão.
10. **Valorização · Longstay residencial:** o primeiro gráfico por quartos também se chama "3 QUARTOS" (há dois). Pela ordem (depois vêm 2, 3 e 4 quartos), a tela nova o trata como **1 quarto**.
11. **Valorização · Longstay:** o eixo diz "Data (Ano e trimestre)", mas os pontos são mensais. Outubro/2025 não tem dado (residencial e comercial), e o gráfico de 4 quartos está vazio.
12. **Venda · Ofertas · Suítes:** a primeira coluna não tem rótulo (4,6 mil anúncios antes do "0"); a tela nova a chama de "N/I" (não informado). O mesmo acontece no longstay.
13. **Obras · Incorporadores:** a primeira linha, com 732 obras, não tem nome.
14. **Longstay · Ofertas · Comercial:** o primeiro anúncio tem aluguel de R$ 17.000 por 60 m² (R$ 283,33/m²), bem acima das faixas da tabela; pode ser erro de cadastro.

## Valores presumidos nos protótipos

- Rótulos trimestrais da evolução do vm²: T2/2023 a T3/2026 no residencial (14 pontos, como nos gráficos por quartos) e T2/2023 a T2/2026 no comercial (13 pontos). A captura principal não mostrava o eixo.
- Os percentuais menores do estágio da obra (acréscimo e demolição, cerca de 2% cada) e o de "Paralisada" (cerca de 2,1%) foram lidos do gráfico, sem rótulo na captura.
- Títulos de anúncios mantêm o corte da fonte ("…"). "Espaço I…" do shortstay foi lido como "Espaço inteiro".
- A tabela de equipamentos mostra as 8 linhas visíveis das 21.
- Mapas, pontos e manchas de setores são ilustrativos (gerados por semente), não georreferenciados.
- Observatório: as contagens de dormitórios, banheiros e suítes vêm dos rótulos arredondados da fonte ("13,5 mil", "1,6 mil"), e a coluna mais alta de banheiros da venda (14,1 mil) foi lida com o rótulo parcialmente coberto.
- Observatório · Longstay residencial: a lista de anúncios não mostrava área nem vm² na captura, então a tabela tem só quartos e aluguel.
- Observatório · Valorização longstay: os valores por quartos vêm dos rótulos arredondados (R$ 89, R$ 56…); o destaque de cada cartão é o valor que a fonte mostrava no topo.
- Observatório · Obras: os percentuais de demolição, acréscimo e das tipologias menores foram lidos do gráfico, sem rótulo na captura.

## Regenerar os ícones

`assets/icons.js` contém só os ícones usados. Para adicionar um, baixe o pacote `lucide-static` (`npm pack lucide-static`) e copie o miolo do SVG de `package/icons/<nome>.svg` para o objeto `window.LUCIDE`, com a chave igual ao nome usado em `data-lucide`.
