/* Locates BI — layouts compartilhados da seção Mercado imobiliário */
(function () {
  "use strict";
  const { fmt } = LBI;

  const brlOrDec = (d) => (v) => fmt.brl(v, d);

  function toolbar(o) {
    return `
      <div class="bi-toolbar"><div data-subnav></div></div>
      <div class="bi-toolbar">
        ${o.spatial === false ? "" : `<div class="seg seg--sm" role="group" aria-label="Filtro espacial">
          <span class="seg__item" style="cursor:default;color:var(--foreground);font-weight:600"><i data-lucide="scan-search"></i>Filtro espacial</span>
          ${(o.spatialOpts || ["Logradouro", "Raio", "Bairro"]).map((s) => `<button class="seg__item" aria-pressed="${s === "Raio"}">${s}</button>`).join("")}
        </div>`}
        ${(o.selects || []).map((s) => `<button class="select" type="button"><span class="select__label">${s.label}</span><span class="select__value">${s.value}</span>${s.count ? `<span class="select__count">${s.count}</span>` : ""}<i data-lucide="chevron-down"></i></button>`).join("")}
        ${(o.ranges || []).map((r) => LBI.rangeHtml(r)).join("")}
        <span class="bi-toolbar__spacer"></span>
        <div class="summary">${o.summary.map(([l, v]) => `<div class="summary__item"><span class="summary__label">${l}</span><span class="summary__value">${v}</span></div>`).join("")}</div>
      </div>`;
  }

  function card(id, title, sub, extra = "") {
    return `<section class="card"><div class="card__head"><div class="card__titles"><h2 class="card__title">${title}</h2>${sub ? `<p class="card__subtitle">${sub}</p>` : ""}</div>${extra}</div><div id="${id}"></div></section>`;
  }

  function rangeTable(id, head, rows, d) {
    LBI.table("#" + id, {
      columns: [{ label: head }, { label: "Anúncios", num: true, bar: true, fmt: "int" }, { label: "vm² médio", num: true, heat: true, fmt: brlOrDec(d) }],
      rows,
    });
  }

  /* Venda / Longstay / Lançamentos (residencial) */
  function listing(o) {
    const main = document.querySelector("main");
    const d = o.decimals ?? 2;
    main.innerHTML = toolbar(o) + `
      <div class="grid grid--3">
        <section class="card card--flush span-2">
          <div class="card__head"><div class="card__titles"><h2 class="card__title">${o.mapTitle}</h2><p class="card__subtitle">${o.mapSub}</p></div>
          <div class="card__aside"><span class="badge badge--secondary"><i data-lucide="map-pin"></i>${o.count} anúncios</span></div></div>
          <div id="map" style="margin:16px 0 0;border-radius:0;flex:1"></div>
        </section>
        <div class="stack">
          ${card("t-area", "Ofertas por área", "Faixas de metragem · vm² médio da faixa")}
          ${card("t-valor", "Ofertas por valor", "Faixas de preço · vm² médio da faixa")}
        </div>
      </div>
      <div class="grid grid--3">
        ${card("c-q", "Ofertas por dormitórios", "Anúncios por número de quartos")}
        ${card("c-b", "Ofertas por banheiros", "Anúncios por número de banheiros")}
        ${card("c-s", "Ofertas por suítes", "Anúncios por número de suítes")}
      </div>
      <section class="card card--flush">
        <div class="card__head"><div class="card__titles"><h2 class="card__title">Anúncios</h2><p class="card__subtitle">${o.listSub}</p></div>
        <div class="card__aside"><button class="btn btn--outline btn--sm" type="button"><i data-lucide="download"></i>Exportar CSV</button></div></div>
        <div id="t-list" style="margin-top:16px"></div>
      </section>`;
    LBI.shell(o.page);
    LBI.map("#map", { seed: o.seed || 11, height: o.mapHeight || 560, radius: true, slider: true, points: { n: Math.min(o.count, 140), spread: 130 }, chip: "Somente anúncios georreferenciados aparecem no mapa", style: o.mapStyle });
    rangeTable("t-area", "Metragem", o.area, d);
    rangeTable("t-valor", "Valor", o.valor, d);
    LBI.columns("#c-q", { data: o.quartos, xTitle: "Quartos", xName: "Quartos:", valueName: "Anúncios", height: 190 });
    LBI.columns("#c-b", { data: o.banheiros, xTitle: "Banheiros", xName: "Banheiros:", valueName: "Anúncios", height: 190 });
    LBI.columns("#c-s", { data: o.suites, xTitle: "Suítes", xName: "Suítes:", valueName: "Anúncios", height: 190 });
    const full = o.rows[0].length > 5;
    LBI.table("#t-list", {
      columns: full
        ? [{ label: "Título", title: true, sort: "descending" }, { label: "Valor", num: true, fmt: brlOrDec(2) }, { label: "Área (m²)", num: true }, { label: "vm²", num: true, fmt: brlOrDec(2) }, { label: "Quartos", num: true }, { label: "Suítes", num: true }, { label: "Banheiros", num: true }, { label: "Vagas", num: true }, { label: "Link", link: true }]
        : [{ label: "Título", title: true, sort: "descending" }, { label: "Valor", num: true, fmt: brlOrDec(2) }, { label: "Área (m²)", num: true }, { label: "vm²", num: true, fmt: brlOrDec(2) }, { label: "Link", link: true }],
      rows: o.rows.map((r) => [...r, ""]),
      pager: o.pager,
      maxHeight: 520,
    });
  }

  /* Comercial venda / aluguel */
  function comercial(o) {
    const main = document.querySelector("main");
    const d = o.decimals ?? 2;
    main.innerHTML = toolbar(o) + `
      <div class="grid grid--3">
        <section class="card card--flush span-2">
          <div class="card__head"><div class="card__titles"><h2 class="card__title">${o.mapTitle}</h2><p class="card__subtitle">${o.mapSub}</p></div>
          <div class="card__aside"><span class="badge badge--secondary"><i data-lucide="map-pin"></i>${o.count} ${o.count === 1 ? "anúncio" : "anúncios"}</span></div></div>
          <div id="map" style="margin-top:16px;border-radius:0;flex:1"></div>
        </section>
        <div class="stack">
          ${card("t-area", "Ofertas por área", "Faixas de metragem · vm² médio da faixa")}
          ${card("t-valor", "Ofertas por valor", "Faixas de preço · vm² médio da faixa")}
        </div>
      </div>
      <section class="card card--flush">
        <div class="card__head"><div class="card__titles"><h2 class="card__title">Anúncios</h2><p class="card__subtitle">${o.listSub}</p></div>
        <div class="card__aside"><button class="btn btn--outline btn--sm" type="button"><i data-lucide="download"></i>Exportar CSV</button></div></div>
        <div id="t-list" style="margin-top:16px"></div>
      </section>`;
    LBI.shell(o.page);
    LBI.map("#map", { seed: o.seed || 5, height: 420, radius: true, slider: true, points: { n: o.count, spread: 110, r: 7 }, chip: "Somente anúncios georreferenciados aparecem no mapa", water: o.water });
    rangeTable("t-area", "Metragem", o.area, d);
    rangeTable("t-valor", "Valor", o.valor, d);
    LBI.table("#t-list", {
      columns: [{ label: "Título", title: true, sort: "descending" }, { label: "Valor", num: true, fmt: brlOrDec(2) }, { label: "Área (m²)", num: true }, { label: "vm²", num: true, fmt: brlOrDec(2) }, { label: "Link", link: true }],
      rows: o.rows.map((r) => [...r, ""]),
      pager: o.pager,
    });
  }

  /* Evolução do m² */
  function evolucao(o) {
    const main = document.querySelector("main");
    const first = o.values[0], last = o.values[o.values.length - 1];
    const dv = (last / first - 1) * 100;
    main.innerHTML = toolbar(o) + `
      <section class="card">
        <div class="card__head"><div class="card__titles"><h2 class="card__title">Evolução do vm²</h2><p class="card__subtitle">${o.sub}</p></div>
        <div class="card__aside"><span class="delta ${dv >= 0 ? "delta--up" : "delta--down"} delta--lg"><i data-lucide="${dv >= 0 ? "arrow-up" : "arrow-down"}"></i>${dv >= 0 ? "+" : ""}${fmt.pct(dv)} no período</span></div></div>
        <div id="c-main" class="chart"></div>
        <p class="footnote">Média trimestral do valor do m² anunciado. Amostras no raio de 1 km do imóvel. Linha reta entre trimestres (sem suavização, que inventa picos entre pontos).</p>
      </section>
      ${o.multiples ? `<h2 class="section-title"><i data-lucide="bed-double"></i>Por número de quartos<small>Mesma escala nos quatro gráficos</small></h2>
      <div class="grid grid--2" id="multiples"></div>` : ""}`;
    LBI.shell(o.page);
    LBI.line("#c-main", { labels: o.labels, values: o.values, fmt: (v) => fmt.brl0(v), tickFmt: (v) => fmt.int(v), valueName: "vm² médio", height: 320 });
    if (o.multiples) {
      const all = o.multiples.flatMap((m) => m.values);
      const dom = [Math.min(...all), Math.max(...all)];
      const box = document.getElementById("multiples");
      o.multiples.forEach((m, i) => {
        const dm = (m.values[m.values.length - 1] / m.values[0] - 1) * 100;
        box.insertAdjacentHTML("beforeend", `<section class="card">
          <div class="card__head"><div class="kpi kpi--plain"><span class="kpi__label"><i data-lucide="bed-double"></i>${m.name}</span><span class="kpi__value">${fmt.brl0(m.avg)}<small>/m² médio</small></span></div>
          <div class="card__aside"><span class="delta ${dm >= 0 ? "delta--up" : "delta--down"}"><i data-lucide="${dm >= 0 ? "arrow-up" : "arrow-down"}"></i>${dm >= 0 ? "+" : ""}${fmt.pct(dm)}</span></div></div>
          <div id="m${i}" class="chart"></div></section>`);
        LBI.line("#m" + i, { labels: o.labels, values: m.values, fmt: (v) => fmt.int(v), tickFmt: (v) => fmt.compact(v), valueName: "vm² médio", height: 200, domain: dom, labelMode: "last" });
      });
    }
  }

  window.LBI_MERCADO = { listing, comercial, evolucao, toolbar, card };
})();
