/* =========================
   SITE JS (wrapped + premium)
   - Year
   - Mobile nav (fixed)
   - Reveal on scroll
   - Toast helper
   - Swiper testimonials (robust)
   - FX ticker (smoother, color = % change)
========================= */

(() => {
  "use strict";

  /* =========
     Year
  ========= */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* =========
     Mobile nav toggle (fixed: icon clicks)
  ========= */
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
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setMenu(!document.body.classList.contains("mobile-open"));
    });

    // Use closest('a') to detect anchor clicks even on icons
    mobilePanel.addEventListener("click", (e) => {
      if (e.target.closest("a")) setMenu(false);
    });

    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("mobile-open")) return;
      if (navWrap && !navWrap.contains(e.target)) setMenu(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* =========
     Reveal on scroll
  ========= */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add("show");
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* =========
     Toast
  ========= */
  function toast(msg) {
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.position = "fixed";
    t.style.right = "16px";
    t.style.bottom = "16px";
    t.style.zIndex = "9999";
    t.style.padding = "12px 14px";
    t.style.borderRadius = "14px";
    t.style.border = "1px solid rgba(255,255,255,.14)";
    t.style.background = "rgba(0,0,0,.75)";
    t.style.backdropFilter = "blur(12px)";
    t.style.color = "rgba(255,255,255,.92)";
    t.style.fontFamily = '"Jost", sans-serif';
    t.style.boxShadow = "0 18px 40px rgba(0,0,0,.45)";
    t.style.transform = "translateY(10px)";
    t.style.opacity = "0";
    t.style.transition = "opacity .25s ease, transform .25s ease";
    document.body.appendChild(t);

    requestAnimationFrame(() => {
      t.style.opacity = "1";
      t.style.transform = "translateY(0)";
    });

    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(10px)";
      setTimeout(() => t.remove(), 260);
    }, 2200);
  }
  window.toast = toast;

  /* =========
     Swiper testimonials (robust: check elements exist)
  ========= */
  const testimonialsEl = document.querySelector(".ubxTestimonials");
  if (testimonialsEl && window.Swiper) {
    // Verify that required navigation/pagination elements exist
    const hasPagination = testimonialsEl.querySelector(".swiper-pagination");
    const hasPrev = testimonialsEl.querySelector(".swiper-button-prev");
    const hasNext = testimonialsEl.querySelector(".swiper-button-next");

    new Swiper(".ubxTestimonials", {
      loop: true,
      grabCursor: true,
      spaceBetween: 16,
      autoHeight: true,
      pagination: hasPagination
        ? {
            el: ".ubxTestimonials .swiper-pagination",
            clickable: true,
          }
        : false,
      navigation:
        hasPrev && hasNext
          ? {
              nextEl: ".ubxTestimonials .swiper-button-next",
              prevEl: ".ubxTestimonials .swiper-button-prev",
            }
          : false,
      breakpoints: {
        0: { slidesPerView: 1 },
        900: { slidesPerView: 2 },
      },
    });
  }

  /* =========================================================
     FX TICKER – improved
     - Color now reflects the percentage change (30min baseline)
     - Smoother blending and drift
     - Better fallback handling
  ========================================================= */
  const track = document.getElementById("fxTrack");
  const statusEl = document.getElementById("fxStatus");
  if (!track || !statusEl) return; // exit if ticker not present

  const PAIRS = [
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "AUD/USD",
    "NZD/USD",
    "USD/CAD",
    "EUR/GBP",
    "EUR/JPY",
    "GBP/JPY",
    "USD/SEK",
    "USD/NOK",
  ];

  const QUOTE_CCY = [
    "EUR",
    "GBP",
    "JPY",
    "CHF",
    "AUD",
    "NZD",
    "CAD",
    "SEK",
    "NOK",
  ];

  const PREV_KEY = "fx_prev_quotes_v4"; // bumped version for new logic
  const BASE_KEY = "fx_baseline_30m_v1";

  const BASE_MS = 30 * 60 * 1000; // 30 minutes
  const API_REFRESH_MS = 15000; // 15 seconds
  const MICRO_TICK_MS = 1400; // 1.4 sec

  const MICRO_STEP_PCT = {
    DEFAULT: 0.006,
    JPY: 0.01,
  };

  let prev = {};
  let baseline = {};
  let lastApiPairs = null;
  let microPairs = {}; // current displayed values
  let lastDir = {}; // still used but color now derived from pct

  try {
    prev = JSON.parse(localStorage.getItem(PREV_KEY) || "{}");
  } catch {
    prev = {};
  }
  try {
    baseline = JSON.parse(localStorage.getItem(BASE_KEY) || "{}");
  } catch {
    baseline = {};
  }

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function fmtPrice(pair, val) {
    if (!Number.isFinite(val)) return "—";
    const isJPY = pair.includes("JPY");
    return val
      .toFixed(isJPY ? 3 : 5)
      .replace(/0+$/, "")
      .replace(/\.$/, "");
  }

  function pctText(x) {
    if (!Number.isFinite(x)) return "—";
    const sign = x > 0 ? "+" : "";
    return `${sign}${x.toFixed(3)}%`;
  }

  // Chip HTML now uses pct sign for color (dir)
  function chipHTML(pair, price, pct, dir) {
    const cls = dir > 0 ? "fx-up" : dir < 0 ? "fx-down" : "fx-flat";
    return `
      <span class="fx-chip" role="listitem">
        <span class="fx-chip__pair">${pair}</span>
        <span class="fx-chip__price">${price}</span>
        <span class="fx-chip__chg ${cls}">${pct}</span>
      </span>
    `;
  }

  function computePairs(usd) {
    for (const c of QUOTE_CCY) {
      if (!usd[c]) return null;
    }
    const U = usd;
    return {
      "EUR/USD": 1 / U.EUR,
      "GBP/USD": 1 / U.GBP,
      "USD/JPY": U.JPY,
      "USD/CHF": U.CHF,
      "AUD/USD": 1 / U.AUD,
      "NZD/USD": 1 / U.NZD,
      "USD/CAD": U.CAD,
      "EUR/GBP": U.GBP / U.EUR,
      "EUR/JPY": U.JPY / U.EUR,
      "GBP/JPY": U.JPY / U.GBP,
      "USD/SEK": U.SEK,
      "USD/NOK": U.NOK,
    };
  }

  function ensureBaseline(pairs) {
    const now = Date.now();
    const baseTime = Number(baseline?._t || 0);
    if (!baseTime || now - baseTime > BASE_MS) {
      baseline = { _t: now, ...pairs };
      localStorage.setItem(BASE_KEY, JSON.stringify(baseline));
    }
  }

  // Render with percentage-based color
  function render(pairsForDisplay) {
    const items = PAIRS.map((pair) => {
      const v = pairsForDisplay[pair];
      const price = fmtPrice(pair, v);

      const base = baseline[pair];
      const pct = Number.isFinite(base) && base !== 0 && Number.isFinite(v)
        ? ((v - base) / base) * 100
        : NaN;

      // Color now based on pct sign (more intuitive)
      const dir = pct > 0 ? 1 : pct < 0 ? -1 : 0;
      return chipHTML(pair, price, pctText(pct), dir);
    }).join("");

    track.innerHTML = `
      <div role="list" style="display:flex; gap:10px;">${items}</div>
      <div role="list" aria-hidden="true" style="display:flex; gap:10px;">${items}</div>
    `;
  }

 
  new Swiper(".ubxTestimonials", {
  loop: true,
  grabCursor: true,
  spaceBetween: 16,
  autoHeight: true,
  autoplay: {
    delay: 3000,        // 5 seconds between slides
    disableOnInteraction: false, // keeps autoplay after user swipes
    pauseOnMouseEnter: true,     // optional: pause when hovering
  },
  pagination: {
    el: ".ubxTestimonials .swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".ubxTestimonials .swiper-button-next",
    prevEl: ".ubxTestimonials .swiper-button-prev",
  },
  breakpoints: {
    0: { slidesPerView: 1 },
    900: { slidesPerView: 2 },
  },
});

 // Accordion functionality
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !expanded);
    const item = button.closest('.faq-item');
    item.classList.toggle('active', !expanded);
  });
});

  // Micro drift: tiny random walk, clamped to anchor
  function microDriftStep() {
    if (!lastApiPairs) return;

    // Initialize microPairs if empty
    if (!Object.keys(microPairs).length) {
      microPairs = { ...lastApiPairs };
    }

    for (const pair of PAIRS) {
      const v = microPairs[pair];
      const anchor = lastApiPairs[pair];
      if (!Number.isFinite(v) || !Number.isFinite(anchor)) continue;

      const isJPY = pair.includes("JPY");
      const maxStepPct = isJPY ? MICRO_STEP_PCT.JPY : MICRO_STEP_PCT.DEFAULT;
      const stepPct = (Math.random() - 0.5) * maxStepPct; // ±0.5 * maxStepPct
      const next = v * (1 + stepPct / 100);

      const maxDev = isJPY ? 0.12 : 0.08;
      const devPct = ((next - anchor) / anchor) * 100;

      let clamped = next;
      if (devPct > maxDev) clamped = anchor * (1 + maxDev / 100);
      if (devPct < -maxDev) clamped = anchor * (1 - maxDev / 100);

      microPairs[pair] = clamped;
    }

    // Save to localStorage for continuity across reloads
    prev = { ...microPairs };
    localStorage.setItem(PREV_KEY, JSON.stringify(prev));

    render(microPairs);
  }

  async function fetchRates() {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);

    try {
      setStatus("Updating…");
      const t0 = Date.now();

      const url =
        "https://api.frankfurter.dev/v1/latest?from=USD&to=" +
        QUOTE_CCY.join(",");

      const res = await fetch(url, { cache: "no-store", signal: controller.signal });
      if (!res.ok) throw new Error(`FX HTTP ${res.status}`);

      const data = await res.json();
      const pairs = computePairs(data.rates);
      if (!pairs) throw new Error("Missing FX symbols");

      ensureBaseline(pairs);
      lastApiPairs = pairs;

      // Blend with previous displayed values for smooth transition
      const start = Object.keys(microPairs).length
        ? microPairs
        : Object.keys(prev).length
        ? prev
        : pairs;

      microPairs = {};
      for (const p of PAIRS) {
        if (Number.isFinite(pairs[p]) && Number.isFinite(start[p])) {
          // 70% new, 30% old – smooth but responsive
          microPairs[p] = pairs[p] * 0.7 + start[p] * 0.3;
        } else {
          microPairs[p] = pairs[p] ?? start[p] ?? NaN;
        }
      }

      render(microPairs);

      const ms = Date.now() - t0;
      setStatus(`Updated ${new Date().toLocaleTimeString()} • ${ms}ms`);
    } catch (err) {
      console.error("FX feed failed:", err);
      setStatus("Feed unavailable");
    } finally {
      clearTimeout(timer);
    }
  }

  // Start ticker
  fetchRates();
  setInterval(fetchRates, API_REFRESH_MS);
  setInterval(microDriftStep, MICRO_TICK_MS);
})();