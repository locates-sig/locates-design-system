/* Locates BI — layouts de Mercado (estudo de área e Observatório), no mesmo arranjo das capturas */
(function () {
  "use strict";
  const { fmt, card, dd, seg, kpis, btn } = LK;

  const MODES = {
    residencial: [["venda", "Venda", "mercado-residencial-venda.html"], ["shortstay", "Shortstay", "mercado-residencial-shortstay.html"], ["longstay", "Longstay", "mercado-residencial-longstay.html"], ["lancamentos", "Lançamentos", "mercado-residencial-lancamentos.html"], ["evolucao", "Evolução", "mercado-residencial-evolucao.html"]],
    comercial: [["venda", "Venda", "mercado-comercial-venda.html"], ["aluguel", "Aluguel", "mercado-comercial-aluguel.html"], ["evolucao", "Evolução", "mercado-comercial-evolucao.html"]],
  };
  const brl = (v) => fmt.brl(v);

  // Linha de modos (Venda, Shortstay…) + Tipologia + Vm²/Área, como no topo do print
  function modeBar(o) {
    return `<div class="lk-bar">${MODES[o.sub].map(([id, l, h]) => btn(l, h, id === o.mode)).join("")}<span class="lk-spacer"></span>${dd("Tipologia: " + o.tipologia[0], o.tipologia[1])}<span class="lk-bar__sep"></span>${kpis(o.kpis)}</div>`;
  }
  const spatial = () => `<section class="lk-card"><div class="lk-card__body" style="padding:10px 14px">${seg("Filtro espacial:", ["Logradouro", "Raio", "Bairro"], "Raio")}</div></section>`;
  const tableCard = (id, title) => card({ title, id, flush: true });
  const chartCard = (id, title, chip) => card({ title, chip, id });

  function rangeTables(o, head2) {
    LK.table("#t-area", { columns: [{ label: "Metragens" }, { label: "Anúncios", align: "c", fmt: "int" }, { label: "vm²", heat: "red", fmt: brl }], rows: o.area });
    LK.table("#t-valor", { columns: [{ label: head2 || "Valores" }, { label: "Anúncios", align: "c", fmt: "int" }, { label: "vm²", heat: "red", fmt: brl }], rows: o.valor });
  }
  function charts(o) {
    const opt = (title, data) => ({ labels: data.map((d) => d[0]), values: data.map((d) => d[1]), xTitle: title, valueName: "Anúncios", height: 190, fmt: o.countFmt || "int", tickFmt: o.countFmt || "int", minLabelGap: 20 });
    LK.line("#c-dorm", opt("Quartos", o.dorm));
    LK.line("#c-banh", opt("Banheiros", o.banh));
    LK.line("#c-suit", opt("Suítes", o.suites));
  }
  function listingTable(o) {
    LK.table("#t-list", { columns: o.cols, rows: o.rows.map((r) => [...r, ""]), pager: o.pager, maxHeight: o.maxHeight || 560 });
  }
  const COLS_FULL = [{ label: "Título", title: true, sort: "desc" }, { label: "Valor", align: "c", fmt: brl }, { label: "Área", align: "c" }, { label: "vm²", align: "c", fmt: brl }, { label: "Quartos", align: "c" }, { label: "Suítes", align: "c" }, { label: "Banheiros", align: "c" }, { label: "Garagem", align: "c" }, { label: "Link", link: "Link do Anúncio", align: "c" }];
  const COLS_SHORT = [{ label: "Título", title: true, sort: "desc" }, { label: "Valor", align: "c", fmt: brl }, { label: "Área", align: "c" }, { label: "vm²", align: "c", fmt: brl }, { label: "Link", link: "Link do Anúncio", align: "c" }];

  /* Estudo de área · Residencial (Venda, Longstay, Lançamentos) */
  function estudoResidencial(o) {
    LK.page({ section: "mercado", sub: "residencial", updated: o.updated }, modeBar({ ...o, sub: "residencial" }) + `
      <div class="lk-grid" style="grid-template-columns:23% minmax(0,1fr) 21%">
        <div class="lk-col" style="grid-row:span 2">
          ${spatial()}
          ${chartCard("c-dorm", "Ofertas por <b>dormitórios</b>", "Anúncios")}
          ${tableCard("t-area", "Ofertas por intervalo de <b>área</b>")}
          ${tableCard("t-valor", "Ofertas por intervalo de <b>valor</b>")}
        </div>
        <div class="lk-col">
          <div class="lk-title-bar">${o.mapTitle}</div>
          <section class="lk-card" style="flex:1"><div id="map"></div></section>
        </div>
        <div class="lk-col">
          ${chartCard("c-banh", "Ofertas por <b>banheiros</b>", "Anúncios")}
          ${chartCard("c-suit", "Ofertas por <b>suítes</b>", "Anúncios")}
        </div>
        <div class="lk-span-2">${tableCard("t-list", null)}</div>
      </div>`);
    LK.map("#map", { seed: o.seed, height: 540, style: o.style, radius: true, slider: true, note: "Somente anúncios georreferenciados aparecem no mapa", points: { n: o.points, spread: 120 } });
    charts(o); rangeTables(o); listingTable({ cols: COLS_FULL, ...o });
  }

  /* Estudo de área · Comercial (Venda, Aluguel) */
  function estudoComercial(o) {
    LK.page({ section: "mercado", sub: "comercial", updated: o.updated }, modeBar({ ...o, sub: "comercial" }) + `
      <div class="lk-grid" style="grid-template-columns:minmax(0,1fr) 42%">
        <div class="lk-col">
          ${spatial()}
          <div class="lk-title-bar">${o.mapTitle}</div>
          <section class="lk-card" style="flex:1"><div id="map"></div></section>
        </div>
        <div class="lk-col" style="padding-top:0">
          ${tableCard("t-area", "Ofertas por <b>área</b>")}
          ${tableCard("t-valor", "Ofertas por <b>valor</b>")}
        </div>
        <div class="lk-span-all">${tableCard("t-list", null)}</div>
      </div>`);
    LK.map("#map", { seed: o.seed, height: 470, kind: o.kind, radius: o.kind !== "city", slider: true, note: "Somente anúncios georreferenciados aparecem no mapa", points: { n: o.points, spread: 90 } });
    rangeTables(o, o.valorHead); listingTable({ cols: COLS_SHORT, ...o });
  }

  /* Observatório · linha Ofertas/Valorização + Residencial/Comercial */
  const OBS_LINKS = {
    venda: { ofertas: ["observatorio-venda-residencial.html", "observatorio-venda-comercial.html"], valorizacao: ["observatorio-venda-valorizacao-residencial.html", "observatorio-venda-valorizacao-comercial.html"] },
    longstay: { ofertas: ["observatorio-longstay-residencial.html", "observatorio-longstay-comercial.html"], valorizacao: ["observatorio-longstay-valorizacao-residencial.html", "observatorio-longstay-valorizacao-comercial.html"] },
  };
  function obsSubRow(p) {
    const L = OBS_LINKS[p.section], i = p.mode === "comercial" ? 1 : 0;
    return `<div class="lk-bar">${btn("Ofertas", L.ofertas[i], p.sub === "ofertas")}${btn("Valorização", L.valorizacao[i], p.sub === "valorizacao")}<span class="lk-spacer"></span>
      ${btn("Residencial", L[p.sub][0], p.mode === "residencial", " lk-btn--sm")}${btn("Comercial", L[p.sub][1], p.mode === "comercial", " lk-btn--sm")}</div>`;
  }
  // Filtros roxos + Total + Valor de m² / Área das unidades
  function obsFilterBar(o) {
    return `<div class="lk-bar">${o.filters.map(([l, c]) => dd(l, c)).join("")}<span class="lk-spacer"></span>${kpis(o.kpis)}</div>`;
  }

  /* Observatório · Ofertas residencial */
  function obsResidencial(o) {
    LK.page({ report: "obs", section: o.section, updated: o.updated }, obsSubRow({ section: o.section, sub: "ofertas", mode: "residencial" }) + obsFilterBar(o) + `
      <div class="lk-grid" style="grid-template-columns:22% minmax(0,1fr) 22%">
        <div class="lk-col" style="grid-row:span 2">
          ${chartCard("c-dorm", "Ofertas por <b>dormitórios</b>", "Anúncios")}
          ${tableCard("t-area", "Ofertas por intervalo de <b>área</b>")}
          ${tableCard("t-valor", "Ofertas por intervalo de <b>valor</b>")}
        </div>
        <div class="lk-col"><div class="lk-title-bar">Mapa de anúncios</div><section class="lk-card" style="flex:1"><div id="map"></div></section></div>
        <div class="lk-col">
          ${chartCard("c-banh", "Ofertas por <b>banheiros</b>", "Anúncios")}
          ${chartCard("c-suit", "Ofertas por <b>suítes</b>", "Anúncios")}
        </div>
        <div class="lk-span-2">${tableCard("t-list", null)}</div>
      </div>`);
    LK.map("#map", { seed: o.seed, height: 560, kind: "city", note: "Somente anúncios georreferenciados aparecem no mapa", points: { n: 170, r: 6, dense: true } });
    charts(o); rangeTables(o); listingTable(o);
  }

  /* Observatório · Ofertas comercial */
  function obsComercial(o) {
    LK.page({ report: "obs", section: o.section, updated: o.updated }, obsSubRow({ section: o.section, sub: "ofertas", mode: "comercial" }) + obsFilterBar(o) + `
      <div class="lk-grid" style="grid-template-columns:23% minmax(0,1fr) 23%">
        ${tableCard("t-area", "Ofertas por intervalo de <b>área</b>")}
        <div class="lk-col"><div class="lk-title-bar">Mapa de anúncios</div><section class="lk-card" style="flex:1"><div id="map"></div></section></div>
        ${tableCard("t-valor", "Ofertas por intervalo de <b>valor</b>")}
        <div class="lk-span-all">${tableCard("t-list", null)}</div>
      </div>`);
    LK.map("#map", { seed: o.seed, height: 520, kind: "city", note: "Somente anúncios georreferenciados aparecem no mapa", points: { n: 120, r: 6, dense: true, colors: ["--c1", "--c6"], alpha: 0.85 } });
    rangeTables(o); listingTable(o);
  }

  window.LKM = { estudoResidencial, estudoComercial, obsResidencial, obsComercial, obsSubRow, obsFilterBar, modeBar, spatial, MODES, COLS_FULL, COLS_SHORT };
})();

