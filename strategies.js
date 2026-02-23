/* =========================================================
   UbuntuFX Strategies — FULL JS (mobile menu + modal scroll fixed)
   Drop-in replacement for your current strategies.js
   ========================================================= */

// ===== Basics =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const updatedEl = document.getElementById("updated");
if (updatedEl) updatedEl.textContent = new Date().toLocaleString();

// =====================================================
// ✅ Mobile nav (works even after scroll)
// =====================================================
const menuBtn = document.getElementById("menuBtn");
const mobilePanel = document.getElementById("mobilePanel");
const navWrap = document.querySelector(".nav-wrap");

function isMenuOpen() {
  return document.body.classList.contains("mobile-open");
}

function setMenu(open) {
  document.body.classList.toggle("mobile-open", open);

  if (menuBtn) {
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  }
}

if (menuBtn && mobilePanel) {
  // pointerdown is more reliable than click on mobile
  menuBtn.addEventListener(
    "pointerdown",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMenu(!isMenuOpen());
    },
    { passive: false }
  );

  // close on any link tap
  mobilePanel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) setMenu(false);
  });

  // close if user taps outside the nav area
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!isMenuOpen()) return;
      if (!navWrap) return;

      // if tap is inside nav wrap, ignore
      if (navWrap.contains(e.target)) return;

      setMenu(false);
    },
    { capture: true }
  );

  // escape closes menu
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isMenuOpen()) setMenu(false);
  });

  // if resized to desktop, close menu
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && isMenuOpen()) setMenu(false);
  });
}

