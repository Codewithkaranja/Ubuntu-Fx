// learn.js – streamlined for current HTML

(() => {
  "use strict";

  // ===== Basics =====
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const updatedEl = document.getElementById("updated");
  if (updatedEl) updatedEl.textContent = new Date().toLocaleString();

  // ===== Mobile nav (reliable on mobile + after scroll) =====
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  const navWrap = document.querySelector(".nav-wrap");

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
    menuBtn.addEventListener(
      "pointerup",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenu(!document.body.classList.contains("mobile-open"));
      },
      { passive: false }
    );

    mobilePanel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener(
      "pointerdown",
      (e) => {
        if (!document.body.classList.contains("mobile-open")) return;
        if (navWrap && navWrap.contains(e.target)) return;
        setMenu(false);
      },
      true
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // ===== Toast =====
  const toastEl = document.getElementById("toast");
  function toast(msg) {
    if (!toastEl) return;

    toastEl.textContent = msg;
    toastEl.classList.add("show");

    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }
  window.toast = toast;

  // ===== Curriculum data (used by modal) =====
  const MODULES = [
    {
      id: "pips-lots-leverage",
      title: "Forex Basics: Pips, Lots & Leverage",
      duration: "20 min",
      desc: "Learn how pricing works, how pip value is calculated, and why leverage magnifies both gains and losses.",
      tags: ["Beginner", "Basics", "Foundation"],
      topic: "basics",
      level: "beginner",
      outcomes: [
        "Calculate pip value for major pairs.",
        "Understand lot sizing (micro/mini/standard).",
        "Identify leverage traps and margin risk.",
      ],
      checklist: [
        "Do I know my pip value for this pair?",
        "Is my lot size aligned with my stop distance?",
        "Do I understand margin required before entry?",
      ],
      next: ["Continue: Reading Quotes & Spreads"],
    },
    {
      id: "quotes-spreads",
      title: "How to Read a Forex Quote (Bid/Ask & Spread)",
      duration: "25 min",
      desc: "Master base vs quote currency, bid/ask pricing, and how spreads affect entries, stops, and profitability.",
      tags: ["Beginner", "Basics", "Execution"],
      topic: "basics",
      level: "beginner",
      outcomes: [
        "Interpret quote direction correctly.",
        "Understand spread costs and session differences.",
        "Avoid stop placement inside spread noise.",
      ],
      checklist: [
        "Is spread currently normal for this session?",
        "Is my stop beyond spread + volatility?",
        "Am I trading a liquid pair for my level?",
      ],
      next: ["Continue: Order Types & Execution"],
    },
    {
      id: "order-types",
      title: "Order Types: Market, Limit, Stop (and When to Use Each)",
      duration: "35 min",
      desc: "Execution clarity: when to use market orders, when to place limits, and how stop orders behave during volatility.",
      tags: ["Beginner", "Basics", "Execution"],
      topic: "basics",
      level: "beginner",
      outcomes: [
        "Choose the correct order for your setup.",
        "Avoid slippage mistakes around news.",
        "Place orders with defined invalidation.",
      ],
      checklist: [
        "Am I entering on confirmation or pulling price?",
        "Does a limit order make sense (retest)?",
        "Is a market order safe given spreads/volatility?",
      ],
      next: ["Continue: Risk Management Essentials"],
    },
    {
      id: "beginner-plan",
      title: "Your First Trading Plan (Rules, Not Hopes)",
      duration: "40 min",
      desc: "Build a simple plan: setup definition, entry trigger, invalidation, risk per trade, and a repeatable checklist.",
      tags: ["Beginner", "Risk", "Discipline"],
      topic: "risk",
      level: "beginner",
      outcomes: [
        "Write a 1-page plan you can follow daily.",
        "Define your maximum daily/weekly drawdown.",
        "Create a pre-trade checklist to avoid impulse entries.",
      ],
      checklist: [
        "What is my setup and why does it work?",
        "Where is invalidation (not discomfort)?",
        "Is my risk fixed and acceptable?",
      ],
      next: ["Move to Intermediate: Support & Resistance"],
    },
    {
      id: "sr-foundation",
      title: "Support & Resistance (Levels That Actually Matter)",
      duration: "45 min",
      desc: "Learn how to mark meaningful levels using structure, liquidity, and timeframes—not random lines.",
      tags: ["Intermediate", "Technical", "Structure"],
      topic: "technical",
      level: "intermediate",
      outcomes: [
        "Mark HTF levels that price respects.",
        "Identify role reversal and level quality.",
        "Avoid clutter and overfitting.",
      ],
      checklist: [
        "Is this level HTF or just noise?",
        "Has it been respected multiple times?",
        "Is there liquidity nearby (stops/targets)?",
      ],
      next: ["Continue: Candles & Confirmation"],
    },
    {
      id: "candles-sentiment",
      title: "Candlesticks & Confirmation (Momentum vs Exhaustion)",
      duration: "40 min",
      desc: "Interpret candles as information: rejection, absorption, momentum, and where retail patterns fail.",
      tags: ["Intermediate", "Technical", "Execution"],
      topic: "technical",
      level: "intermediate",
      outcomes: [
        "Read rejection and momentum candles correctly.",
        "Use confirmation without late entries.",
        "Avoid trading ‘pretty’ patterns in bad context.",
      ],
      checklist: [
        "Is this candle reacting at a real level?",
        "Does volume/impulse support the story?",
        "Is confirmation improving my R:R or ruining it?",
      ],
      next: ["Continue: Moving Averages & Trend Filters"],
    },
    {
      id: "risk-sizing",
      title: "Risk Management: Position Sizing & Stop Placement",
      duration: "35 min",
      desc: "Professional risk foundations: fixed risk %, stop logic, and sizing based on invalidation—not emotions.",
      tags: ["Intermediate", "Risk", "Professional"],
      topic: "risk",
      level: "intermediate",
      outcomes: [
        "Size trades based on stop distance.",
        "Set stops beyond invalidation logically.",
        "Build consistency through risk budgeting.",
      ],
      checklist: [
        "Is my stop logical (invalidation) not emotional?",
        "Is R:R ≥ 1.5R with clean target liquidity?",
        "Am I stacking correlated risk?",
      ],
      next: ["Continue: Journaling Like a Pro"],
    },
    {
      id: "journaling",
      title: "Trading Journal: The Fastest Way to Improve",
      duration: "55 min",
      desc: "Track rules followed, screenshots, mistakes, and patterns. Elite improvement is data + reflection.",
      tags: ["Intermediate", "Psychology", "Performance"],
      topic: "psychology",
      level: "intermediate",
      outcomes: [
        "Identify top mistakes and fix them systematically.",
        "Measure rule adherence (not just wins/losses).",
        "Build a playbook of your best setups.",
      ],
      checklist: [
        "Did I follow my rules?",
        "What was the market condition (trend/range/news)?",
        "What will I do differently next time?",
      ],
      next: ["Move to Advanced: Structure & Liquidity"],
    },
    {
      id: "structure-liquidity",
      title: "Market Structure & Liquidity Pools",
      duration: "60 min",
      desc: "Understand BOS/CHOCH concepts, where liquidity sits, and why price targets highs/lows before moving.",
      tags: ["Advanced", "Structure", "Liquidity"],
      topic: "technical",
      level: "advanced",
      outcomes: [
        "Map liquidity targets (equal highs/lows, PDH/PDL).",
        "Recognize structure shift before entry.",
        "Avoid chasing moves after liquidity is taken.",
      ],
      checklist: [
        "Where is liquidity likely to be taken next?",
        "Do I have structure confirmation?",
        "Is my invalidation beyond the sweep?",
      ],
      next: ["Continue: Order Blocks & FVG"],
    },
    {
      id: "macro-policy",
      title: "Central Bank Narratives & Policy (Fed/ECB/BoJ)",
      duration: "55 min",
      desc: "Macro framework: rates, inflation, guidance, and how narratives drive trends—especially in FX.",
      tags: ["Advanced", "Fundamental", "Macro"],
      topic: "fundamental",
      level: "advanced",
      outcomes: [
        "Track policy direction and market expectations.",
        "Understand why trends persist for weeks/months.",
        "Avoid being blindsided by key macro dates.",
      ],
      checklist: [
        "What is the current narrative (risk-on/off)?",
        "What does the market expect vs reality?",
        "Are high-impact events approaching?",
      ],
      next: ["Pair this with: Economic Calendar + Market Analysis"],
    },
  ];

  // ===== Modal functionality =====
  const modal = document.getElementById("modal");
  const mClose = document.getElementById("mClose");
  const mTitle = document.getElementById("mTitle");
  const mTags = document.getElementById("mTags");
  const mDesc = document.getElementById("mDesc");
  const mOutcomes = document.getElementById("mOutcomes");
  const mChecklist = document.getElementById("mChecklist");
  const mNext = document.getElementById("mNext");

  function topicIcon(topic) {
    const map = {
      basics: "fa-book",
      technical: "fa-chart-simple",
      fundamental: "fa-landmark",
      risk: "fa-shield-halved",
      psychology: "fa-heart-pulse",
    };
    return map[topic] || "fa-layer-group";
  }

  function li(icon, text) {
    return `<div class="li"><i class="fa-solid ${icon}"></i><div>${text}</div></div>`;
  }

  function openModal(id) {
    const m = MODULES.find((x) => x.id === id);
    if (!m || !modal) return;

    if (mTitle) mTitle.textContent = m.title;

    if (mTags) {
      mTags.innerHTML = `
        <span class="tag"><i class="fa-solid ${topicIcon(m.topic)}"></i> ${m.topic.toUpperCase()}</span>
        <span class="tag"><i class="fa-solid fa-signal"></i> ${m.level.toUpperCase()}</span>
        <span class="tag"><i class="fa-regular fa-clock"></i> ${m.duration}</span>
      `;
    }

    if (mDesc) mDesc.textContent = m.desc;
    if (mOutcomes) mOutcomes.innerHTML = m.outcomes.map((x) => li("fa-check", x)).join("");
    if (mChecklist) mChecklist.innerHTML = m.checklist.map((x) => li("fa-list-check", x)).join("");
    if (mNext) mNext.innerHTML = m.next.map((x) => li("fa-arrow-right", x)).join("");

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    toast("Module opened.");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  mClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ===== Open modal from "Start Beginner Track" button =====
  const btnStart = document.getElementById("btnStart");
  if (btnStart) {
    btnStart.addEventListener("click", (e) => {
      e.preventDefault();
      openModal("pips-lots-leverage"); // opens the first beginner module
    });
  }

  // ===== Newsletter form demo =====
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Subscribed (demo). Wire this to your backend/email tool.");
      newsletterForm.reset();
    });
  }

  // ===== Optional: close mobile menu on resize (if needed) =====
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && document.body.classList.contains("mobile-open")) {
      setMenu(false);
    }
  });
})();