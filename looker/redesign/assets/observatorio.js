/* Locates BI — Observatório do mercado (visão da cidade inteira) */
(function () {
  "use strict";
  const { fmt } = LBI;

  const both = (base) => [
    { id: "residencial", label: "Residencial", href: `observatorio-${base}-residencial.html` },
    { id: "comercial", label: "Comercial", href: `observatorio-${base}-comercial.html` },
  ];
  const NAV = [
    { id: "venda", label: "Venda", icon: "tag", href: "observatorio-venda-residencial.html", subs: [
      { id: "ofertas", label: "Ofertas", href: "observatorio-venda-residencial.html", modes: both("venda") },
      { id: "valorizacao", label: "Valorização", href: "observatorio-venda-valorizacao-residencial.html", modes: both("venda-valorizacao") } ] },
    { id: "longstay", label: "Longstay", icon: "key-round", href: "observatorio-longstay-residencial.html", subs: [
      { id: "ofertas", label: "Ofertas", href: "observatorio-longstay-residencial.html", modes: both("longstay") },
      { id: "valorizacao", label: "Valorização", href: "observatorio-longstay-valorizacao-residencial.html", modes: both("longstay-valorizacao") } ] },
    { id: "shortstay", label: "Shortstay", icon: "calendar-days", href: "#", disabled: true },
    { id: "obras", label: "Obras", icon: "hard-hat", href: "observatorio-obras.html" },
    { id: "sociodemografico", label: "Sociodemográfico", icon: "users", href: "observatorio-sociodemografico.html" },
  ];
  const CONTEXT = { eyebrow: "Observatório do mercado · versão 3.0", title: "Florianópolis-SC" };

  // Mapa da cidade: ilha entre as duas baías, sem raio nem imóvel de referência
  const CITY_MAP = { water: "bay", radius: false, pin: false, slider: false, parks: 5, cx: 500, cy: 320 };
  const cityPoints = (n, extra = {}) => ({ n, sx: 70, sy: 190, r: 5, ...extra });

  function page(p) { return { nav: NAV, context: CONTEXT, ...p }; }

  const MONTHS = ["09/25", "10/25", "11/25", "12/25", "01/26", "02/26", "03/26", "04/26", "05/26", "06/26", "07/26", "08/26"];

  // Variação do último mês contra o início da janela (a janela de n meses inclui o mês atual)
  function variation(vals, n) {
    const last = vals[vals.length - 1], base = vals[vals.length - n];
    if (last == null || base == null) return null;
    return (last / base - 1) * 100;
  }
  function delta(v, big) {
    if (v == null) return `<span class="delta delta--neutral">sem dados</span>`;
    const up = v >= 0;
    return `<span class="delta ${up ? "delta--up" : "delta--down"}${big ? " delta--lg" : ""}"><i data-lucide="${up ? "arrow-up" : "arrow-down"}"></i>${up ? "+" : ""}${fmt.pct(v, 2)}</span>`;
  }
  // Variações informadas pela fonte (3, 6, 12 meses); sem elas, calcula a partir da série
  const vars = (vals, given) => [3, 6, 12].map((n, k) => (given ? given[k] : variation(vals, n)));
  const windows = (vals, given) => `<div class="windows">${vars(vals, given).map((v, k) => `<div class="windows__item"><span class="windows__label">${[3, 6, 12][k]} meses</span>${delta(v)}</div>`).join("")}</div>`;

  /* Valorização: série mensal do vm² + séries por número de quartos */
  function valorizacao(o) {
    const M = LBI_MERCADO;
    const main = document.querySelector("main");
    const vf = o.decimals ? (v) => fmt.brl(v) : (v) => fmt.brl0(v);
    const summary = vars(o.values, o.vars).map((v, k) => [`Variação ${[3, 6, 12][k]} meses`, delta(v)]);
    if (o.avg) summary.unshift(["vm² médio no período", o.avg]);
    main.innerHTML = M.toolbar({ spatial: false, selects: o.selects, summary }) + `
      <section class="card">
        <div class="card__head"><div class="card__titles"><h2 class="card__title">Evolução do preço do m²</h2><p class="card__subtitle">${o.sub}</p></div></div>
        <div id="c-main"></div>
        <p class="footnote">Valor médio ponderado do m² anunciado em cada mês. Variações de 3, 6 e 12 meses como informadas pela fonte.${o.gapNote ? " " + o.gapNote : ""}</p>
      </section>
      ${o.multiples ? `<h2 class="section-title"><i data-lucide="bed-double"></i>Por número de quartos<small>Mesma escala nos quatro gráficos</small></h2>
      <div class="grid grid--2" id="multiples"></div>` : ""}`;
    LBI.shell(page(o.page));
    LBI.line("#c-main", { labels: MONTHS, values: o.values, fmt: vf, tickFmt: (v) => fmt.int(v), valueName: "vm² ponderado", height: 300 });
    if (!o.multiples) return;
    const all = o.multiples.flatMap((m) => m.values).filter((v) => v != null);
    const dom = [Math.min(...all), Math.max(...all)];
    const box = document.getElementById("multiples");
    o.multiples.forEach((m, i) => {
      const has = m.values.some((v) => v != null);
      const last = [...m.values].reverse().find((v) => v != null);
      const value = m.kpi ?? (has ? vf(last) : "Sem dados");
      const unit = !has && !m.kpi ? "" : `<small>/m² ${m.kpi ? "médio" : "em 08/26"}</small>`;
      box.insertAdjacentHTML("beforeend", `<section class="card">
        <div class="card__head"><div class="kpi kpi--plain"><span class="kpi__label"><i data-lucide="bed-double"></i>${m.name}</span><span class="kpi__value">${value}${unit}</span></div></div>
        ${has ? (o.windows === false ? "" : windows(m.values, m.vars)) + `<div id="m${i}"></div>` : `<div class="empty"><i data-lucide="chart-no-axes-combined"></i><p>Sem anúncios suficientes para montar a série.</p></div>`}
      </section>`);
      if (has) LBI.line("#m" + i, { labels: MONTHS, values: m.values, fmt: vf, tickFmt: (v) => (v >= 1000 ? fmt.compact(v) : fmt.int(v)), valueName: "vm² ponderado", height: 190, domain: dom, labelMode: "last" });
    });
  }

  /* Comparativo 2010 → 2022 */
  function compare(name, a, b, f = fmt.int) {
    const d = (b / a - 1) * 100;
    return `<div class="compare"><span class="compare__name">${name}</span><div class="compare__vals"><span class="compare__from"><b>${f(a)}</b></span><span class="compare__arrow">→</span><span class="compare__to">${f(b)}</span></div>${delta(d)}<span class="compare__years"><span>2010</span><span>→</span><span>2022</span></span></div>`;
  }

  window.LBI_OBS = { NAV, CONTEXT, CITY_MAP, cityPoints, page, valorizacao, compare, delta, MONTHS };
})();