// =====================================================
// ✅ Toast
// =====================================================
const toastEl = document.getElementById("toast");
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// =====================================================
// ===== Strategy Data (Premium, insightful) =====
// =====================================================
const STRATEGIES = [
  {
    id: "trend-pullback",
    icon: "fa-wave-square",
    title: "Trend Pullback Continuation",
    style: "swing",
    level: "beginner",
    risk: "medium",
    horizon: "2–5 days",
    bestFor: "Clear directional markets / strong momentum",
    tags: ["Swing", "Structure", "Trend", "Risk: Medium"],
    desc:
      "A clean continuation model: define HTF trend, wait for pullback into a premium/discount zone or key EMA, then enter on confirmation. Designed for consistency and fewer trades with higher signal quality.",
    kpi: { setup: "HTF + LTF", trigger: "Break & retest", stop: "Below swing" },
    playbook: [
      "1) Define HTF bias (D1/H4): higher highs + higher lows (or lower lows + lower highs).",
      "2) Mark key level: prior demand/supply or 50 EMA / 200 EMA confluence.",
      "3) Wait for pullback + rejection (wick) or structure shift on LTF (15m/1h).",
      "4) Enter on break & retest / confirmation candle. Take partials at next liquidity."
    ],
    riskRules: [
      "Risk a fixed % per trade (e.g., 0.5%–1%).",
      "Stop goes beyond invalidation, not based on hope.",
      "No entry if distance-to-target < 1.5R.",
      "Avoid stacking correlated exposure (e.g., EURUSD + GBPUSD same direction)."
    ],
    whenToUse: [
      "When trend is obvious and volatility is stable.",
      "When news risk is low or already priced in.",
      "When pullback reaches a clean HTF level."
    ],
    whenToAvoid: [
      "Choppy / range-bound market.",
      "High-impact news within 30–60 minutes.",
      "Trend is extended with no pullback room."
    ]
  },
  {
    id: "london-breakout",
    icon: "fa-bolt",
    title: "London Range Breakout (With Filters)",
    style: "intraday",
    level: "intermediate",
    risk: "medium",
    horizon: "30–120 mins",
    bestFor: "London open volatility / sessions",
    tags: ["Intraday", "London", "Breakout", "Risk: Medium"],
    desc:
      "A premium intraday model: map the pre-London range, trade the breakout only when confirmation aligns (volume/impulse + retest). The edge is in the filters, not the breakout itself.",
    kpi: { setup: "Asia range", trigger: "Impulse + retest", stop: "Range midpoint" },
    playbook: [
      "1) Mark Asia range high/low (or pre-London consolidation).",
      "2) Wait for breakout with impulse candle (avoid slow drifts).",
      "3) Prefer retest entry: price returns to breakout level and holds.",
      "4) Targets: opposite liquidity + day’s ADR bands."
    ],
    riskRules: [
      "Skip the first breakout if it’s during high-impact news.",
      "If retest fails twice, stand down (no revenge trades).",
      "Use time stop: if no follow-through in 20–30 mins, exit.",
      "Only 1–2 attempts per session."
    ],
    whenToUse: [
      "London open / early NY when volume rises.",
      "Clear range with defined boundaries.",
      "Trend alignment from H1/H4."
    ],
    whenToAvoid: [
      "Holiday / low-liquidity sessions.",
      "Range too wide (bad R:R).",
      "News spikes that distort structure."
    ]
  },
  {
    id: "liquidity-sweep",
    icon: "fa-chess",
    title: "Liquidity Sweep + Structure Shift (SMC)",
    style: "intraday",
    level: "advanced",
    risk: "high",
    horizon: "15–90 mins",
    bestFor: "Stop hunts near key highs/lows",
    tags: ["Advanced", "Liquidity", "SMC", "Risk: High"],
    desc:
      "Institutional-style framework: identify liquidity pools, wait for a sweep and a confirmed structure shift, then trade the move back into range. Powerful when executed patiently and avoided during random volatility.",
    kpi: { setup: "Liquidity map", trigger: "MSS + OB", stop: "Beyond sweep" },
    playbook: [
      "1) Mark obvious liquidity (equal highs/lows, prior day H/L).",
      "2) Wait for sweep (fast push through level) and strong rejection.",
      "3) Confirm MSS (market structure shift) on LTF.",
      "4) Enter on OB/FVG retest with invalidation beyond sweep extreme."
    ],
    riskRules: [
      "Lower size due to volatility (0.25%–0.5% risk).",
      "Never enter without MSS confirmation.",
      "Avoid illiquid pairs/sessions.",
      "Stop must be beyond sweep—not inside noise."
    ],
    whenToUse: [
      "At session highs/lows near major levels.",
      "When price is approaching obvious stops.",
      "When LTF structure becomes clear post-sweep."
    ],
    whenToAvoid: [
      "Mid-range entries with no liquidity objective.",
      "During major news releases.",
      "When spreads widen / slippage risk is high."
    ]
  },
  {
    id: "mean-reversion",
    icon: "fa-arrows-left-right",
    title: "Mean Reversion at Range Extremes",
    style: "intraday",
    level: "beginner",
    risk: "low",
    horizon: "15–60 mins",
    bestFor: "Stable ranges / slow markets",
    tags: ["Intraday", "Range", "Discipline", "Risk: Low"],
    desc:
      "A disciplined model for range conditions: fade extremes only at validated boundaries with clear invalidation. Premium execution means waiting for the right extreme—not forcing entries.",
    kpi: { setup: "Range map", trigger: "Rejection", stop: "Outside range" },
    playbook: [
      "1) Define range boundaries and midpoint (value).",
      "2) Only consider trades near extremes (top/bottom 10–15%).",
      "3) Enter after rejection (wick + close back inside).",
      "4) Targets: midpoint first, then opposite extreme if structure holds."
    ],
    riskRules: [
      "Do not trade if range is breaking (impulse move).",
      "One entry per extreme; if invalidated, stop trading the range.",
      "Use small stops only if boundaries are clean.",
      "Avoid during high-impact events."
    ],
    whenToUse: [
      "When price respects levels repeatedly.",
      "Low volatility, stable session behavior.",
      "Clear mean (midpoint) exists."
    ],
    whenToAvoid: [
      "Before/after major news.",
      "Strong trends (reversion gets steamrolled).",
      "Ranges that are too tight (spread eats edge)."
    ]
  },
  {
    id: "carry-yield",
    icon: "fa-mountain",
    title: "Carry & Macro Yield Positioning",
    style: "position",
    level: "intermediate",
    risk: "medium",
    horizon: "Weeks–Months",
    bestFor: "Macro trends / rate differentials",
    tags: ["Position", "Macro", "Yield", "Risk: Medium"],
    desc:
      "Longer-term framework driven by rates and policy direction. High-end positioning prioritizes trend + carry, with strict drawdown rules and event awareness (central bank surprises).",
    kpi: { setup: "Macro bias", trigger: "HTF breakout", stop: "Weekly invalidation" },
    playbook: [
      "1) Define macro bias: rates, inflation trend, central bank stance.",
      "2) Align with HTF structure (weekly/daily trend).",
      "3) Add on pullbacks; avoid adding at extremes.",
      "4) Track events: CPI, rate decisions, guidance shifts."
    ],
    riskRules: [
      "Use wide stops with smaller size.",
      "Risk split across entries (scale-in) not one big entry.",
      "If regime shifts, exit—don’t marry the trade.",
      "Diversify: don’t load only USD exposure."
    ],
    whenToUse: [
      "Clear policy divergence (one hawkish, one dovish).",
      "Trending HTF market.",
      "Carry aligns with direction."
    ],
    whenToAvoid: [
      "Uncertain central bank regimes.",
      "High geopolitical risk shocks.",
      "Mean-reverting choppy markets."
    ]
  },
  {
    id: "news-framework",
    icon: "fa-calendar-days",
    title: "High-Impact News Framework (Risk-Controlled)",
    style: "event",
    level: "advanced",
    risk: "high",
    horizon: "Minutes–1 hour",
    bestFor: "CPI / NFP / Rate Decisions",
    tags: ["Event", "Volatility", "Rules", "Risk: High"],
    desc:
      "A controlled approach to news volatility. The goal is not ‘fast clicks’ — it’s structured participation after the market reveals direction. This is for disciplined traders only.",
    kpi: { setup: "News map", trigger: "Post-spike structure", stop: "Spike extreme" },
    playbook: [
      "1) Identify event + expected volatility; map key levels beforehand.",
      "2) Avoid pre-release gambling. Let the spike occur.",
      "3) Wait for post-spike structure: consolidation + break.",
      "4) Enter on retest with wide volatility-aware stops."
    ],
    riskRules: [
      "Half size or less due to slippage risk.",
      "No market orders during release.",
      "One attempt only; if missed, stand down.",
      "Use hard stops; accept the risk."
    ],
    whenToUse: [
      "Only if spreads are normal and platform is stable.",
      "After release, once structure forms.",
      "When you have strict rules and experience."
    ],
    whenToAvoid: [
      "Thin liquidity / widened spreads.",
      "If you can’t accept slippage.",
      "If you’re emotional or chasing losses."
    ]
  },
  {
    id: "correlation-spread",
    icon: "fa-link",
    title: "Correlation & Spread Rebalance",
    style: "swing",
    level: "advanced",
    risk: "medium",
    horizon: "1–4 days",
    bestFor: "Temporary divergence in correlated assets",
    tags: ["Swing", "Correlation", "Quant-lite", "Risk: Medium"],
    desc:
      "High-end approach: track correlated instruments, wait for abnormal divergence, then trade the reversion with strict invalidation. Great for disciplined traders who like rules and statistics.",
    kpi: { setup: "Correlation map", trigger: "Divergence + revert", stop: "New regime" },
    playbook: [
      "1) Choose stable correlations (EURUSD vs GBPUSD, AUDUSD vs Gold).",
      "2) Measure divergence (simple % move or Z-score).",
      "3) Confirm with structure (don’t fight strong trends blindly).",
      "4) Enter with target on mean / convergence, stop on regime shift."
    ],
    riskRules: [
      "Don’t force correlation—markets change.",
      "Smaller risk if volatility spikes.",
      "Avoid entries near major news events.",
      "If correlation breaks, exit early."
    ],
    whenToUse: [
      "Stable regime, correlations holding.",
      "Clear divergence from mean.",
      "No immediate news catalysts."
    ],
    whenToAvoid: [
      "During regime shifts (rates shocks).",
      "When correlations weaken.",
      "Highly trending markets with momentum."
    ]
  }
];

