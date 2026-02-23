// ===== Year + Updated =====
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("updatedLabel").textContent = new Date().toLocaleString("en-GB", { timeZone: "Africa/Nairobi" });

// ===== Mobile nav (pointer-safe, works after scroll) =====
const menuBtn = document.getElementById("menuBtn");
const mobilePanel = document.getElementById("mobilePanel");

function setMenu(open){
  document.body.classList.toggle("mobile-open", open);
  if (menuBtn){
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  }
}

if (menuBtn && mobilePanel){
  menuBtn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu(!document.body.classList.contains("mobile-open"));
  }, { passive:false });

  mobilePanel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setMenu(false);
  });

  document.addEventListener("pointerdown", (e) => {
    if (!document.body.classList.contains("mobile-open")) return;
    const navWrap = document.querySelector(".nav-wrap");
    if (navWrap && !navWrap.contains(e.target)) setMenu(false);
  }, { passive:true });
}

// ===== Toast =====
const toastEl = document.getElementById("toast");
function toast(msg){
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// ===== Instruments + Timeframes =====
const instruments = [
  { key:"FX:EURUSD", name:"EUR/USD", asset:"FX" },
  { key:"FX:GBPUSD", name:"GBP/USD", asset:"FX" },
  { key:"FX:USDJPY", name:"USD/JPY", asset:"FX" },
  { key:"FX:AUDUSD", name:"AUD/USD", asset:"FX" },
  { key:"FX:USDCAD", name:"USD/CAD", asset:"FX" },
  { key:"OANDA:XAUUSD", name:"XAU/USD (Gold)", asset:"Gold" },
  { key:"NASDAQ:NDX", name:"NAS100 (NDX)", asset:"Indices" },
  { key:"BINANCE:BTCUSDT", name:"BTC/USDT", asset:"Crypto" }
];
const timeframes = ["1","5","15","30","60","240","D"];
const tfLabels = { "1":"1m","5":"5m","15":"15m","30":"30m","60":"1h","240":"4h","D":"1D" };

// ===== State (with persistence) =====
const LS_VIEW = "ubuntufx_chart_view";
let state = { symbol:"FX:EURUSD", tf:"15", pro:true, loaded:false };

try{
  const saved = JSON.parse(localStorage.getItem(LS_VIEW) || "null");
  if (saved && saved.symbol && saved.tf) state = { ...state, ...saved };
}catch(e){}

// ===== Render pills =====
const pairsRow = document.getElementById("pairsRow");
const tfsRow = document.getElementById("tfsRow");
const pairSearch = document.getElementById("pairSearch");

function renderPairs(filterText=""){
  const q = (filterText || "").trim().toLowerCase();
  const filtered = instruments.filter(x => !q || (x.name + " " + x.key).toLowerCase().includes(q));

  pairsRow.innerHTML = filtered.map(x => {
    const active = x.key === state.symbol ? "active" : "";
    return `<span class="filter-pill ${active}" data-symbol="${x.key}">
      <i class="fa-solid fa-tag" style="color:rgba(249,168,37,.92)"></i> ${x.name}
    </span>`;
  }).join("");

  pairsRow.querySelectorAll("[data-symbol]").forEach(el => {
    el.addEventListener("click", () => {
      state.symbol = el.getAttribute("data-symbol");
      state.loaded = false;
      updateHeader();
      renderPairs(pairSearch.value);
      updateChart();
      toast("Instrument updated.");
    });
  });
}

function renderTFs(){
  tfsRow.innerHTML = timeframes.map(tf => {
    const active = tf === state.tf ? "active" : "";
    return `<span class="filter-pill ${active}" data-tf="${tf}">
      <i class="fa-solid fa-clock" style="color:rgba(249,168,37,.92)"></i> ${tfLabels[tf]}
    </span>`;
  }).join("");

  tfsRow.querySelectorAll("[data-tf]").forEach(el => {
    el.addEventListener("click", () => {
      state.tf = el.getAttribute("data-tf");
      state.loaded = false;
      updateHeader();
      renderTFs();
      updateChart();
      toast("Timeframe updated.");
    });
  });
}

pairSearch.addEventListener("input", (e) => renderPairs(e.target.value));
document.addEventListener("keydown", (e) => {
  if (e.key === "/"){
    e.preventDefault();
    pairSearch.focus();
  }
});

// ===== Pro switch (only controls visibility of top tools) =====
const proSwitch = document.getElementById("proSwitch");
const snapshotCard = document.getElementById("snapshotCard");
const strengthMeterWrap = document.getElementById("strengthMeter")?.closest(".card");

function setSwitch(el, on){
  el.classList.toggle("on", on);
  el.setAttribute("aria-checked", String(on));
}
function updateSwitchUI(){
  setSwitch(proSwitch, state.pro);
  if (snapshotCard) snapshotCard.style.display = state.pro ? "block" : "none";
  if (strengthMeterWrap) strengthMeterWrap.style.display = state.pro ? "block" : "none";
}
function switchClick(){
  state.pro = !state.pro;
  updateSwitchUI();
  persistView();
  toast("Layout updated.");
}
proSwitch.addEventListener("click", switchClick);
proSwitch.addEventListener("keydown", (e) => {
  if (e.key==="Enter" || e.key===" "){ e.preventDefault(); switchClick(); }
});

// ===== Header + badges =====
const selectedBadge = document.getElementById("selectedBadge");
const chartName = document.getElementById("chartName");
const assetLabel = document.getElementById("assetLabel");
const tfLabel = document.getElementById("tfLabel");
const feedLabel = document.getElementById("feedLabel");
const dataMode = document.getElementById("dataMode");

function getInstrument(){
  return instruments.find(x => x.key === state.symbol) || instruments[0];
}
function updateHeader(){
  const ins = getInstrument();
  chartName.textContent = ins.name;
  assetLabel.textContent = ins.asset;
  tfLabel.textContent = tfLabels[state.tf];
  selectedBadge.innerHTML = `<i class="fa-solid fa-tag" style="color:var(--gold)"></i> ${ins.name} • ${tfLabels[state.tf]}`;
}

// ===== Snapshot (demo feed) =====
const snapshotBody = document.getElementById("snapshotBody");

function rand(n, spread=0.01){
  return (n + (Math.random() - 0.5) * spread);
}
let demo = [
  { name:"EUR/USD", price:1.0725, chg:+0.12, spr:0.7, ses:"London" },
  { name:"GBP/USD", price:1.2648, chg:-0.08, spr:0.9, ses:"London" },
  { name:"USD/JPY", price:149.83, chg:+0.23, spr:1.1, ses:"Tokyo" },
  { name:"XAU/USD", price:2158.30, chg:+0.35, spr:2.6, ses:"NY" },
  { name:"NAS100",  price:17820,  chg:-0.14, spr:1.9, ses:"NY" },
  { name:"BTC/USDT",price:68940,  chg:-1.20, spr:0.0, ses:"24/7" },
];

function renderSnapshot(){
  demo = demo.map(x => {
    const p = Number(x.price);
    const newP = rand(p, p < 10 ? 0.0018 : (p < 1000 ? 2.2 : 60));
    const newChg = rand(x.chg, 0.18);
    return { ...x, price: newP, chg: newChg };
  });

  snapshotBody.innerHTML = demo.map(x => {
    const pos = x.chg >= 0;
    const cls = pos ? "pos" : "neg";
    const sign = pos ? "+" : "";
    const priceFmt = (x.price < 10) ? x.price.toFixed(4) : (x.price < 1000 ? x.price.toFixed(2) : Math.round(x.price).toString());

    return `
      <tr>
        <td>
          <div class="row-pair">
            <i class="fa-solid fa-chart-line" style="color:rgba(249,168,37,.95)"></i>
            ${x.name}
          </div>
        </td>
        <td>${priceFmt}</td>
        <td class="chg ${cls}">${sign}${x.chg.toFixed(2)}%</td>
        <td>${x.spr ? x.spr.toFixed(1) + " pips" : "—"}</td>
        <td><span class="tiny">${x.ses}</span></td>
      </tr>
    `;
  }).join("");
}

// ===== Currency Strength Meter (visual + "live" demo, no APIs) =====
const meterEl = document.getElementById("strengthMeter");
const currencies = ["USD","EUR","GBP","JPY","AUD","CAD","CHF","NZD"];

// 0..100 scores (start mid, then drift smoothly)
let strength = Object.fromEntries(currencies.map(c => [c, 50 + (Math.random()*10 - 5)]));

// clamp helper
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function driftStrength(){
  // small drift + tiny mean reversion towards 50 for realism
  for (const c of currencies){
    const v = strength[c];
    const noise = (Math.random() - 0.5) * 3.2; // drift
    const pull = (50 - v) * 0.03;             // mean reversion
    strength[c] = clamp(v + noise + pull, 5, 95);
  }

  // normalize slightly so we don't get everyone strong at once
  const avg = currencies.reduce((s,c)=>s+strength[c],0)/currencies.length;
  for (const c of currencies){
    strength[c] = clamp(strength[c] + (50 - avg) * 0.10, 5, 95);
  }
}

function renderMeter(){
  if (!meterEl) return;

  // Convert 0..100 into -50..+50 around center
  // positive => strength (right), negative => weakness (left)
  const entries = currencies.map(code => {
    const score = strength[code];              // 0..100
    const centered = score - 50;              // -50..+50
    // Stretch visual scale (makes lines longer but still proportional)
const scaleBoost = 7.8; // try 2.5–3.5 depending on taste
const abs = Math.min(100, Math.round(Math.abs(centered) * scaleBoost));
    return { code, score: Math.round(score), centered: Math.round(centered), abs };
  });

  // Sort: strongest at top, weakest at bottom
  entries.sort((a,b) => b.centered - a.centered);

  meterEl.innerHTML = entries.map(x => {
    const isStrong = x.centered >= 0;

    // width is 0..100 (we scaled abs already)
    const w = Math.min(100, x.abs);

    // display value like +12 / -18
    const label = (x.centered > 0 ? "+" : "") + x.centered;

    return `
      <div class="meter-row2" role="listitem" aria-label="${x.code} ${label}">
        <div class="meter-code2">
          ${x.code}
          <small>${label}</small>
        </div>

        <div class="meter-track2">
          <div class="meter-zero"></div>

          <div class="meter-fill-weak" style="width:${!isStrong ? w : 0}%;"></div>
          <div class="meter-fill-strong" style="width:${isStrong ? w : 0}%;"></div>

          <div class="meter-val2">${x.score}</div>
        </div>
      </div>
    `;
  }).join("");
}

// ===== TradingView Embed (iframe, no external scripts) =====
const chartWrap = document.getElementById("chartWrap");
const chartHost = document.getElementById("chartHost");
const btnOpenTV = document.getElementById("btnOpenTV");

function buildTVUrl(symbol, interval){
  const theme = "dark";
  const params = new URLSearchParams({
    symbol,
    interval,
    hidetoptoolbar: "0",
    hidelegend: "0",
    saveimage: "1",
    toolbarbg: "rgba(0,0,0,1)",
    studies: "",
    theme,
    style: "1",
    timezone: "Africa/Nairobi",
    withdateranges: "1",
    allow_symbol_change: "1",
    details: "1",
    hotlist: "0",
    calendar: "0",
  });
  return "https://s.tradingview.com/widgetembed/?" + params.toString();
}

function updateChart(){
  if (!state.loaded){
    chartHost.innerHTML = "";
    chartWrap.classList.add("loading");
    feedLabel.textContent = "Demo";
    dataMode.textContent = "Demo";
    return;
  }

  chartWrap.classList.add("loading");
  const url = buildTVUrl(state.symbol, state.tf);
 chartHost.innerHTML = `
  <iframe class="tv-embed" title="TradingView Chart" src="${url}" loading="lazy"
    style="height:520px;"></iframe>
`;
  const iframe = chartHost.querySelector("iframe");
  iframe.addEventListener("load", () => {
    chartWrap.classList.remove("loading");
    feedLabel.textContent = "TradingView";
    dataMode.textContent = "Live (Embed)";
  });
}

btnOpenTV.addEventListener("click", () => {
  state.loaded = true;
  persistView();
  updateChart();
  toast("Loading interactive chart...");
});

// Fullscreen
const btnFullscreen = document.getElementById("btnFullscreen");

async function enterFullscreen(){
  const target = document.getElementById("chartWrap");

  // Ensure chart is loaded before fullscreen for best UX
  if (!state.loaded){
    state.loaded = true;
    persistView();
    updateChart();
    toast("Loading chart...");
    // give iframe a moment to mount
    setTimeout(() => { enterFullscreen(); }, 350);
    return;
  }

  try{
    // Request fullscreen on the chart container
    if (!document.fullscreenElement){
      await (target.requestFullscreen?.() || target.webkitRequestFullscreen?.());
      toast("Fullscreen enabled.");
    }else{
      await (document.exitFullscreen?.() || document.webkitExitFullscreen?.());
      toast("Fullscreen exited.");
    }

    // Force iframe to fill container after fullscreen changes
    setTimeout(() => {
      const iframe = document.querySelector("#chartHost iframe.tv-embed");
      if (iframe){
        iframe.style.height = (document.fullscreenElement ? "100vh" : "520px");
      }
    }, 60);

  }catch(err){
    toast("Fullscreen blocked by browser.");
  }
}

btnFullscreen.addEventListener("click", enterFullscreen);

// Also respond to fullscreen changes (esc key etc.)
document.addEventListener("fullscreenchange", () => {
  const iframe = document.querySelector("#chartHost iframe.tv-embed");
  if (iframe){
    iframe.style.height = (document.fullscreenElement ? "100vh" : "520px");
  }
});

// Guides
document.getElementById("btnIndicators").addEventListener("click", () => {
  // If embed isn't loaded, load it first, then open full page as the real tool
  if (!state.loaded){
    state.loaded = true;
    persistView();
    updateChart();
  }
  toast("Indicators: opening TradingView full chart...");
  openTVFullPage("indicators");
});

document.getElementById("btnDraw").addEventListener("click", () => {
  if (!state.loaded){
    state.loaded = true;
    persistView();
    updateChart();
  }
  toast("Drawing tools: opening TradingView full chart...");
  openTVFullPage("chart");
});

// ===== Save / Restore / Reset / Link =====
function persistView(){
  localStorage.setItem(LS_VIEW, JSON.stringify({
    symbol: state.symbol,
    tf: state.tf,
    pro: state.pro,
    loaded: state.loaded
  }));
}

function tvSymbolForWeb(symbolKey){
  // Your symbols are like "FX:EURUSD" or "OANDA:XAUUSD"
  // TradingView full chart expects the same format.
  return symbolKey;
}

function tvIntervalForWeb(tf){
  // tf is "1","5","15","30","60","240","D"
  // TradingView supports these.
  return tf;
}

function openTVFullPage(focus = "chart"){
  const sym = tvSymbolForWeb(state.symbol);
  const interval = tvIntervalForWeb(state.tf);

  // Full TradingView chart page (best for real drawing/indicators)
  // Example: https://www.tradingview.com/chart/?symbol=FX:EURUSD&interval=15
  const url = `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(sym)}&interval=${encodeURIComponent(interval)}`;

  window.open(url, "_blank", "noopener,noreferrer");
  toast(focus === "indicators" ? "Opened TradingView (add indicators there)." : "Opened TradingView full chart.");
}

document.getElementById("btnSaveView").addEventListener("click", () => {
  persistView();
  toast("View saved.");
});

document.getElementById("btnRestoreView").addEventListener("click", () => {
  try{
    const saved = JSON.parse(localStorage.getItem(LS_VIEW) || "null");
    if (!saved){ toast("No saved view found."); return; }
    state = { ...state, ...saved };
    renderPairs(pairSearch.value);
    renderTFs();
    updateHeader();
    updateSwitchUI();
    updateChart();
    toast("View restored.");
  }catch(e){
    toast("Failed to restore view.");
  }
});

document.getElementById("btnReset").addEventListener("click", () => {
  state.symbol = "FX:EURUSD";
  state.tf = "15";
  state.pro = true;
  state.loaded = false;
  pairSearch.value = "";
  renderPairs("");
  renderTFs();
  updateHeader();
  updateSwitchUI();
  updateChart();
  persistView();
  toast("Reset complete.");
});

document.getElementById("btnCopy").addEventListener("click", () => {
  const hash = `#symbol=${encodeURIComponent(state.symbol)}&tf=${encodeURIComponent(state.tf)}`;
  const url = location.origin + location.pathname + hash;
  navigator.clipboard?.writeText(url).then(() => toast("Link copied."));
});

// deep link support
function readHash(){
  const h = location.hash.replace("#","");
  if (!h) return;
  const p = new URLSearchParams(h);
  const sym = p.get("symbol");
  const tf = p.get("tf");
  if (sym && instruments.some(x => x.key === sym)) state.symbol = sym;
  if (tf && timeframes.includes(tf)) state.tf = tf;
}
window.addEventListener("hashchange", () => {
  readHash();
  renderPairs(pairSearch.value);
  renderTFs();
  updateHeader();
  updateChart();
  toast("Link loaded.");
});

// ===== Init =====
readHash();
renderPairs("");
renderTFs();
updateHeader();
updateSwitchUI();
updateChart();
renderSnapshot();
renderMeter();

// demo refresh
setInterval(() => {
  // Update "Updated" label in Nairobi time
  document.getElementById("updatedLabel").textContent = new Date().toLocaleString("en-GB", { timeZone: "Africa/Nairobi" });

  if (state.pro) renderSnapshot();

  driftStrength();
  renderMeter();
}, 3500);