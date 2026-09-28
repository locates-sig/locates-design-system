/* Locates BI — shell, gráficos SVG, tabelas e mapa-placeholder.
   Sem dependências: carrega depois de icons.js (subconjunto do lucide). */
(function () {
  "use strict";

  /* ───────── Formatação pt-BR ───────── */
  const nf = (d = 0) => new Intl.NumberFormat("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt = {
    int: (v) => nf(0).format(v),
    dec: (v, d = 2) => nf(d).format(v),
    pct: (v, d = 1) => nf(d).format(v) + "%",
    brl: (v, d = 2) => "R$ " + nf(d).format(v),
    brl0: (v) => "R$ " + nf(0).format(v),
    m2: (v, d = 2) => nf(d).format(v) + " m²",
    compact: (v) => {
      const a = Math.abs(v);
      if (a >= 1e6) return nf(a >= 1e7 ? 1 : 2).format(v / 1e6).replace(/,0+$/, "") + " mi";
      if (a >= 1e3) return nf(a >= 1e4 ? 0 : 1).format(v / 1e3).replace(/,0$/, "") + " mil";
      return nf(0).format(v);
    },
  };
  const pickFmt = (f) => (typeof f === "function" ? f : fmt[f] || fmt.int);

  /* ───────── Utilidades ───────── */
  const SVGNS = "http://www.w3.org/2000/svg";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const color = (c) => (c && c.startsWith("--") ? css(c) : c);
  const $ = (sel, root = document) => (typeof sel === "string" ? root.querySelector(sel) : sel);

  function niceTicks(min, max, count = 4) {
    if (max === min) max = min + 1;
    const span = max - min;
    const step0 = span / count;
    const mag = Math.pow(10, Math.floor(Math.log10(step0)));
    const norm = step0 / mag;
    const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10) * mag;
    const lo = Math.floor(min / step) * step;
    const hi = Math.ceil(max / step) * step;
    const ticks = [];
    for (let v = lo; v <= hi + step / 2; v += step) ticks.push(+v.toFixed(10));
    return { lo, hi, ticks };
  }

  // Desenha e redesenha no resize (largura real do contêiner)
  function responsive(el, draw) {
    el = $(el);
    el.classList.add("chart");
    let last = 0;
    const run = () => {
      const w = Math.round(el.clientWidth);
      if (!w || w === last) return;
      last = w;
      draw(w);
    };
    run();
    if ("ResizeObserver" in window) new ResizeObserver(run).observe(el);
    return el;
  }

  function svgOpen(w, h, label) {
    return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(label || "")}">`;
  }

  /* ───────── Tooltip ───────── */
  let tipEl;
  function tip() {
    if (!tipEl) {
      tipEl = document.createElement("div");
      tipEl.className = "tooltip";
      tipEl.setAttribute("role", "status");
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function showTip(evt, title, rows) {
    const t = tip();
    t.innerHTML =
      (title ? `<div class="tooltip__title">${esc(title)}</div>` : "") +
      rows.map((r) => `<div class="tooltip__row">${r.color ? `<span class="swatch" style="background:${r.color}"></span>` : ""}${esc(r.label)}<b>${esc(r.value)}</b></div>`).join("");
    t.classList.add("is-on");
    const pad = 14;
    const { innerWidth: W, innerHeight: H } = window;
    const r = t.getBoundingClientRect();
    let x = evt.clientX + pad, y = evt.clientY + pad;
    if (x + r.width > W - 8) x = evt.clientX - r.width - pad;
    if (y + r.height > H - 8) y = evt.clientY - r.height - pad;
    t.style.left = x + "px";
    t.style.top = y + "px";
  }
  function hideTip() { tip().classList.remove("is-on"); }

  // Liga hover em elementos com data-tip='{"t":..,"r":[..]}'
  function bindTips(root) {
    root.querySelectorAll("[data-tip]").forEach((n) => {
      const d = JSON.parse(n.getAttribute("data-tip"));
      n.addEventListener("mousemove", (e) => {
        showTip(e, d.t, d.r);
        if (d.g) root.querySelectorAll(".mark").forEach((m) => m.classList.toggle("is-dim", m.getAttribute("data-g") !== d.g));
      });
      n.addEventListener("mouseleave", () => {
        hideTip();
        root.querySelectorAll(".mark.is-dim").forEach((m) => m.classList.remove("is-dim"));
      });
    });
  }
  const tipAttr = (t, rows, g) => `data-tip='${JSON.stringify({ t, r: rows, g }).replace(/'/g, "&#39;")}'`;

  /* ───────── Colunas (uma série) ───────── */
  function columns(el, o) {
    el = $(el);
    const f = pickFmt(o.fmt);
    const data = o.data;
    const labelAll = o.labelAll ?? data.length <= 12;
    return responsive(el, (W) => {
      const H = o.height || 200;
      const m = { t: 22, r: 8, b: o.xTitle ? 40 : 26, l: labelAll ? 8 : 44 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const max = Math.max(...data.map((d) => d[1]), 0);
      const { hi, ticks } = niceTicks(0, max || 1, 4);
      const y = (v) => m.t + ih - (v / hi) * ih;
      const band = iw / data.length;
      const bw = Math.min(o.barMax || 24, band * 0.6);
      const every = Math.max(1, Math.ceil(data.length / Math.max(1, Math.floor(iw / 44))));
      const col = color(o.color || "--chart-1");
      let s = svgOpen(W, H, o.label);
      if (!labelAll) {
        ticks.forEach((t) => { s += `<line class="grid-line" x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}"/><text class="tick" x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${esc(f(t))}</text>`; });
      }
      data.forEach(([lab, v], i) => {
        const cx = m.l + band * i + band / 2;
        const h = Math.max(ih * (v / hi), v > 0 ? 2 : 0);
        const x0 = cx - bw / 2, y0 = m.t + ih - h, r = Math.min(4, h / 2, bw / 2);
        if (h > 0) s += `<path class="mark" data-g="${i}" fill="${col}" d="M${x0},${y0 + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${y0 + h}Z"/>`;
        if (labelAll) s += `<text class="dlabel${v === 0 ? " dlabel--muted" : ""}" x="${cx}" y="${y0 - 6}" text-anchor="middle">${esc(f(v))}</text>`;
        if (i % every === 0) s += `<text class="tick" x="${cx}" y="${m.t + ih + 16}" text-anchor="middle">${esc(lab)}</text>`;
        s += `<rect class="hit" x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" ${tipAttr(`${o.xName || ""} ${lab}`.trim(), [{ label: o.valueName || "Valor", value: f(v), color: col }], String(i))}/>`;
      });
      s += `<line class="baseline" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/>`;
      if (o.xTitle) s += `<text class="axis-title" x="${m.l + iw / 2}" y="${H - 4}" text-anchor="middle">${esc(o.xTitle)}</text>`;
      s += "</svg>";
      el.innerHTML = s;
      bindTips(el);
    });
  }

  /* ───────── Linha (tempo) ───────── */
  function line(el, o) {
    el = $(el);
    const f = pickFmt(o.fmt);
    const tf = pickFmt(o.tickFmt || o.fmt);
    const vals = o.values, labs = o.labels;
    return responsive(el, (W) => {
      const H = o.height || 240;
      const m = { t: 24, r: 20, b: 30, l: 56 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const nn = vals.filter((v) => v != null);
      const lo0 = o.domain ? o.domain[0] : Math.min(...nn), hi0 = o.domain ? o.domain[1] : Math.max(...nn);
      const pad = (hi0 - lo0) * 0.12;
      const { lo, hi, ticks } = niceTicks(o.zero ? 0 : lo0 - pad, hi0 + pad, 4);
      const x = (i) => m.l + (vals.length === 1 ? iw / 2 : (i / (vals.length - 1)) * iw);
      const y = (v) => m.t + ih - ((v - lo) / (hi - lo)) * ih;
      const col = color(o.color || "--chart-1");
      let s = svgOpen(W, H, o.label);
      ticks.forEach((t) => { s += `<line class="grid-line" x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}"/><text class="tick" x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${esc(tf(t))}</text>`; });
      // rótulos do eixo x: no máx. ~8
      const every = Math.max(1, Math.ceil(labs.length / Math.max(2, Math.floor(iw / 90))));
      labs.forEach((l, i) => { if ((i % every === 0 && labs.length - 1 - i >= every) || i === labs.length - 1) s += `<text class="tick" x="${x(i)}" y="${H - 8}" text-anchor="${i === 0 ? "start" : i === labs.length - 1 ? "end" : "middle"}">${esc(l)}</text>`; });
      const pts = vals.map((v, i) => (v == null ? null : [x(i), y(v)]));
      // um trecho por sequência contínua; mês sem dado vira lacuna (linha tracejada cinza liga as pontas)
      const runs = [];
      pts.forEach((p, i) => { if (!p) return; if (i && pts[i - 1]) runs[runs.length - 1].push(p); else runs.push([p]); });
      const path = (r) => r.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join("");
      for (let k = 1; k < runs.length; k++) { const a = runs[k - 1][runs[k - 1].length - 1], b = runs[k][0]; s += `<path d="M${a[0]},${a[1]}L${b[0]},${b[1]}" stroke="${css("--color-gray-300")}" stroke-width="1.5" stroke-dasharray="3 4" fill="none"/>`; }
      runs.forEach((r) => {
        if (o.area !== false) s += `<path d="${path(r)}L${r[r.length - 1][0]},${m.t + ih}L${r[0][0]},${m.t + ih}Z" fill="${col}" opacity=".08"/>`;
        s += `<path d="${path(r)}" fill="none" stroke="${col}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
        if (r.length === 1) s += `<circle cx="${r[0][0]}" cy="${r[0][1]}" r="3" fill="${col}"/>`;
      });
      // rótulos seletivos: primeiro, último, máximo e mínimo
      const iFirst = vals.findIndex((v) => v != null), iLast = vals.length - 1 - [...vals].reverse().findIndex((v) => v != null);
      const iMax = vals.indexOf(Math.max(...nn)), iMin = vals.indexOf(Math.min(...nn));
      const keep = new Set(o.labelMode === "last" ? [iLast] : [iFirst, iLast, iMax, iMin]);
      pts.forEach((p, i) => {
        if (!p || !keep.has(i)) return;
        s += `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="${col}" stroke="#fff" stroke-width="2"/>`;
        const below = i === iMin && i !== iMax && i !== iLast && i !== iFirst;
        const anchor = i === 0 ? "start" : i === vals.length - 1 ? "end" : "middle";
        s += `<text class="dlabel" x="${p[0]}" y="${below ? p[1] + 18 : p[1] - 10}" text-anchor="${anchor}">${esc(f(vals[i]))}</text>`;
      });
      s += `<line class="baseline" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/>`;
      s += `<line class="crosshair" x1="0" x2="0" y1="${m.t}" y2="${m.t + ih}" style="display:none"/><circle class="cross-dot" r="5" fill="${col}" stroke="#fff" stroke-width="2" style="display:none;pointer-events:none"/>`;
      s += `<rect class="hit" x="${m.l}" y="${m.t}" width="${iw}" height="${ih}"/>`;
      s += "</svg>";
      el.innerHTML = s;
      const svg = el.querySelector("svg"), hit = el.querySelector(".hit"), ch = el.querySelector(".crosshair"), dot = el.querySelector(".cross-dot");
      hit.addEventListener("mousemove", (e) => {
        const r = svg.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W;
        const i = Math.max(0, Math.min(vals.length - 1, Math.round(((px - m.l) / iw) * (vals.length - 1))));
        ch.setAttribute("x1", x(i)); ch.setAttribute("x2", x(i)); ch.style.display = "";
        if (vals[i] == null) { dot.style.display = "none"; showTip(e, labs[i], [{ label: o.valueName || "Valor", value: "sem dados" }]); return; }
        dot.setAttribute("cx", x(i)); dot.setAttribute("cy", y(vals[i])); dot.style.display = "";
        const rows = [{ label: o.valueName || "Valor", value: f(vals[i]), color: col }];
        if (i > 0 && vals[i - 1] != null) { const dv = (vals[i] / vals[i - 1] - 1) * 100; rows.push({ label: "vs. anterior", value: (dv >= 0 ? "+" : "") + fmt.pct(dv) }); }
        showTip(e, labs[i], rows);
      });
      hit.addEventListener("mouseleave", () => { ch.style.display = "none"; dot.style.display = "none"; hideTip(); });
    });
  }

  /* ───────── Colunas agrupadas (2+ séries) ───────── */
  function grouped(el, o) {
    el = $(el);
    const f = pickFmt(o.fmt);
    const lf = pickFmt(o.labelFmt || o.fmt);
    return responsive(el, (W) => {
      const H = o.height || 260;
      const m = { t: 22, r: 8, b: 28, l: 52 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const max = Math.max(...o.series.flatMap((s) => s.values));
      const { hi, ticks } = niceTicks(0, max, 4);
      const y = (v) => m.t + ih - (v / hi) * ih;
      const band = iw / o.categories.length;
      const n = o.series.length;
      const bw = Math.min(24, (band * 0.7 - (n - 1) * 2) / n);
      let s = svgOpen(W, H, o.label);
      ticks.forEach((t) => { s += `<line class="grid-line" x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}"/><text class="tick" x="${m.l - 8}" y="${y(t) + 4}" text-anchor="end">${esc(pickFmt(o.tickFmt || o.fmt)(t))}</text>`; });
      o.categories.forEach((c, ci) => {
        const cx = m.l + band * ci + band / 2;
        const gw = n * bw + (n - 1) * 2;
        o.series.forEach((se, si) => {
          const v = se.values[ci];
          const x0 = cx - gw / 2 + si * (bw + 2);
          const h = Math.max(ih * (v / hi), 2), y0 = m.t + ih - h, r = Math.min(4, h / 2);
          s += `<path class="mark" data-g="${ci}" fill="${color(se.color)}" d="M${x0},${y0 + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${y0 + h}Z"/>`;
          if (o.labels !== false) s += `<text class="dlabel" x="${x0 + bw / 2}" y="${y0 - 6}" text-anchor="middle" style="font-size:10px">${esc(lf(v))}</text>`;
        });
        s += `<text class="tick" x="${cx}" y="${m.t + ih + 16}" text-anchor="middle">${esc(c)}</text>`;
        s += `<rect class="hit" x="${m.l + band * ci}" y="${m.t}" width="${band}" height="${ih}" ${tipAttr(c, o.series.map((se) => ({ label: se.name, value: f(se.values[ci]), color: color(se.color) })), String(ci))}/>`;
      });
      s += `<line class="baseline" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/></svg>`;
      el.innerHTML = s;
      bindTips(el);
    });
  }

  /* ───────── Pirâmide etária ───────── */
  function pyramid(el, o) {
    el = $(el);
    const f = pickFmt(o.fmt);
    return responsive(el, (W) => {
      const rowH = 22, gap = 4, labW = 56, valW = 40;
      const H = o.rows.length * (rowH + gap) + 24;
      const half = (W - labW) / 2;
      const max = Math.max(...o.rows.flatMap((r) => [r[1], r[2]]));
      const sc = (v) => (v / max) * (half - valW);
      const lc = color(o.left.color), rc = color(o.right.color);
      let s = svgOpen(W, H, o.label);
      s += `<text class="center-label" x="${half - 4}" y="12" text-anchor="end">${esc(o.left.name)}</text><text class="center-label" x="${half + labW + 4}" y="12">${esc(o.right.name)}</text>`;
      o.rows.forEach(([lab, l, r], i) => {
        const y0 = 24 + i * (rowH + gap);
        const wl = sc(l), wr = sc(r), xr = half + labW;
        s += `<path class="mark" data-g="${i}" fill="${lc}" d="M${half},${y0}V${y0 + rowH}H${half - wl + 4}Q${half - wl},${y0 + rowH} ${half - wl},${y0 + rowH - 4}V${y0 + 4}Q${half - wl},${y0} ${half - wl + 4},${y0}Z"/>`;
        s += `<path class="mark" data-g="${i}" fill="${rc}" d="M${xr},${y0}V${y0 + rowH}H${xr + wr - 4}Q${xr + wr},${y0 + rowH} ${xr + wr},${y0 + rowH - 4}V${y0 + 4}Q${xr + wr},${y0} ${xr + wr - 4},${y0}Z"/>`;
        s += `<text class="dlabel dlabel--muted" x="${half - wl - 6}" y="${y0 + 15}" text-anchor="end">${esc(f(l))}</text>`;
        s += `<text class="dlabel dlabel--muted" x="${xr + wr + 6}" y="${y0 + 15}">${esc(f(r))}</text>`;
        s += `<text class="dlabel" x="${half + labW / 2}" y="${y0 + 15}" text-anchor="middle">${esc(lab)}</text>`;
        s += `<rect class="hit" x="0" y="${y0 - 2}" width="${W}" height="${rowH + gap}" ${tipAttr(lab + " anos", [{ label: o.left.name, value: f(l), color: lc }, { label: o.right.name, value: f(r), color: rc }], String(i))}/>`;
      });
      s += "</svg>";
      el.innerHTML = s;
      bindTips(el);
    });
  }

  /* ───────── Rosca + legenda com valores ───────── */
  function donut(el, o) {
    el = $(el);
    const f = pickFmt(o.fmt);
    const items = o.items;
    const total = items.reduce((a, b) => a + b.value, 0);
    const R = 90, r = 62, C = 100;
    let s = svgOpen(200, 200, o.label).replace('width="200" height="200"', "");
    let a0 = -Math.PI / 2;
    const gapA = items.length > 1 ? 2 / R : 0; // 2px de respiro entre fatias
    items.forEach((it, i) => {
      const frac = it.value / total;
      if (frac <= 0) return;
      const a1 = a0 + frac * Math.PI * 2;
      const s0 = a0 + gapA / 2, s1 = Math.max(s0 + 0.001, a1 - gapA / 2);
      const large = s1 - s0 > Math.PI ? 1 : 0;
      const p = (rad, ang) => [C + rad * Math.cos(ang), C + rad * Math.sin(ang)].map((n) => n.toFixed(2)).join(",");
      const d = frac >= 0.9999
        ? `M${C},${C - R}A${R},${R} 0 1 1 ${C - 0.01},${C - R}L${C - 0.01},${C - r}A${r},${r} 0 1 0 ${C},${C - r}Z`
        : `M${p(R, s0)}A${R},${R} 0 ${large} 1 ${p(R, s1)}L${p(r, s1)}A${r},${r} 0 ${large} 0 ${p(r, s0)}Z`;
      const col = color(it.color);
      s += `<path class="mark" data-g="${i}" fill="${col}" d="${d}" ${tipAttr(it.label, [{ label: o.valueName || "Valor", value: f(it.value), color: col }, { label: "Participação", value: fmt.pct((it.value / total) * 100) }], String(i))}/>`;
      a0 = a1;
    });
    const cv = o.center ? o.center.value : f(total);
    const cl = o.center ? o.center.label : "Total";
    s += `<text class="center-value" x="${C}" y="${C + 4}" text-anchor="middle">${esc(cv)}</text><text class="center-label" x="${C}" y="${C + 22}" text-anchor="middle">${esc(cl)}</text></svg>`;
    const legend = `<ul class="legend legend--col">${items.map((it) => `<li><span class="swatch" style="background:${color(it.color)}"></span><span>${esc(it.label)}</span><b>${esc(o.showValue === false ? "" : f(it.value))}</b><span class="muted">${fmt.pct((it.value / total) * 100)}</span></li>`).join("")}</ul>`;
    el.classList.add("donut-wrap");
    el.innerHTML = `<div class="chart">${s}</div>${legend}`;
    bindTips(el);
    return el;
  }

  /* ───────── Barra 100% empilhada ───────── */
  function stackbar(el, o) {
    el = $(el);
    const total = o.items.reduce((a, b) => a + b.value, 0);
    const f = pickFmt(o.fmt || ((v) => fmt.pct((v / total) * 100)));
    el.innerHTML =
      `<div class="stackbar" role="img" aria-label="${esc(o.label || "")}">` +
      o.items.map((it, i) => {
        const w = (it.value / total) * 100;
        const light = it.ink === "dark";
        return `<div class="stackbar__seg mark" data-g="${i}" style="width:${w}%;background:${color(it.color)};${light ? "color:var(--foreground)" : ""}" ${tipAttr(it.label, [{ label: "Participação", value: f(it.value), color: color(it.color) }], String(i))}>${w >= 14 ? esc(f(it.value)) : ""}</div>`;
      }).join("") +
      `</div><ul class="legend" style="margin-top:10px">${o.items.map((it) => `<li><span class="swatch" style="background:${color(it.color)}"></span>${esc(it.label)} <b>${esc(f(it.value))}</b></li>`).join("")}</ul>`;
    bindTips(el);
    return el;
  }

  /* ───────── Lista de barras (HTML) ───────── */
  function bars(el, o) {
    el = $(el);
    const f = pickFmt(o.fmt || "pct");
    const max = o.max ?? Math.max(...o.rows.map((r) => r.value));
    el.classList.add("bars");
    if (o.inline) el.classList.add("bars--inline");
    el.innerHTML = o.rows.map((r) => {
      const w = max ? (r.value / max) * 100 : 0;
      const zero = r.value === 0;
      return `<li class="bars__row${zero ? " bars__row--zero" : ""}"><span class="bars__label">${r.icon ? `<i data-lucide="${r.icon}"></i>` : ""}<span>${esc(r.label)}</span></span><span class="bars__track"><span class="bars__fill" style="display:block;width:${w}%;${r.color || o.color ? `background:${color(r.color || o.color)}` : ""}"></span></span><span class="bars__value">${esc(f(r.value))}</span></li>`;
    }).join("");
    return el;
  }

  /* ───────── Tabela ───────── */
  // Escala sequencial (um matiz): lilás claro → roxo primário
  function heatStyle(t) {
    const p = Math.round(8 + t * 72);
    return `background:color-mix(in oklab, var(--primary) ${p}%, #fff);color:${t > 0.5 ? "#fff" : "var(--foreground)"}`;
  }
  function table(el, o) {
    el = $(el);
    const cols = o.columns;
    const ranges = cols.map((c, i) => {
      if (!c.heat && !c.bar) return null;
      const vs = o.rows.map((r) => r[i]);
      return [Math.min(...vs), Math.max(...vs)];
    });
    const head = `<thead><tr>${cols.map((c) => `<th class="${c.num ? "num" : ""}"${c.sort ? ' aria-sort="' + c.sort + '"' : ""}>${esc(c.label)}${c.sort ? ` <i data-lucide="${c.sort === "descending" ? "arrow-down" : "arrow-up"}"></i>` : ""}</th>`).join("")}</tr></thead>`;
    const cell = (c, v, i) => {
      const f = c.fmt ? pickFmt(c.fmt) : (x) => x;
      if (c.link) return `<td><a href="#" onclick="return false"><span>${esc(c.link === true ? "Ver anúncio" : c.link)}</span><i data-lucide="external-link"></i></a></td>`;
      if (c.heat) {
        const [lo, hi] = ranges[i];
        const t = hi === lo ? 1 : (v - lo) / (hi - lo);
        return `<td class="num"><span class="heat" style="${heatStyle(t)}">${esc(f(v))}</span></td>`;
      }
      if (c.bar) {
        const w = ranges[i][1] ? (v / ranges[i][1]) * 100 : 0;
        return `<td class="num"><span class="inbar"><span class="inbar__bar"><i style="width:${w}%"></i></span><b>${esc(f(v))}</b></span></td>`;
      }
      return `<td class="${c.num ? "num" : ""}${c.title ? " title" : ""}"${c.title ? ` title="${esc(v)}"` : ""}>${esc(f(v))}</td>`;
    };
    const body = `<tbody>${o.rows.map((r) => `<tr>${cols.map((c, i) => cell(c, r[i], i)).join("")}</tr>`).join("")}</tbody>`;
    const foot = o.foot ? `<tfoot><tr>${o.foot.map((v, i) => `<td class="${cols[i] && cols[i].num ? "num" : ""}">${esc(v ?? "")}</td>`).join("")}</tr></tfoot>` : "";
    const pager = o.pager ? `<div class="pager"><span>${esc(o.pager)}</span><button class="btn btn--outline icon-btn" aria-label="Página anterior"><i data-lucide="chevron-left"></i></button><button class="btn btn--outline icon-btn" aria-label="Próxima página"><i data-lucide="chevron-right"></i></button></div>` : "";
    el.innerHTML = `<div class="table-wrap" style="${o.maxHeight ? `max-height:${o.maxHeight}px` : ""}"><table class="tbl">${head}${body}${foot}</table></div>${pager}`;
    return el;
  }

  /* ───────── Mapa (placeholder do Google Maps com a moldura do DS) ───────── */
  function rng(seed) {
    let a = seed >>> 0 || 1;
    return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r()); }

  function mapSvg(o) {
    const r = rng(o.seed || 7);
    const W = 1000, H = 640, cx = o.cx || 520, cy = o.cy || 320;
    const sat = o.style === "satellite";
    const P = sat
      ? { land: "#3d4a38", park: "#26361f", water: "#1f3b52", road: "#8d8e86", edge: "#56594f", hw: "#b9ab86", block: "#6b6f66" }
      : { land: css("--map-land"), park: css("--map-park"), water: css("--map-water"), road: css("--map-road"), edge: css("--map-road-edge"), hw: css("--map-highway"), block: css("--map-block") };
    let s = `<svg class="map__canvas" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="${W}" height="${H}" fill="${P.land}"/>`;
    // parques / mata
    const parks = o.parks ?? 4;
    for (let i = 0; i < parks; i++) {
      const px = r() * W, py = r() * H, rx = 80 + r() * 180, ry = 60 + r() * 140;
      s += `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}" fill="${P.park}" transform="rotate(${r() * 60 - 30} ${px} ${py})"/>`;
    }
    if (sat) s += `<ellipse cx="${W * 0.78}" cy="${H * 0.45}" rx="330" ry="360" fill="${P.park}"/>`;
    // água
    if (o.water === "right") s += `<path d="M${W * 0.82},0 C${W * 0.74},${H * 0.3} ${W * 0.9},${H * 0.55} ${W * 0.8},${H} L${W},${H} L${W},0Z" fill="${P.water}"/>`;
    if (o.water === "bay") s += `<path d="M0,${H * 0.1} C${W * 0.25},${H * 0.05} ${W * 0.3},${H * 0.45} ${W * 0.18},${H * 0.62} C${W * 0.1},${H * 0.75} ${W * 0.22},${H} ${W * 0.3},${H} L0,${H}Z" fill="${P.water}"/><path d="M${W * 0.68},0 C${W * 0.6},${H * 0.25} ${W * 0.75},${H * 0.4} ${W * 0.7},${H * 0.62} C${W * 0.66},${H * 0.8} ${W * 0.78},${H} ${W * 0.8},${H} L${W},${H} L${W},0Z" fill="${P.water}"/>`;
    // malha viária (grade girada)
    const ang = -18 + r() * 10;
    s += `<g transform="rotate(${ang} ${cx} ${cy})">`;
    let roads = "";
    for (let x = -400; x < W + 400; x += 46 + r() * 30) roads += `M${x.toFixed(0)},-400V${H + 400}`;
    for (let y = -400; y < H + 400; y += 40 + r() * 34) roads += `M-400,${y.toFixed(0)}H${W + 400}`;
    s += `<path d="${roads}" stroke="${P.edge}" stroke-width="${sat ? 3 : 7}" fill="none"/>`;
    if (!sat) s += `<path d="${roads}" stroke="${P.road}" stroke-width="5" fill="none"/>`;
    else {
      for (let i = 0; i < 260; i++) s += `<rect x="${(r() * (W + 600) - 300).toFixed(0)}" y="${(r() * (H + 600) - 300).toFixed(0)}" width="${6 + r() * 14}" height="${6 + r() * 12}" fill="${P.block}" opacity=".55"/>`;
    }
    s += "</g>";
    // via principal
    const hw = `M${-20},${H * (0.1 + r() * 0.2)} C${W * 0.3},${H * 0.25} ${W * 0.45},${H * 0.55} ${W * 0.62},${H * 0.72} S${W * 0.9},${H * 0.85} ${W + 20},${H * (0.8 + r() * 0.1)}`;
    s += `<path d="${hw}" stroke="${sat ? "#6f6751" : "#b4b8c2"}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="${hw}" stroke="${P.hw}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
    // setores censitários / manchas
    if (o.sectors) {
      const sc = o.sectors;
      for (let i = 0; i < (sc.n || 12); i++) {
        const sx = cx + gauss(r) * (sc.spread || 150), sy = cy + gauss(r) * (sc.spread || 150) * 0.8, sr = 50 + r() * 70;
        const fill = sc.colors ? color(sc.colors[Math.floor(r() * sc.colors.length)]) : css("--color-brand-primary-light");
        s += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${fill}" fill-opacity="${sc.opacity || 0.45}"/>`;
      }
    }
    if (o.heat) {
      s += `<defs><radialGradient id="hg${o.seed}"><stop offset="0" stop-color="${css("--color-brand-primary")}" stop-opacity=".75"/><stop offset=".55" stop-color="${css("--color-brand-primary-light")}" stop-opacity=".45"/><stop offset="1" stop-color="${css("--color-brand-primary-light")}" stop-opacity="0"/></radialGradient></defs>`;
      o.heat.forEach(([hx, hy, hr]) => { s += `<circle cx="${hx}" cy="${hy}" r="${hr}" fill="url(#hg${o.seed})"/>`; });
    }
    // raio de 1 km
    if (o.radius) s += `<circle cx="${cx}" cy="${cy}" r="${o.radius === true ? 250 : o.radius}" fill="${css("--color-brand-primary")}" fill-opacity=".05" stroke="${css("--color-brand-primary")}" stroke-width="1.5"/>`;
    // lote (resumo)
    if (o.parcel) s += `<path d="M${cx - 150},${cy - 70} L${cx - 120},${cy - 90} L${cx + 160},${cy + 40} L${cx + 150},${cy + 70} Z" fill="${css("--color-brand-primary")}" fill-opacity=".28" stroke="#fff" stroke-width="3"/>`;
    // pontos
    if (o.points) {
      const pts = o.points;
      const cols = (pts.colors || ["--chart-1"]).map(color);
      const wts = pts.weights || cols.map(() => 1);
      const tw = wts.reduce((a, b) => a + b, 0);
      for (let i = 0; i < pts.n; i++) {
        let k = r() * tw, ci = 0;
        while (k > wts[ci]) { k -= wts[ci]; ci++; }
        const px = cx + gauss(r) * (pts.sx || pts.spread || 120), py = cy + gauss(r) * (pts.sy || (pts.spread || 120) * 0.7);
        s += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${pts.r || 6}" fill="${cols[ci]}" stroke="#fff" stroke-width="2"/>`;
      }
    }
    // imóvel analisado
    if (o.pin !== false) s += `<g transform="translate(${cx} ${cy})"><circle r="13" fill="#fff" opacity=".9"/><circle r="10" fill="${css("--color-brand-primary")}"/><circle r="3.5" fill="#fff"/></g>`;
    return s + "</svg>";
  }

  function map(el, o = {}) {
    el = $(el);
    el.classList.add("map");
    if (o.height) el.style.height = o.height + "px";
    let h = mapSvg(o);
    if (o.controls !== false) {
      h += `<div class="map__layer map__layer--tl"><div class="seg seg--sm"><button class="seg__item" aria-pressed="${o.style === "satellite" ? "false" : "true"}">Mapa</button><button class="seg__item" aria-pressed="${o.style === "satellite" ? "true" : "false"}">Satélite</button></div></div>`;
      h += `<div class="map__layer map__layer--tr"><div class="map-ctrl"><button aria-label="Tela cheia"><i data-lucide="maximize-2"></i></button></div></div>`;
      h += `<div class="map__layer map__layer--br"><div class="map-ctrl"><button aria-label="Aproximar"><i data-lucide="plus"></i></button><button aria-label="Afastar"><i data-lucide="minus"></i></button></div></div>`;
    }
    if (o.slider) h += `<div class="map__layer map__layer--tc"><div class="map-panel">${rangeHtml({ label: "Distância", unit: " m", min: 0, max: 1000, lo: 0, hi: 1000 })}</div></div>`;
    if (o.label) h += `<div class="map__layer map__layer--${o.controls === false ? "tl" : "tc"}"><span class="map-label"><i data-lucide="map-pin"></i>${esc(o.label)}</span></div>`;
    if (o.chip) h += `<div class="map__layer map__layer--bc"><span class="map-chip"><i data-lucide="info"></i>${esc(o.chip)}</span></div>`;
    if (o.legend) h += `<div class="map__layer map__layer--bl"><div class="map-legend">${o.legend}</div></div>`;
    el.innerHTML = h;
    return el;
  }

  /* ───────── Controles ───────── */
  function rangeHtml(o) {
    const span = o.max - o.min;
    const a = ((o.lo - o.min) / span) * 100, b = ((o.hi - o.min) / span) * 100;
    const f = pickFmt(o.fmt || "int");
    return `<div class="range"><div class="range__head"><span class="range__label">${esc(o.label)}</span><span class="range__vals">${esc(f(o.lo))} – ${esc(f(o.hi))}${esc(o.unit || "")}</span></div><div class="range__track" role="slider" aria-label="${esc(o.label)}" aria-valuemin="${o.min}" aria-valuemax="${o.max}"><span class="range__fill" style="left:${a}%;right:${100 - b}%"></span><span class="range__thumb" style="left:${a}%"></span><span class="range__thumb" style="left:${b}%"></span></div></div>`;
  }
  function range(el, o) { el = $(el); el.outerHTML = rangeHtml(o); }

  /* ───────── Shell: cabeçalho, abas, subnavegação, rodapé ───────── */
  const NAV = [
    { id: "resumo", label: "Resumo executivo", icon: "layout-dashboard", href: "resumo.html" },
    { id: "mercado", label: "Mercado imobiliário", icon: "building-2", href: "mercado-residencial-venda.html", subs: [
      { id: "residencial", label: "Residencial", href: "mercado-residencial-venda.html", modes: [
        { id: "venda", label: "Venda", href: "mercado-residencial-venda.html" },
        { id: "shortstay", label: "Shortstay", href: "mercado-residencial-shortstay.html" },
        { id: "longstay", label: "Longstay", href: "mercado-residencial-longstay.html" },
        { id: "lancamentos", label: "Lançamentos", href: "mercado-residencial-lancamentos.html" },
        { id: "evolucao", label: "Evolução", href: "mercado-residencial-evolucao.html" } ] },
      { id: "comercial", label: "Comercial", href: "mercado-comercial-venda.html", modes: [
        { id: "venda", label: "Venda", href: "mercado-comercial-venda.html" },
        { id: "aluguel", label: "Aluguel", href: "mercado-comercial-aluguel.html" },
        { id: "evolucao", label: "Evolução", href: "mercado-comercial-evolucao.html" } ] },
      { id: "obras", label: "Obras", href: "mercado-obras.html" } ] },
    { id: "demografico", label: "Demográfico", icon: "users", href: "demografia-2022.html", subs: [
      { id: "2022", label: "Demografia 2022", href: "demografia-2022.html" },
      { id: "2010-2022", label: "Demografia 2010 × 2022", href: "demografia-2010-2022.html" } ] },
    { id: "socioeconomico", label: "Socioeconômico", icon: "wallet", href: "socioeconomia-2022.html", subs: [
      { id: "2022", label: "Socioeconomia 2022", href: "socioeconomia-2022.html" },
      { id: "2010", label: "Socioeconomia 2010", href: "socioeconomia-2010.html" } ] },
    { id: "pois", label: "Pontos de interesse", icon: "map-pin", href: "pois-comercio.html", subs: [
      { id: "comercio", label: "Comércio e serviços", href: "pois-comercio.html" },
      { id: "pgt", label: "Polos de tráfego", href: "pois-pgt.html" } ] },
    { id: "empresas", label: "Empresas", icon: "briefcase", href: "#", disabled: true },
    { id: "equipamentos", label: "Equipamentos urbanos", icon: "landmark", href: "equipamentos-urbanos.html" },
  ];

  function shell(page) {
    const logo = "../../assets/Logos/logo.svg";
    const nav = page.nav || NAV;
    const ctx = page.context || { eyebrow: "Estudo de área · raio de 1 km", title: "6523 · Itacorubi, Florianópolis-SC" };
    const header = document.createElement("header");
    header.className = "bi-header";
    header.innerHTML = `
      <div class="bi-header__bar">
        <a href="index.html" aria-label="Índice das telas"><img class="bi-header__logo" src="${logo}" alt="Locates"></a>
        <span class="bi-header__divider"></span>
        <div class="bi-header__context">
          <span class="bi-header__eyebrow">${esc(ctx.eyebrow)}</span>
          <span class="bi-header__title">${esc(ctx.title)}</span>
        </div>
        <div class="bi-header__actions">
          <button class="btn btn--outline" type="button"><i data-lucide="filter-x"></i>Limpar filtros</button>
        </div>
      </div>
      <nav class="bi-tabs" aria-label="Seções do relatório">${nav.map((s) => `<a class="bi-tab" href="${s.href}"${s.id === page.section ? ' aria-current="page"' : ""}${s.disabled ? ' aria-disabled="true" title="Sem tela de referência"' : ""}><i data-lucide="${s.icon}"></i>${esc(s.label)}</a>`).join("")}</nav>`;
    document.body.prepend(header);

    const sec = nav.find((s) => s.id === page.section);
    document.querySelectorAll("[data-subnav]").forEach((slot) => {
      if (!sec || !sec.subs) { slot.remove(); return; }
      let h = `<nav class="pill-tabs" aria-label="${esc(sec.label)}">${sec.subs.map((s) => `<a class="pill-tab" href="${s.href}"${s.id === page.sub ? ' aria-current="page"' : ""}>${esc(s.label)}</a>`).join("")}</nav>`;
      const sub = sec.subs.find((s) => s.id === page.sub);
      if (sub && sub.modes) h += `<nav class="seg" aria-label="${esc(sub.label)}">${sub.modes.map((m) => `<a class="seg__item" href="${m.href}"${m.id === page.mode ? ' aria-current="page"' : ""}>${esc(m.label)}</a>`).join("")}</nav>`;
      slot.outerHTML = h;
    });

    const footer = document.createElement("footer");
    footer.className = "bi-footer";
    footer.innerHTML = `<div class="bi-footer__bar">
        <img class="bi-footer__logo" src="${logo}" alt="Locates">
        <span>(48) 98816-5403</span>
        <a href="https://www.locates.com.br">www.locates.com.br</a>
        <span class="bi-footer__right">Versão do relatório 1.1 · Dados atualizados em ${esc(page.updated || "28/09/2026")}<br>© 2026 Locates. Todos os direitos reservados.</span>
      </div>`;
    document.body.append(footer);
  }

  /* ───────── Ícones (subconjunto lucide em icons.js) ───────── */
  function icons(root = document) {
    const lib = window.LUCIDE || {};
    root.querySelectorAll("i[data-lucide]").forEach((i) => {
      const name = i.getAttribute("data-lucide");
      const body = lib[name];
      if (!body) { console.warn("ícone ausente:", name); return; }
      const cls = "lucide lucide-" + name + (i.className ? " " + i.className : "");
      i.outerHTML = `<svg class="${cls}" xmlns="${SVGNS}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
    });
  }

  // Ícones inseridos depois (gráficos redesenhados no resize) também são trocados
  if ("MutationObserver" in window) {
    new MutationObserver((ms) => { if (ms.some((m) => m.addedNodes.length)) icons(); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }

  window.LBI = { fmt, shell, columns, line, grouped, pyramid, donut, stackbar, bars, table, map, range, rangeHtml, icons, color, NAV };
})();