// =====================================================
// ===== State
// =====================================================
const state = {
  style: "all",
  level: "all",
  risk: "all",
  query: ""
};

// =====================================================
// ===== DOM
// =====================================================
const cardsEl = document.getElementById("cards");
const resultBadge = document.getElementById("resultBadge");
const searchEl = document.getElementById("search");

// =====================================================
// Helpers
// =====================================================
function setActive(rowEl, attr, value) {
  rowEl.querySelectorAll(".filter-pill").forEach((p) =>
    p.classList.toggle("active", p.getAttribute(attr) === value)
  );
}

function matches(s) {
  const q = state.query.trim().toLowerCase();
  const hay = (s.title + " " + s.desc + " " + s.tags.join(" ")).toLowerCase();

  const okStyle = state.style === "all" || s.style === state.style;
  const okLevel = state.level === "all" || s.level === state.level;
  const okRisk = state.risk === "all" || s.risk === state.risk;
  const okQuery = !q || hay.includes(q);

  return okStyle && okLevel && okRisk && okQuery;
}

function riskLabel(r) {
  if (r === "low") return '<span class="tag"><i class="fa-solid fa-shield"></i> Risk: Low</span>';
  if (r === "medium") return '<span class="tag"><i class="fa-solid fa-shield-halved"></i> Risk: Medium</span>';
  return '<span class="tag"><i class="fa-solid fa-triangle-exclamation"></i> Risk: High</span>';
}

