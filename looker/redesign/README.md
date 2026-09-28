# Telas do BI no tema moderno Locates

Recriação das telas dos relatórios de BI (Looker Studio) capturadas em `looker/`, **mantendo o layout e as informações de cada tela original** e trocando só o visual pelo tema moderno do print de referência (`looker/referencia/tema-moderno.png`). O cliente reconhece as mesmas seções, cartões, gráficos, tabelas e filtros, nas mesmas posições e com os mesmos números.

São 28 telas: 18 do **estudo de área** (imóvel 6523, Itacorubi, raio de 1 km) e 10 do **Observatório do mercado** (Florianópolis, versão 3.0).

**Como abrir:** abra `index.html` no navegador ou veja as capturas em `previews/` (1440 px, página inteira). Não há build nem dependências. A Montserrat vem do Google Fonts via `tokens.css`.

## Telas

### Estudo de área

| Seção | Tela | Capturas originais |
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
| Empresas | `empresas.html` | `empresas/` |
| Equipamentos urbanos | `equipamentos-urbanos.html` | `equipamentos-urbanos/` |

### Observatório do mercado

| Seção | Tela | Capturas originais (`observatorio/`) |
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

A aba **Shortstay** do Observatório não tinha captura e aparece desabilitada.

## O que mudou (só o visual)

Tirado do print de referência:

- **Fundo e cartões:** fundo lilás-acinzentado claro (#f5f4f9) e cartões brancos com borda fina, cantos de 10 px e sombra leve, no lugar das faixas e molduras roxas cheias.
- **Abas e botões:** botões brancos com borda; o selecionado fica roxo (`primary` #4f3c88). Filtros do Looker (Tipologia, Tipo de negócio, Quartos, Bairro…) continuam como listas suspensas roxas.
- **Títulos dos cartões:** texto escuro com a palavra-chave em roxo ("Ofertas por **dormitórios**"), no lugar do verde. Um selo lilás à direita indica a unidade do gráfico ("Anúncios", "Total").
- **Gráficos de linha:** linha roxa suave com área em degradê e pontos vazados, com os mesmos rótulos de valor da tela original.
- **Tabelas:** cabeçalho lilás, linhas brancas; as colunas de vm² e contagens mantêm a escala de cor da tela original (vermelho, verde ou roxo) em pílulas arredondadas.
- **Mapa:** raio de 1 km tracejado com o selo "RAIO 1.000m", controle de distância escuro com marcador verde-água e o aviso "Somente anúncios georreferenciados aparecem no mapa".
- **Indicadores do topo:** rótulo pequeno em caixa alta e valor em roxo (Vm², Área, Total…).
- **Ícones:** os pictogramas desenhados foram trocados por ícones lucide equivalentes.

Nada foi acrescentado nem removido: seções, gráficos, tabelas, legendas, textos de apoio e números são os das capturas, inclusive os que parecem errados (lista abaixo).

## Arquivos

- `assets/lk.css`: o tema (superfícies, abas, filtros, tabelas, gráficos, mapa, rodapé), sobre `tokens.css`.
- `assets/lk.js`: `window.LK`, com cabeçalhos e rodapés dos dois relatórios, formatação pt-BR, gráficos em SVG (linha, colunas, colunas agrupadas, pizza/rosca, pirâmide, barras), tabelas, tooltip e o mapa ilustrativo.
- `assets/lk-mercado.js`: layouts repetidos de Mercado e do Observatório (ofertas, comercial, evolução, valorização).
- `assets/icons.js`: subconjunto de ícones lucide (ISC, `lucide-static` 1.48.0).
- `assets/shortstay-foto.jpg`: a foto do cartão do shortstay, recortada da captura original.

## Como aplicar no Looker Studio

| Configuração | Valor |
| --- | --- |
| Fonte | Montserrat |
| Fundo da página | #f5f4f9 |
| Componentes | fundo #ffffff, borda #e6e3ee (1 px), raio 10, sombra leve |
| Cabeçalho dos cartões | fundo #fbfafd, texto #2a2838 13 px semibold, palavra-chave em #4f3c88 |
| Texto | #2a2838 principal, #6b6880 secundário, #9a97ab eixos e rótulos |
| Botão / aba selecionada | fundo #4f3c88, texto branco, raio 6 |
| Botão / aba normal | fundo branco, borda #dcd8e6, texto #2a2838 em caixa alta |
| Lista suspensa | fundo #4f3c88, texto branco em caixa alta, raio 6 |
| Cabeçalho de tabela | fundo #ebe8f5, texto #2a2838 semibold |
| Linhas de tabela | brancas, divisória #f0eef5, sem zebra |
| Série principal | #4f3c88, linha suave, área com 20% → 0% de opacidade, pontos vazados |
| Grade dos gráficos | #ebe9f1 tracejada |
| Controle de distância | fundo #47356f, marcador #2ed6c7 |
| Paleta de categorias | #4f3c88, #54a2ff, #f99c00, #1447e6, #009767, #ff667f, #8b87a0, #6b21a8 |

## Inconsistências nas capturas originais

Estão reproduzidas como na fonte e devem ser corrigidas no relatório:

1. **Crescimento de moradores 2010 → 2022** mostra +37,4% (valor do sexo feminino); 12.036 → 15.995 dá +32,89%. Aparece no Resumo e na Demografia 2010 × 2022.
2. **Domicílios com 1 morador** mostra +121,56% (valor dos idosos); 845 → 1.822 dá +115,62%.
3. **Pirâmide etária:** duas faixas começam em 30 ("30-49" e "30-39"); a primeira deveria ser 40-49.
4. **Pirâmide dos cônjuges:** o rótulo diz "Toda a população casada asados (sexo diferente e mesmo sexo)".
5. **Comercial · Aluguel:** o filtro mostra 1 anúncio, mas a tabela lista os 5 anúncios de venda.
6. **Lançamentos:** o título do mapa diz "Residencial para venda".
7. **Shortstay:** a coluna Nota mostra `null`.
8. **Observatório · Valorização · Venda residencial · 3 quartos:** a série sobe 1,27% no ano, mas o cartão mostra −5,87% em 12 meses.
9. **Observatório · Valorização · Longstay residencial:** há dois gráficos "3 QUARTOS" (o primeiro, pela ordem, seria 1 quarto); o eixo diz "Ano e trimestre" com dados mensais; outubro/2025 não aparece; o gráfico de 4 quartos está vazio.
10. **Observatório · Suítes:** a primeira coluna do gráfico não tem rótulo.
11. **Observatório · Obras · Incorporadores:** a primeira linha (732 obras) não tem nome.

## O que é ilustrativo

- Os mapas são desenhos que imitam o Google Maps (quadras, orla, pontos, setores); no Looker continuam sendo o mapa real.
- Onde uma fatia de pizza não tinha rótulo na captura (por exemplo, as naturezas jurídicas menores em Empresas), a fatia aparece sem percentual e com tamanho aproximado.
- As contagens dos gráficos do Observatório vêm dos rótulos arredondados da fonte ("1,6 mil").
- A tabela de equipamentos mostra as 8 linhas visíveis das 21; as listas de anúncios mostram as linhas visíveis de cada captura.

## Regenerar os ícones

`assets/icons.js` contém só os ícones usados. Para adicionar um, baixe `lucide-static` (`npm pack lucide-static`) e copie o miolo de `package/icons/<nome>.svg` para `window.LUCIDE`, com a chave igual ao nome usado em `data-lucide`.
