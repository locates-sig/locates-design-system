/* Locates BI — componentes do tema moderno (window.LK)
   Sem dependências; carregar depois de icons.js. Cada tela monta o mesmo layout da captura original. */
(function () {
  "use strict";

  /* ───────── Formatação pt-BR ───────── */
  const nf = (d) => new Intl.NumberFormat("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmt = {
    int: (v) => nf(0).format(v),
    dec: (v, d = 2) => nf(d).format(v),
    brl: (v, d = 2) => "R$ " + nf(d).format(v),
    pct: (v, d = 1) => nf(d).format(v) + "%",
    mil: (v) => (Math.abs(v) >= 1000 ? nf(Math.abs(v) >= 10000 ? 0 : 1).format(v / 1000).replace(/,0$/, "") + " mil" : nf(0).format(v)),
  };
  const F = (f) => (typeof f === "function" ? f : fmt[f] || ((v) => v));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const $ = (s) => (typeof s === "string" ? document.querySelector(s) : s);
  const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const col = (c) => (c && c.startsWith("--") ? css(c) : c);
  const PALETTE = ["--c1", "--c2", "--c3", "--c4", "--c5", "--c6", "--c7", "--c8"];

  /* ───────── Tooltip ───────── */
  let tipEl;
  function tip(e, title, rows) {
    if (!tipEl) { tipEl = document.createElement("div"); tipEl.className = "lk-tip"; document.body.appendChild(tipEl); }
    tipEl.innerHTML = `<b>${esc(title)}</b>` + rows.map(([k, v]) => `<span>${esc(k)}<em>${esc(v)}</em></span>`).join("");
    tipEl.classList.add("on");
    const r = tipEl.getBoundingClientRect();
    let x = e.clientX + 14, y = e.clientY + 14;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - 14;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - 14;
    tipEl.style.left = x + "px"; tipEl.style.top = y + "px";
  }
  const untip = () => tipEl && tipEl.classList.remove("on");
  const tipAttr = (t, rows, g) => `data-tip='${JSON.stringify({ t, rows, g }).replace(/'/g, "&#39;")}'`;
  function bindTips(root) {
    root.querySelectorAll("[data-tip]").forEach((n) => {
      const d = JSON.parse(n.getAttribute("data-tip"));
      n.addEventListener("mousemove", (e) => {
        tip(e, d.t, d.rows);
        if (d.g != null) { root.classList.add("is-hover"); root.querySelectorAll(".mark").forEach((m) => m.classList.toggle("is-dim", m.dataset.g !== String(d.g))); }
      });
      n.addEventListener("mouseleave", () => { untip(); root.classList.remove("is-hover"); });
    });
  }

  function responsive(el, draw) {
    el = $(el); el.classList.add("lk-chart");
    let last = 0;
    const run = () => { const w = Math.round(el.clientWidth); if (w && w !== last) { last = w; draw(w); bindTips(el); } };
    run();
    if ("ResizeObserver" in window) new ResizeObserver(run).observe(el);
    return el;
  }
  function niceTicks(max, n = 4, min = 0) {
    const span = (max - min) || 1, raw = span / n, mag = Math.pow(10, Math.floor(Math.log10(raw))), k = raw / mag;
    const step = (k <= 1 ? 1 : k <= 2 ? 2 : k <= 2.5 ? 2.5 : k <= 5 ? 5 : 10) * mag;
    const lo = Math.floor(min / step) * step, hi = Math.ceil(max / step) * step, t = [];
    for (let v = lo; v <= hi + step / 2; v += step) t.push(+v.toFixed(8));
    return { lo, hi, t };
  }
  let gid = 0;

  /* ───────── Linha suave com área (como no print) ───────── */
  // Interpolação monotônica (não cria picos falsos entre pontos)
  function smoothPath(p) {
    if (p.length < 3) return p.map((q, i) => (i ? "L" : "M") + q[0] + "," + q[1]).join("");
    const n = p.length, dx = [], s = [], m = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; s[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
    m[0] = s[0]; m[n - 1] = s[n - 2];
    for (let i = 1; i < n - 1; i++) m[i] = s[i - 1] * s[i] <= 0 ? 0 : (s[i - 1] + s[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (s[i] === 0) { m[i] = m[i + 1] = 0; continue; }
      const a = m[i] / s[i], b = m[i + 1] / s[i], h = a * a + b * b;
      if (h > 9) { const t = 3 / Math.sqrt(h); m[i] = t * a * s[i]; m[i + 1] = t * b * s[i]; }
    }
    let d = `M${p[0][0]},${p[0][1]}`;
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += `C${p[i][0] + h},${p[i][1] + m[i] * h} ${p[i + 1][0] - h},${p[i + 1][1] - m[i + 1] * h} ${p[i + 1][0]},${p[i + 1][1]}`;
    }
    return d;
  }
  function line(el, o) {
    el = $(el);
    const f = F(o.fmt || "int"), tf = F(o.tickFmt || o.fmt || "int");
    return responsive(el, (W) => {
      const H = o.height || 200, id = "g" + gid++;
      const m = { t: 22, r: 16, b: o.xTitle ? 40 : 24, l: o.yAxis === false ? 12 : 44 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const pts0 = o.values.map((v, i) => [i, v]).filter((q) => q[1] != null);
      const vs = pts0.map((q) => q[1]);
      const lo0 = o.zero === false ? Math.min(...vs) : 0;
      const pad = o.zero === false ? (Math.max(...vs) - lo0) * 0.15 : 0;
      const { lo, hi, t } = niceTicks(Math.max(...vs) + pad * 0.5, o.ticks || 4, o.zero === false ? lo0 - pad : 0);
      const n = o.labels.length;
      const x = (i) => m.l + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
      const y = (v) => m.t + ih - ((v - lo) / (hi - lo)) * ih;
      const c = col(o.color || "--c1");
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.label || "")}"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity=".22"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient></defs>`;
      t.forEach((v) => { s += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`; if (o.yAxis !== false) s += `<text class="tick" x="${m.l - 8}" y="${y(v) + 3}" text-anchor="end">${esc(tf(v))}</text>`; });
      const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(iw / (o.minLabelGap || 46)))));
      o.labels.forEach((l, i) => { if ((i % every === 0 && (n - 1 - i >= every || every === 1)) || i === n - 1) s += `<text class="tick" x="${x(i)}" y="${m.t + ih + 15}" text-anchor="middle">${esc(l)}</text>`; });
      // trechos contínuos (valores nulos quebram a linha)
      const runs = []; let cur = [];
      o.values.forEach((v, i) => { if (v == null) { if (cur.length) runs.push(cur); cur = []; } else cur.push([+x(i).toFixed(1), +y(v).toFixed(1)]); });
      if (cur.length) runs.push(cur);
      runs.forEach((r) => {
        const d = smoothPath(r);
        s += `<path d="${d}L${r[r.length - 1][0]},${m.t + ih}L${r[0][0]},${m.t + ih}Z" fill="url(#${id})"/>`;
        s += `<path d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
      });
      s += `<line class="base" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/>`;
      const band = n > 1 ? iw / (n - 1) : iw;
      o.values.forEach((v, i) => {
        if (v == null) return;
        s += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#fff" stroke="${c}" stroke-width="2"/>`;
        if (o.labelsOn !== false) s += `<text class="lbl" x="${x(i)}" y="${y(v) - 8}" text-anchor="middle">${esc((o.labelFmt ? F(o.labelFmt) : f)(v))}</text>`;
        s += `<rect class="hit" x="${x(i) - band / 2}" y="${m.t}" width="${band}" height="${ih}" ${tipAttr(o.labels[i] + (o.xName ? " " + o.xName : ""), [[o.valueName || "Valor", f(v)]])}/>`;
      });
      if (o.xTitle) s += `<text class="axis-title" x="${m.l + iw / 2}" y="${H - 4}" text-anchor="middle">${esc(o.xTitle)}</text>`;
      el.innerHTML = s + "</svg>";
    });
  }

  /* ───────── Colunas ───────── */
  function columns(el, o) {
    el = $(el);
    const f = F(o.fmt || "int");
    return responsive(el, (W) => {
      const H = o.height || 220, n = o.data.length;
      const stagger = (W - 50) / n < 42;
      const m = { t: 20, r: 10, b: stagger ? 38 : 24, l: o.yAxis === false ? 10 : 40 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const { hi, t } = niceTicks(Math.max(...o.data.map((d) => d[1])), 5);
      const y = (v) => m.t + ih - (v / hi) * ih;
      const band = iw / n, bw = Math.min(o.barMax || 44, band * 0.62), c = col(o.color || "--c1");
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${esc(o.label || "")}">`;
      t.forEach((v) => { s += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/>`; if (o.yAxis !== false) s += `<text class="tick" x="${m.l - 8}" y="${y(v) + 3}" text-anchor="end">${esc(fmt.int(v))}</text>`; });
      o.data.forEach(([l, v], i) => {
        const cx = m.l + band * (i + 0.5), h = Math.max(v > 0 ? 1.5 : 0, (v / hi) * ih), x0 = cx - bw / 2, y0 = m.t + ih - h, r = Math.min(4, h / 2);
        if (h) s += `<path class="mark" data-g="${i}" fill="${c}" d="M${x0},${y0 + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${y0 + h}Z"/>`;
        s += `<text class="lbl" x="${cx}" y="${y0 - 6}" text-anchor="middle">${esc(f(v))}</text>`;
        s += `<text class="tick" x="${cx}" y="${m.t + ih + (stagger && i % 2 ? 29 : 15)}" text-anchor="middle">${esc(l)}</text>`;
        s += `<rect class="hit" x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" ${tipAttr(String(l), [[o.valueName || "Total", f(v)]], i)}/>`;
      });
      s += `<line class="base" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/>`;
      el.innerHTML = s + "</svg>";
    });
  }

  /* ───────── Colunas agrupadas (2 séries) ───────── */
  function grouped(el, o) {
    el = $(el);
    const f = F(o.fmt || "int"), lf = F(o.labelFmt || o.fmt || "int");
    return responsive(el, (W) => {
      const H = o.height || 240, n = o.categories.length, k = o.series.length;
      const m = { t: o.rotate ? 64 : 20, r: 10, b: 24, l: 48 };
      const iw = W - m.l - m.r, ih = H - m.t - m.b;
      const { hi, t } = niceTicks(Math.max(...o.series.flatMap((s) => s.values)), 4);
      const y = (v) => m.t + ih - (v / hi) * ih;
      const band = iw / n, bw = Math.min(26, (band * 0.7) / k);
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
      t.forEach((v) => { s += `<line class="grid" x1="${m.l}" x2="${W - m.r}" y1="${y(v)}" y2="${y(v)}"/><text class="tick" x="${m.l - 8}" y="${y(v) + 3}" text-anchor="end">${esc(F(o.tickFmt || "int")(v))}</text>`; });
      o.categories.forEach((cat, i) => {
        const cx = m.l + band * (i + 0.5);
        o.series.forEach((se, j) => {
          const v = se.values[i], h = Math.max(1.5, (v / hi) * ih), x0 = cx - (k * bw) / 2 + j * bw + 1, w = bw - 2, y0 = m.t + ih - h, r = Math.min(3, h / 2);
          s += `<path class="mark" data-g="${i}" fill="${col(se.color)}" d="M${x0},${y0 + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + w - r}Q${x0 + w},${y0} ${x0 + w},${y0 + r}V${y0 + h}Z"/>`;
          s += o.rotate
            ? `<text class="lbl" transform="translate(${x0 + w / 2 + 3},${y0 - 4}) rotate(-90)" style="font-size:9px">${esc(lf(v))}</text>`
            : `<text class="lbl" x="${x0 + w / 2}" y="${y0 - 5}" text-anchor="middle" style="font-size:9px">${esc(lf(v))}</text>`;
        });
        s += `<text class="tick" x="${cx}" y="${m.t + ih + 15}" text-anchor="middle">${esc(cat)}</text>`;
        s += `<rect class="hit" x="${m.l + band * i}" y="${m.t}" width="${band}" height="${ih}" ${tipAttr(cat, o.series.map((se) => [se.name, f(se.values[i])]), i)}/>`;
      });
      s += `<line class="base" x1="${m.l}" x2="${W - m.r}" y1="${m.t + ih}" y2="${m.t + ih}"/>`;
      el.innerHTML = s + "</svg>";
    });
  }

  /* ───────── Barras horizontais (pirâmides) ───────── */
  // Pirâmide espelhada: rows = [rótulo, esquerda, direita]
  function pyramid(el, o) {
    el = $(el);
    return responsive(el, (W) => {
      const rh = 24, gap = 4, lab = 70, H = o.rows.length * (rh + gap) + 28, half = (W - lab) / 2;
      const max = Math.max(...o.rows.flatMap((r) => [r[1], r[2]])), sc = (v) => (v / max) * (half - 4);
      const cl = col(o.left.color), cr = col(o.right.color);
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><text class="tick" x="${half - 4}" y="12" text-anchor="end" style="font-size:11px;font-weight:600;letter-spacing:.06em">${esc(o.left.name.toUpperCase())}</text><text class="tick" x="${half + lab + 4}" y="12" style="font-size:11px;font-weight:600;letter-spacing:.06em">${esc(o.right.name.toUpperCase())}</text>`;
      o.rows.forEach(([l, a, b], i) => {
        const y0 = 24 + i * (rh + gap), wa = sc(a), wb = sc(b), xr = half + lab;
        s += `<rect class="mark" data-g="${i}" x="${half - wa}" y="${y0}" width="${wa}" height="${rh}" rx="4" fill="${cl}"/><rect class="mark" data-g="${i}" x="${xr}" y="${y0}" width="${wb}" height="${rh}" rx="4" fill="${cr}"/>`;
        s += `<text class="lbl ${wa > 40 ? "lbl--in" : ""}" x="${wa > 40 ? half - wa + 8 : half - wa - 4}" y="${y0 + 16}" text-anchor="${wa > 40 ? "start" : "end"}">${fmt.int(a)}</text>`;
        s += `<text class="lbl ${wb > 40 ? "lbl--in" : ""}" x="${wb > 40 ? xr + wb - 8 : xr + wb + 4}" y="${y0 + 16}" text-anchor="${wb > 40 ? "end" : "start"}">${fmt.int(b)}</text>`;
        s += `<text x="${half + lab / 2}" y="${y0 + 16}" text-anchor="middle" style="font-size:12px;font-weight:700;fill:var(--lk-ink)">${esc(l)}</text>`;
        s += `<rect class="hit" x="0" y="${y0 - 2}" width="${W}" height="${rh + gap}" ${tipAttr(l, [[o.left.name, fmt.int(a)], [o.right.name, fmt.int(b)]], i)}/>`;
      });
      el.innerHTML = s + "</svg>";
    });
  }
  // Barras horizontais simples: rows = [rótulo, valor]
  function hbars(el, o) {
    el = $(el);
    return responsive(el, (W) => {
      const rh = 18, gap = 4, lab = o.labelWidth || 56, H = o.rows.length * (rh + gap) + 4;
      const max = Math.max(...o.rows.map((r) => r[1])), c = col(o.color || "--c1");
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
      o.rows.forEach(([l, v], i) => {
        const y0 = i * (rh + gap), w = Math.max(1, (v / max) * (W - lab - 44));
        s += `<text x="${lab - 8}" y="${y0 + 13}" text-anchor="end" style="font-size:12px;font-weight:700;fill:var(--lk-ink)">${esc(l)}</text>`;
        s += `<rect class="mark" data-g="${i}" x="${lab}" y="${y0}" width="${w}" height="${rh}" rx="3" fill="${c}"/><text class="lbl" x="${lab + w + 5}" y="${y0 + 13}">${fmt.int(v)}</text>`;
        s += `<rect class="hit" x="0" y="${y0}" width="${W}" height="${rh + gap}" ${tipAttr(l, [[o.valueName || "Total", fmt.int(v)]], i)}/>`;
      });
      el.innerHTML = s + "</svg>";
    });
  }

  /* ───────── Pizza / rosca com legenda ───────── */
  function pie(el, o) {
    el = $(el);
    const items = o.items.map((it, i) => ({ ...it, color: col(it.color || PALETTE[i]) }));
    const total = items.reduce((a, b) => a + b.value, 0);
    const R = 100, r0 = o.donut ? 56 : 0, C = 110;
    let s = `<svg viewBox="0 0 220 220" role="img" aria-label="${esc(o.label || "")}">`;
    let a = -Math.PI / 2;
    const P = (rad, ang) => `${(C + rad * Math.cos(ang)).toFixed(2)},${(C + rad * Math.sin(ang)).toFixed(2)}`;
    items.forEach((it, i) => {
      const fr = it.value / total; if (fr <= 0) return;
      const b = a + fr * Math.PI * 2, big = b - a > Math.PI ? 1 : 0;
      let d;
      if (fr > 0.9999) d = o.donut ? `M${C},${C - R}A${R},${R} 0 1 1 ${C - 0.01},${C - R}ZM${C},${C - r0}A${r0},${r0} 0 1 1 ${C - 0.01},${C - r0}Z` : `M${C},${C - R}A${R},${R} 0 1 1 ${C - 0.01},${C - R}Z`;
      else d = o.donut ? `M${P(R, a)}A${R},${R} 0 ${big} 1 ${P(R, b)}L${P(r0, b)}A${r0},${r0} 0 ${big} 0 ${P(r0, a)}Z` : `M${C},${C}L${P(R, a)}A${R},${R} 0 ${big} 1 ${P(R, b)}Z`;
      s += `<path class="mark" data-g="${i}" d="${d}" fill="${it.color}" stroke="#fff" stroke-width="2" fill-rule="evenodd" ${tipAttr(it.label, it.est ? [] : [["Participação", it.text || fmt.pct(fr * 100, o.dec ?? 1)]].concat(it.count != null ? [["Total", fmt.int(it.count)]] : []), i)}/>`;
      if (!it.est && fr >= (o.minLabel ?? 0.05)) {
        const mid = (a + b) / 2, lr = fr > 0.9999 ? 0 : o.donut ? (R + r0) / 2 : R * 0.62;
        s += `<text class="lbl--pie" x="${C + lr * Math.cos(mid)}" y="${C + lr * Math.sin(mid) + 4}" text-anchor="middle" fill="${fr > 0.9999 && o.donut ? "#2a2838" : it.ink || "#fff"}" style="font-size:11px;font-weight:600">${esc(it.text || fmt.pct(fr * 100, o.dec ?? 1).replace(",0%", "%"))}</text>`;
      }
      a = b;
    });
    s += "</svg>";
    el.classList.add("lk-pie"); if (o.small) el.classList.add("lk-pie--small");
    el.innerHTML = `<div class="lk-chart">${s}</div><ul class="lk-legend">${items.map((it) => `<li><i style="background:${it.color}"></i><span>${esc(it.label)}</span></li>`).join("")}</ul>`;
    bindTips(el.querySelector(".lk-chart"));
    return el;
  }

  /* ───────── Tabela ───────── */
  const HEAT = {
    red: [[247, 212, 207], [217, 83, 74], [178, 42, 34]],
    green: [[221, 238, 218], [95, 160, 90], [46, 112, 52]],
    purple: [[236, 226, 250], [160, 110, 210], [118, 60, 170]],
  };
  function heat(hue, t) {
    const [a, b, c] = HEAT[hue];
    const mix = (p, q, u) => p.map((v, i) => Math.round(v + (q[i] - v) * u));
    const rgb = t < 0.6 ? mix(a, b, t / 0.6) : mix(b, c, (t - 0.6) / 0.4);
    return `background:rgb(${rgb});color:${t > 0.35 ? "#fff" : hue === "red" ? "#8a2a22" : hue === "green" ? "#2e5d2f" : "#5a2c86"}`;
  }
  function table(el, o) {
    el = $(el);
    const cols = o.columns;
    const rng = cols.map((c, i) => (c.heat ? [Math.min(...o.rows.map((r) => r[i])), Math.max(...o.rows.map((r) => r[i]))] : null));
    const th = (o.index ? `<th class="idx"></th>` : "") + cols.map((c) => `<th class="${c.align || ""}">${esc(c.label)}${c.sort ? ` <i data-lucide="${c.sort === "asc" ? "arrow-up" : "arrow-down"}"></i>` : ""}</th>`).join("");
    const td = (c, v, i) => {
      const f = F(c.fmt);
      if (c.link) return `<td class="${c.align || ""}"><a href="#" onclick="return false">${esc(c.link)}</a></td>`;
      if (c.heat) { const [lo, hi] = rng[i]; const t = hi === lo ? 1 : (v - lo) / (hi - lo); return `<td class="${c.align || "r"}"><span class="lk-pill" style="${heat(c.heat, t)}">${esc(f(v))}</span></td>`; }
      return `<td class="${c.align || ""}${c.title ? " t" : ""}"${c.title ? ` title="${esc(v)}"` : ""}>${esc(f(v))}</td>`;
    };
    const body = o.rows.map((r, ri) => `<tr>${o.index ? `<td class="idx">${ri + 1}.</td>` : ""}${cols.map((c, i) => td(c, r[i], i)).join("")}</tr>`).join("");
    const pager = o.pager ? `<div class="lk-pager"><span>${esc(o.pager)}</span><button aria-label="Página anterior"><i data-lucide="chevron-left"></i></button><button aria-label="Próxima página"><i data-lucide="chevron-right"></i></button></div>` : "";
    const foot = o.foot ? `<tfoot><tr>${o.index ? "<td></td>" : ""}${o.foot.map((v, i) => `<td class="${(cols[i] && cols[i].align) || ""}">${esc(v)}</td>`).join("")}</tr></tfoot>` : "";
    el.innerHTML = `<div class="lk-table-wrap"${o.maxHeight ? ` style="max-height:${o.maxHeight}px"` : ""}><table class="lk-table"><thead><tr>${th}</tr></thead><tbody>${body}</tbody>${foot}</table></div>${pager}`;
    return el;
  }

  /* ───────── Mapa ilustrativo no estilo do print ───────── */
  function rnd(seed) { let a = seed >>> 0 || 1; return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
  // Contorno simplificado da Ilha de Santa Catarina (coordenadas do viewBox 1000×700)
  const ISLAND = [[560,40],[600,50],[640,80],[650,120],[630,160],[640,200],[620,240],[600,270],[610,310],[590,350],[600,390],[580,430],[590,470],[570,510],[560,560],[540,600],[520,650],[500,670],[480,640],[490,600],[500,560],[480,520],[470,470],[480,430],[460,400],[440,380],[470,350],[490,320],[500,280],[520,240],[510,200],[530,160],[520,120],[530,80]];
  function inPoly(x, y, p) { let c = false; for (let i = 0, j = p.length - 1; i < p.length; j = i++) if ((p[i][1] > y) !== (p[j][1] > y) && x < ((p[j][0] - p[i][0]) * (y - p[i][1])) / (p[j][1] - p[i][1]) + p[i][0]) c = !c; return c; }

  function mapSvg(o) {
    const r = rnd(o.seed || 7), W = 1000, H = 700, cx = 500, cy = 350;
    const sat = o.style === "satellite";
    const P = sat ? { land: "#4a5a45", block: "#5d6658", road: "#a7a595", edge: "#6f7465", water: "#2d5673", park: "#34472d", main: "#c9b98e" }
      : { land: css("--m-land"), block: css("--m-block"), road: css("--m-road"), edge: css("--m-edge"), water: css("--m-water"), park: css("--m-park"), main: css("--m-main") };
    let s = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">`;
    let pts = [];
    if (o.kind === "city") {
      s += `<rect width="${W}" height="${H}" fill="${P.water}"/>`;
      s += `<path d="M0,0H380C400,120 360,200 400,300C430,380 380,470 420,560C440,620 400,680 420,700H0Z" fill="${P.land}"/>`;
      s += `<path d="M120,80C200,140 160,260 230,330C280,390 220,520 300,600" stroke="${P.park}" stroke-width="80" fill="none" opacity=".6" stroke-linecap="round"/>`;
      s += `<path d="M${ISLAND.map((q) => q.join(",")).join("L")}Z" fill="${P.land}" stroke="${sat ? "#6d7f67" : "#e2ded5"}" stroke-width="2"/>`;
      s += `<path d="M470,350C430,352 410,350 390,348" stroke="${P.road}" stroke-width="6"/>`;
      s += `<path d="M300,40C330,200 320,400 340,690" stroke="${P.main}" stroke-width="4" fill="none" opacity=".8"/>`;
      if (o.points) for (let i = 0, tries = 0; i < o.points.n && tries < 20000; tries++) {
        const x = 440 + r() * 220, y = 40 + r() * 640;
        const dens = o.points.dense ? Math.exp(-((y - 350) ** 2) / 30000) * 0.7 + 0.3 : 1;
        if (inPoly(x, y, ISLAND) && r() < dens) { pts.push([x, y]); i++; }
      }
    } else {
      s += `<rect width="${W}" height="${H}" fill="${P.land}"/>`;
      if (o.water) s += `<path d="M0,0H70C60,200 90,400 60,700H0Z" fill="${P.water}"/>`;
      for (let i = 0; i < (o.parks ?? 3); i++) { const px = r() * W, py = r() * H; s += `<ellipse cx="${px}" cy="${py}" rx="${90 + r() * 120}" ry="${60 + r() * 90}" fill="${P.park}" opacity=".85"/>`; }
      const xs = [], ys = [];
      for (let x = (o.water ? 110 : 20); x < W; x += 110 + r() * 40) xs.push(x);
      for (let y = 20; y < H; y += 95 + r() * 40) ys.push(y);
      for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) s += `<rect x="${xs[i] + 9}" y="${ys[j] + 9}" width="${xs[i + 1] - xs[i] - 18}" height="${ys[j + 1] - ys[j] - 18}" rx="4" fill="${P.block}"/>`;
      if (sat) {
        // textura de satélite: telhados e mata
        s += `<path d="M560,0H1000V700H700C640,560 720,420 600,300C540,220 600,100 560,0Z" fill="#2f4128"/>`;
        for (let i = 0; i < 90; i++) s += `<circle cx="${560 + r() * 440}" cy="${r() * 700}" r="${14 + r() * 26}" fill="${r() > .5 ? "#263a21" : "#3a5230"}" opacity=".8"/>`;
        for (let i = 0; i < 260; i++) { const bx = r() * 620, by = r() * 700; if (bx > 540 && by < 520) continue; const g = 120 + Math.floor(r() * 90); s += `<rect x="${bx}" y="${by}" width="${10 + r() * 26}" height="${8 + r() * 20}" fill="rgb(${g},${g - 6},${g - 14})" opacity=".85"/>`; }
      }
      xs.forEach((x) => { s += `<rect x="${x - 5}" y="0" width="10" height="${H}" fill="${P.road}"/>`; });
      ys.forEach((y) => { s += `<rect x="0" y="${y - 5}" width="${W}" height="10" fill="${P.road}"/>`; });
      const hw = `M${o.water ? 90 : -10},${80 + r() * 100}C300,200 420,420 620,470S900,560 1010,600`;
      s += `<path d="${hw}" stroke="${P.edge}" stroke-width="18" fill="none"/><path d="${hw}" stroke="${P.main}" stroke-width="12" fill="none"/>`;
      if (o.parcel) s += `<path d="M${cx - 190},${cy - 70}L${cx - 160},${cy - 95}L${cx + 150},${cy + 30}L${cx + 135},${cy + 62}Z" fill="#e5484d" fill-opacity=".12" stroke="#e5484d" stroke-width="5" stroke-linejoin="round"/>`;
      if (o.sectors) for (let i = 0; i < o.sectors.n; i++) { const sx = cx + gauss(r) * 150, sy = cy + gauss(r) * 110, fill = col(o.sectors.colors ? o.sectors.colors[Math.floor(r() * o.sectors.colors.length)] : "--color-brand-primary-light"); s += `<circle cx="${sx}" cy="${sy}" r="${45 + r() * 60}" fill="${fill}" fill-opacity="${o.sectors.opacity || 0.45}"/>`; }
      if (o.points) for (let i = 0; i < o.points.n; i++) pts.push([cx + gauss(r) * (o.points.spread || 130), cy + gauss(r) * (o.points.spread || 130) * 0.75]);
    }
    if (o.radius) s += `<circle cx="${cx}" cy="${cy}" r="260" fill="${css("--c1")}" fill-opacity=".04" stroke="${css("--lk-purple-dark")}" stroke-width="2.5" stroke-dasharray="10 8"/>`;
    const cs = (o.points && o.points.colors ? o.points.colors : ["--c1"]).map(col), ws = o.points && o.points.weights ? o.points.weights : cs.map(() => 1), tw = ws.reduce((a, b) => a + b, 0);
    pts.forEach(([x, y]) => { let k = r() * tw, ci = 0; while (k > ws[ci]) { k -= ws[ci]; ci++; } s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${o.points.r || 7}" fill="${cs[ci]}" fill-opacity="${o.points.alpha || 0.9}" stroke="#fff" stroke-width="2"/>`; });
    if (o.pin) s += `<g transform="translate(${cx} ${cy})"><circle r="15" fill="#fff"/><circle r="11" fill="${css("--lk-purple-dark")}"/><circle r="4" fill="${css("--lk-teal")}"/></g>`;
    return s + "</svg>";
  }
  function map(el, o = {}) {
    el = $(el); el.classList.add("lk-map");
    if (o.height) el.style.minHeight = o.height + "px";
    let h = mapSvg(o);
    if (o.controls === false) { el.innerHTML = h; return el; }
    h += `<div class="lk-map__ctl lk-map__ctl--tl"><div class="lk-maptype"><button aria-pressed="${o.style !== "satellite"}">Mapa</button><button aria-pressed="${o.style === "satellite"}">Satélite</button></div></div>`;
    h += `<div class="lk-map__ctl lk-map__ctl--tr"><button class="lk-mapbtn" aria-label="Tela cheia"><i data-lucide="maximize"></i></button></div>`;
    h += `<div class="lk-map__ctl lk-map__ctl--br"><button class="lk-mapbtn lk-pegman" aria-label="Street View"><i data-lucide="person-standing"></i></button><div class="lk-zoom"><button aria-label="Aproximar"><i data-lucide="plus"></i></button><button aria-label="Afastar"><i data-lucide="minus"></i></button></div></div>`;
    h += `<div class="lk-map__ctl lk-map__ctl--bl"><span class="lk-google">Google</span></div>`;
    if (o.radius) h += `<div class="lk-map__ctl" style="left:50%;top:calc(50% - ${o.radiusTop || 150}px);transform:translate(-50%,-50%)"><span class="lk-radius-pill"><i></i>RAIO 1.000m</span></div>`;
    if (o.note) h += `<div class="lk-map__ctl lk-map__ctl--bc" style="bottom:${o.slider ? 64 : 14}px"><span class="lk-map-note">${esc(o.note)}</span></div>`;
    if (o.slider) h += `<div class="lk-map__ctl lk-map__ctl--bc"><div class="lk-distance"><span class="lk-distance__label">Distância</span><span class="lk-distance__track"><i></i><b style="left:calc(100% - 7px)"></b></span><span class="lk-distance__val">0 – 1.000m</span></div></div>`;
    el.innerHTML = h;
    return el;
  }

  /* ───────── Peças de HTML ───────── */
  const card = (o) => `<section class="lk-card${o.cls ? " " + o.cls : ""}"${o.style ? ` style="${o.style}"` : ""}>${o.title != null ? `<div class="lk-card__head"><h2 class="lk-card__title${o.center ? " lk-card__title--center" : ""}">${o.title}</h2>${o.chip ? `<span class="lk-chip">${esc(o.chip)}</span>` : ""}</div>` : ""}<div class="lk-card__body${o.flush ? " lk-card__body--flush" : ""}"${o.id ? ` id="${o.id}"` : ""}>${o.body || ""}</div></section>`;
  const dd = (label, count, wide) => `<button class="lk-dd${wide ? " lk-dd--wide" : ""}" type="button"><span>${esc(label)}${count ? `<small>(${count})</small>` : ""}</span><i data-lucide="chevron-down"></i></button>`;
  const seg = (label, items, on) => `<div class="lk-seg"><span class="lk-seg__label">${esc(label)}</span>${items.map((i) => `<button class="lk-seg__item" aria-pressed="${i === on}">${esc(i)}</button>`).join("")}</div>`;
  const kpis = (list) => `<div class="lk-kpis">${list.map(([l, v, cls]) => `<div class="lk-kpi"><span class="lk-kpi__label">${l}</span><span class="lk-kpi__value${cls ? " " + cls : ""}">${v}</span></div>`).join("")}</div>`;
  const range = (label, lo, hi) => `<div class="lk-range"><div class="lk-range__head"><span>${esc(label)}</span><span>${esc(lo)} – ${esc(hi)}</span></div><div class="lk-range__track"><span class="lk-range__fill"></span><span class="lk-range__thumb" style="left:0"></span><span class="lk-range__thumb" style="left:100%"></span></div></div>`;
  const delta = (v, d = 2, suffix = "%") => v == null ? "" : `<span class="lk-delta ${v >= 0 ? "lk-up" : "lk-down"}"><i data-lucide="${v >= 0 ? "arrow-up" : "arrow-down"}"></i>${nf(d).format(v)}${suffix}</span>`;
  const btn = (label, href, on, extra = "") => `<a class="lk-btn${extra}" href="${href}"${on ? ' aria-current="page"' : ""}>${esc(label)}</a>`;
  const score = (label, value, cls = "") => `<div class="lk-score ${cls}"><span class="lk-score__label">${esc(label)}</span><span class="lk-score__value">${value}</span></div>`;

  /* ───────── Cabeçalhos dos relatórios ───────── */
  const ESTUDO = [
    ["resumo", "Resumo executivo", "resumo.html"],
    ["mercado", "Mercado imobiliário", "mercado-residencial-venda.html"],
    ["demografico", "Demográfico", "demografia-2022.html"],
    ["socioeconomico", "Socioeconômico", "socioeconomia-2022.html"],
    ["pois", "Pontos de interesse", "pois-comercio.html"],
    ["empresas", "Empresas", "#"],
    ["equipamentos", "Equipamentos urb.", "equipamentos-urbanos.html"],
  ];
  const ESTUDO_SUB = {
    resumo: [["resumo", "Resumo executivo", "resumo.html"]],
    mercado: [["residencial", "Residencial", "mercado-residencial-venda.html"], ["comercial", "Comercial", "mercado-comercial-venda.html"], ["obras", "Obras", "mercado-obras.html"]],
    demografico: [["2022", "Demografia 2022", "demografia-2022.html"], ["2010-2022", "Demografia 2010 × 2022", "demografia-2010-2022.html"]],
    socioeconomico: [["2022", "Socioeconomia 2022", "socioeconomia-2022.html"], ["2010", "Socioeconomia 2010", "socioeconomia-2010.html"]],
    pois: [["comercio", "Comércio e serviços", "pois-comercio.html"], ["pgt", "Polos de tráfego", "pois-pgt.html"]],
    equipamentos: [["equipamentos", "Equipamentos urbanos", "equipamentos-urbanos.html"]],
  };
  const OBS = [
    ["venda", "Venda", "observatorio-venda-residencial.html"],
    ["longstay", "Longstay", "observatorio-longstay-residencial.html"],
    ["shortstay", "Shortstay", "#"],
    ["obras", "Obras", "observatorio-obras.html"],
    ["sociodemografico", "Sociodemográfico", "observatorio-sociodemografico.html"],
  ];

  // Estudo de área: abas das seções + faixa de subseções com "Limpar filtros"
  function estudoHeader(p) {
    const subs = ESTUDO_SUB[p.section] || [];
    return `<header class="lk-header"><nav class="lk-sections" aria-label="Seções">${ESTUDO.map(([id, l, h]) => btn(l, h, id === p.section, h === "#" ? '" aria-disabled="true' : "")).join("")}</nav>
      <div class="lk-subbar">${subs.map(([id, l, h]) => btn(l, h, id === p.sub, " lk-btn--sm")).join("")}<span class="lk-subbar__spacer"></span><button class="lk-btn lk-btn--sm lk-btn--clear" type="button"><i data-lucide="trash-2"></i>Limpar filtros</button></div></header>`;
  }
  // Observatório: abas das modalidades + "Limpar filtros"; segunda linha (Ofertas/Valorização + Residencial/Comercial) fica na página
  function obsHeader(p) {
    return `<header class="lk-header"><nav class="lk-sections" aria-label="Modalidades">${OBS.map(([id, l, h]) => btn(l, h, id === p.section, h === "#" ? '" aria-disabled="true' : "")).join("")}<span class="lk-subbar__spacer"></span><button class="lk-btn lk-btn--clear" type="button"><i data-lucide="trash-2"></i>Limpar filtros</button></nav></header>`;
  }
  // Rodapé: o do estudo de área traz contato e versão; o do Observatório só a marca
  function footer(p) {
    const logo = `<img src="../../assets/Logos/logo.svg" alt="Locates">`;
    if (p.report === "obs") return `<footer class="lk-footer">${logo}<span class="lk-footer__right">© <b>LOCATES</b> 2026<br>Todos os direitos reservados.</span></footer><div class="lk-footnote">Data da última atualização: ${esc(p.updated || "28/09/2026")} | <a href="#" onclick="return false">Política de Privacidade</a></div>`;
    return `<footer class="lk-footer">${logo}<span>•</span><span>(48) 98816-5403</span><span>•</span><span>www.locates.com.br</span><span class="lk-footer__right">© <b>LOCATES</b> 2026<br>Versão do relatório: 1.1 · Todos os direitos reservados.</span></footer><div class="lk-footnote">Dados atualizados pela última vez: ${esc(p.updated || "28/09/2026")} (alguns itens na página não foram atualizados) | <a href="#" onclick="return false">Política de Privacidade</a></div>`;
  }
  function page(p, body) {
    const root = document.querySelector("main");
    root.className = "lk-page";
    root.innerHTML = (p.report === "obs" ? obsHeader(p) : estudoHeader(p)) + body + footer(p);
  }

  /* ───────── Ícones ───────── */
  function icons() {
    const lib = window.LUCIDE || {};
    document.querySelectorAll("i[data-lucide]").forEach((i) => {
      const n = i.getAttribute("data-lucide");
      if (!lib[n]) { console.warn("ícone ausente:", n); return; }
      i.outerHTML = `<svg class="lucide lucide-${n}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lib[n]}</svg>`;
    });
  }
  if ("MutationObserver" in window) new MutationObserver((ms) => { if (ms.some((m) => m.addedNodes.length)) icons(); }).observe(document.documentElement, { childList: true, subtree: true });

  window.LK = { fmt, line, columns, grouped, pie, pyramid, hbars, table, map, card, dd, seg, kpis, range, delta, btn, score, page, icons, col, esc };
})();