// =====================================================
// Render
// =====================================================
function render() {
  if (!cardsEl || !resultBadge) return;

  const list = STRATEGIES.filter(matches);
  resultBadge.innerHTML = `<i class="fa-solid fa-layer-group" style="color:var(--gold)"></i> ${list.length} result${
    list.length === 1 ? "" : "s"
  }`;

  if (!list.length) {
    cardsEl.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <h3 style="font-size:18px;"><i class="fa-solid fa-circle-info" style="color:var(--gold);margin-right:10px;"></i>No strategies found</h3>
        <p style="margin-top:6px;">Try removing filters or search for broader terms like <b style="color:rgba(255,255,255,.92)">trend</b>, <b style="color:rgba(255,255,255,.92)">breakout</b>, or <b style="color:rgba(255,255,255,.92)">range</b>.</p>
      </div>
    `;
    return;
  }

  cardsEl.innerHTML = list
    .map(
      (s) => `
    <article class="s-card" data-id="${s.id}">
      <div class="s-head">
        <div>
          <div class="s-title">${s.title}</div>
          <div class="tiny" style="margin-top:4px;">Best for: ${s.bestFor}</div>
        </div>
        <div class="s-icon"><i class="fa-solid ${s.icon}"></i></div>
      </div>

      <div class="tags">
        <span class="tag"><i class="fa-solid fa-compass"></i> ${s.style.toUpperCase()}</span>
        <span class="tag"><i class="fa-solid fa-signal"></i> ${s.level.toUpperCase()}</span>
        ${riskLabel(s.risk)}
        <span class="tag"><i class="fa-solid fa-clock"></i> ${s.horizon}</span>
      </div>

      <p style="margin-top:4px;">${s.desc}</p>

      <div class="kpi">
        <div><strong>${s.kpi.setup}</strong><span>Setup</span></div>
        <div><strong>${s.kpi.trigger}</strong><span>Trigger</span></div>
        <div><strong>${s.kpi.stop}</strong><span>Stop Logic</span></div>
      </div>

      <div class="s-actions">
        <a href="#" class="link" data-open="${s.id}">
          View Playbook <i class="fa-solid fa-arrow-right"></i>
        </a>
        <a href="livechart.html" class="btn btn-ghost" style="padding:10px 12px;border-radius:14px;">
          <i class="fa-solid fa-chart-line"></i> Open Chart
        </a>
      </div>
    </article>
  `
    )
    .join("");
}

// =====================================================
// ✅ Modal (scroll on mobile fixed + background scroll lock)
// =====================================================
const modal = document.getElementById("modal");
const mClose = document.getElementById("mClose");
const mTitle = document.getElementById("mTitle");
const mTags = document.getElementById("mTags");
const mDesc = document.getElementById("mDesc");
const mPlaybook = document.getElementById("mPlaybook");
const mRisk = document.getElementById("mRisk");
const mWhen = document.getElementById("mWhen");
const mAvoid = document.getElementById("mAvoid");

let _scrollY = 0;

function lockBodyScroll() {
  _scrollY = window.scrollY || 0;
  document.body.style.position = "fixed";
  document.body.style.top = `-${_scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";
}

function unlockBodyScroll() {
  const y = _scrollY;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  window.scrollTo(0, y);
}

function li(icon, text) {
  return `<div class="li"><i class="fa-solid ${icon}"></i><div>${text}</div></div>`;
}

function openModalUI() {
  if (!modal) return;

  // close mobile menu to avoid overlay conflicts
  if (isMenuOpen()) setMenu(false);

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  // Force scrollable modal content on mobile
  const box = modal.querySelector(".modal-box");
  const body = modal.querySelector(".modal-body");
  if (box) box.style.maxHeight = "88vh";
  if (body) {
    body.style.maxHeight = "calc(88vh - 64px)";
    body.style.overflow = "auto";
    body.style.webkitOverflowScrolling = "touch";
  }

  lockBodyScroll();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  unlockBodyScroll();
}

function openModal(id) {
  const s = STRATEGIES.find((x) => x.id === id);
  if (!s || !modal) return;

  if (mTitle) mTitle.textContent = s.title;

  if (mTags) {
    mTags.innerHTML = `
      <span class="tag"><i class="fa-solid fa-compass"></i> ${s.style.toUpperCase()}</span>
      <span class="tag"><i class="fa-solid fa-signal"></i> ${s.level.toUpperCase()}</span>
      ${riskLabel(s.risk)}
      <span class="tag"><i class="fa-solid fa-clock"></i> ${s.horizon}</span>
    `;
  }

  if (mDesc) mDesc.textContent = s.desc;

  if (mPlaybook) mPlaybook.innerHTML = s.playbook.map((x) => li("fa-check", x)).join("");
  if (mRisk) mRisk.innerHTML = s.riskRules.map((x) => li("fa-shield-halved", x)).join("");
  if (mWhen) mWhen.innerHTML = s.whenToUse.map((x) => li("fa-circle-check", x)).join("");
  if (mAvoid) mAvoid.innerHTML = s.whenToAvoid.map((x) => li("fa-triangle-exclamation", x)).join("");

  openModalUI();
  toast("Playbook opened.");
}

// close handlers
if (mClose) mClose.addEventListener("click", closeModal);

if (modal) {
  // click outside modal-box closes
  modal.addEventListener("click", (e) => {
    const box = e.target.closest(".modal-box");
    if (!box) closeModal();
  });
}

// Esc closes modal or menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (modal && modal.classList.contains("show")) closeModal();
    if (isMenuOpen()) setMenu(false);
  }
});