/* Evolução do m² (estudo de área) */
(function () {
  const { fmt, card, dd, seg, btn } = LK;
  function estudoEvolucao(o) {
    const brl0 = (v) => fmt.brl(v, 0);
    LK.page({ section: "mercado", sub: o.sub }, `
      <div class="lk-bar">${LKM.MODES[o.sub].map(([id, l, h]) => btn(l, h, id === "evolucao")).join("")}<span class="lk-spacer"></span>${dd("Tipolo...", o.tipCount)}${dd("Negóc...", 1)}<span class="lk-bar__sep"></span>${LK.kpis([["vm² médio no período", o.avg]])}</div>
      <section class="lk-card" style="align-self:flex-start"><div class="lk-card__body" style="padding:10px 14px">${seg("Filtro espacial:", ["Raio", "Bairro"], "Raio")}</div></section>
      ${card({ title: "Evolução do <b>m²</b>", chip: "*Dados com amostras para o raio de 1km do imóvel", id: "c-main" })}
      ${o.multiples ? `<div class="lk-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${o.multiples.map((m, i) => card({ title: `<b>${m.name}</b>`, chip: "vm² (R$)", body: `<div class="lk-score" style="padding:6px"><span class="lk-score__value lk-score__value--purple">${brl0(m.avg)}</span></div><div id="m${i}"></div>` })).join("")}</div>` : ""}`);
    LK.line("#c-main", { labels: o.labels, values: o.values, fmt: brl0, tickFmt: "int", valueName: "vm²", height: 420, minLabelGap: 70 });
    (o.multiples || []).forEach((m, i) => LK.line("#m" + i, { labels: o.labels, values: m.values, fmt: "int", tickFmt: "int", valueName: "vm² (R$)", xTitle: "Data (Ano e trimestre)", height: 260, minLabelGap: 64 }));
  }
  window.LKM.estudoEvolucao = estudoEvolucao;
})();


/* Observatório · Valorização (mesmo arranjo da captura) */
(function () {
  const { fmt, card } = LK;
  // Formato como no Looker: sem zeros finais nos decimais (R$ 67,9 · R$ 70)
  const brlTrim = (v) => "R$ " + fmt.dec(v, 2).replace(/,00$/, "").replace(/(,\d)0$/, "$1");
  const vars = (v) => `<div class="lk-kpis" style="gap:6px 22px">${["3 meses", "6 meses", "12 meses"].map((l, i) => `<div class="lk-kpi" style="text-align:center"><span class="lk-kpi__value lk-kpi__value--ink" style="font-size:13px;color:var(--lk-purple)">${l}</span><span class="lk-kpi__delta">${LK.delta(v[i])}</span></div>`).join("")}</div>`;
  function obsValorizacao(o) {
    const mf = o.multFmt || "int";
    LK.page({ report: "obs", section: o.section, updated: o.updated }, LKM.obsSubRow({ section: o.section, sub: "valorizacao", mode: o.mode }) + `
      <div class="lk-bar">${o.filters.map(([l, c]) => LK.dd(l, c)).join("")}<span class="lk-spacer"></span><span class="lk-chip" style="padding:8px 12px">% Variação</span>${vars(o.vars)}</div>
      <section class="lk-card"><div class="lk-card__head" style="flex-direction:column;align-items:center;gap:2px;position:relative"><h2 class="lk-card__title lk-card__title--center" style="font-size:15px;letter-spacing:.04em">EVOLUÇÃO DO PREÇO DO M²</h2><span style="font-size:11px;color:var(--lk-ink-3)">(Valor médio do preço por m² dos imóveis no período)</span>${o.avg ? `<div class="lk-kpi" style="position:absolute;right:16px;top:8px"><span class="lk-kpi__label">vm² médio no período</span><span class="lk-kpi__value">${o.avg}</span></div>` : ""}</div>
        <div class="lk-card__body"><ul class="lk-legend lk-legend--row"><li><i style="background:var(--c1)"></i>Valor m² (ponderado)</li></ul><div id="c-main"></div></div></section>
      ${o.multiples ? `<div class="lk-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">${o.multiples.map((m, i) => card({ title: `<b>${m.name}</b>`, body: (m.vars ? vars(m.vars) : `<div class="lk-score" style="padding:4px"><span class="lk-score__value lk-score__value--purple">${m.big}</span></div>`) + (m.values ? `<div id="m${i}"></div>` : `<div class="lk-empty-chart"><i data-lucide="chart-no-axes-combined"></i></div>`) })).join("")}</div>` : ""}`);
    LK.line("#c-main", { labels: o.labels, values: o.values, fmt: o.mainFmt || brlTrim, tickFmt: "int", zero: o.zero, valueName: "Valor m² (ponderado)", xTitle: o.xTitle || "Data (Ano e mês)", height: 400, minLabelGap: 60 });
    (o.multiples || []).forEach((m, i) => m.values && LK.line("#m" + i, { labels: m.labels || o.labels, values: m.values, fmt: m.fmt || mf, tickFmt: "int", valueName: "Valor m²", xTitle: o.xTitle || "Data (Ano e mês)", height: 250, minLabelGap: 52 }));
  }
  window.LKM.obsValorizacao = obsValorizacao;
  window.LKM.brlTrim = brlTrim;
})();