// =====================================================
// Filters wiring
// =====================================================
function wireRow(rowId, key, attr) {
  const row = document.getElementById(rowId);
  if (!row) return;

  row.addEventListener("click", (e) => {
    const pill = e.target.closest(".filter-pill");
    if (!pill) return;
    const v = pill.getAttribute(attr);
    state[key] = v;
    setActive(row, attr, v);
    render();
  });
}

wireRow("styleRow", "style", "data-style");
wireRow("levelRow", "level", "data-level");
wireRow("riskRow", "risk", "data-risk");

if (searchEl) {
  searchEl.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });
}

// =====================================================
// Auto-match (simple heuristic)
// =====================================================
function autoMatch() {
  const q = (state.query || "").toLowerCase();

  if (q.includes("news") || q.includes("cpi") || q.includes("nfp")) {
    state.style = "event";
    state.level = "advanced";
    state.risk = "high";
  } else if (q.includes("liquidity") || q.includes("smc") || q.includes("order")) {
    state.style = "intraday";
    state.level = "advanced";
    state.risk = "high";
  } else if (q.includes("trend") || q.includes("pullback")) {
    state.style = "swing";
    state.level = "beginner";
    state.risk = "medium";
  } else if (q.includes("range") || q.includes("mean")) {
    state.style = "intraday";
    state.level = "beginner";
    state.risk = "low";
  } else {
    state.style = "intraday";
    state.level = "intermediate";
    state.risk = "medium";
  }

  const styleRow = document.getElementById("styleRow");
  const levelRow = document.getElementById("levelRow");
  const riskRow = document.getElementById("riskRow");

  if (styleRow) setActive(styleRow, "data-style", state.style);
  if (levelRow) setActive(levelRow, "data-level", state.level);
  if (riskRow) setActive(riskRow, "data-risk", state.risk);

  render();
  toast("Matched a strategy profile.");
}

const btnMatch = document.getElementById("btnMatch");
if (btnMatch) btnMatch.addEventListener("click", autoMatch);

const btnOpenTop = document.getElementById("btnOpenTop");
if (btnOpenTop) btnOpenTop.addEventListener("click", autoMatch);

const btnReset = document.getElementById("btnReset");
if (btnReset) {
  btnReset.addEventListener("click", () => {
    state.style = "all";
    state.level = "all";
    state.risk = "all";
    state.query = "";

    if (searchEl) searchEl.value = "";

    const styleRow = document.getElementById("styleRow");
    const levelRow = document.getElementById("levelRow");
    const riskRow = document.getElementById("riskRow");

    if (styleRow) setActive(styleRow, "data-style", "all");
    if (levelRow) setActive(levelRow, "data-level", "all");
    if (riskRow) setActive(riskRow, "data-risk", "all");

    render();
    toast("Filters reset.");
  });
}

// =====================================================
// Newsletter (demo)
// =====================================================
const newsletter = document.getElementById("newsletter");
if (newsletter) {
  newsletter.addEventListener("submit", (e) => {
    e.preventDefault();
    toast("Subscribed (demo). Wire this to your backend/email tool.");
    e.target.reset();
  });
}

// =====================================================
// ✅ Event delegation: open modal from dynamically rendered cards
// =====================================================
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) {
    e.preventDefault();
    openModal(open.getAttribute("data-open"));
  }
});

// Init
render();