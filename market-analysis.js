// ===== UbuntuFX Market Analysis (minimal JS) =====

// Mobile nav toggle (works even after scroll)
const menuBtn = document.getElementById("menuBtn");
const mobilePanel = document.getElementById("mobilePanel");

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
    "pointerdown",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMenu(!document.body.classList.contains("mobile-open"));
    },
    { passive: false }
  );

  // Close when tapping a link
  mobilePanel.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setMenu(false);
  });

  // Close when tapping outside
  document.addEventListener(
    "pointerdown",
    (e) => {
      if (!document.body.classList.contains("mobile-open")) return;
      const isInside =
        e.target.closest(".nav-wrap") || e.target.closest("#mobilePanel");
      if (!isInside) setMenu(false);
    },
    { passive: true }
  );
}

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// FAQ accordion
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    if (!item) return;
    item.classList.toggle("open");
  });
});

// ===== Real-time EAT (Nairobi) Session Converter =====
const TZ = "Africa/Nairobi";
const eatClockEl = document.getElementById("eatClock");
const eatDateEl = document.getElementById("eatDate");
const sessionGrid = document.getElementById("sessionGrid");

// Practical, commonly used FX session windows in UTC (reference):
// Asia: 00:00–09:00 UTC
// London: 07:00–16:00 UTC
// New York: 13:00–22:00 UTC
// Overlap: 13:00–16:00 UTC
const SESSIONS = [
  { key: "asia", name: "Asia", icon: "fa-moon", startUTC: "00:00", endUTC: "09:00" },
  { key: "london", name: "London", icon: "fa-sun", startUTC: "07:00", endUTC: "16:00" },
  { key: "newyork", name: "New York", icon: "fa-sun", startUTC: "13:00", endUTC: "22:00" },
  { key: "overlap", name: "London–NY Overlap", icon: "fa-arrows-left-right", startUTC: "13:00", endUTC: "16:00" },
];

// Format helpers
const fmtTime = (date, timeZone) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

const fmtDate = (date, timeZone) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);

// Convert a UTC HH:MM to a Date object that represents that moment on "today" (UTC day)
function utcTodayDateFromHHMM(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const now = new Date();
  // Create a date at today's UTC date with hh:mm
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    h, m, 0, 0
  ));
}

// If end is "before" start (overnight), treat end as next day (UTC)
function normalizeWindow(startUtcDate, endUtcDate) {
  if (endUtcDate <= startUtcDate) {
    endUtcDate = new Date(endUtcDate.getTime() + 24 * 60 * 60 * 1000);
  }
  return { startUtcDate, endUtcDate };
}

// Given a session window (UTC dates for "today"), return the NEXT relevant window that contains now or is upcoming
function getRelevantWindow(startUtcDate, endUtcDate, now) {
  // If window already ended relative to now, move to next day
  if (now > endUtcDate) {
    startUtcDate = new Date(startUtcDate.getTime() + 24 * 60 * 60 * 1000);
    endUtcDate = new Date(endUtcDate.getTime() + 24 * 60 * 60 * 1000);
  }
  return { startUtcDate, endUtcDate };
}

function msToHuman(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function buildSessionCards() {
  if (!sessionGrid) return;

  sessionGrid.innerHTML = SESSIONS.map((s) => `
    <article class="session-card" data-session="${s.key}">
      <div class="session-head">
        <div class="session-name">
          <i class="fa-solid ${s.icon}"></i> ${s.name}
        </div>
        <span class="badge closed" data-badge>
          <i class="fa-solid fa-circle"></i> CLOSED
        </span>
      </div>

      <div class="session-times">
        <div class="row">
          <span>Open (UTC)</span>
          <strong data-utc-open>—</strong>
        </div>
        <div class="row">
          <span>Close (UTC)</span>
          <strong data-utc-close>—</strong>
        </div>
        <div class="row">
          <span>Open (EAT)</span>
          <strong data-eat-open>—</strong>
        </div>
        <div class="row">
          <span>Close (EAT)</span>
          <strong data-eat-close>—</strong>
        </div>
      </div>

      <div class="countdown" data-countdown>—</div>
    </article>
  `).join("");
}

function updateSessionsLive() {
  const now = new Date();

  // Live clock in EAT
  if (eatClockEl) eatClockEl.textContent = fmtTime(now, TZ);
  if (eatDateEl) eatDateEl.textContent = fmtDate(now, TZ);

  // Session cards
  SESSIONS.forEach((s) => {
    const card = document.querySelector(`[data-session="${s.key}"]`);
    if (!card) return;

    let startUtc = utcTodayDateFromHHMM(s.startUTC);
    let endUtc = utcTodayDateFromHHMM(s.endUTC);

    ({ startUtcDate: startUtc, endUtcDate: endUtc } = normalizeWindow(startUtc, endUtc));
    ({ startUtcDate: startUtc, endUtcDate: endUtc } = getRelevantWindow(startUtc, endUtc, now));

    // For display
    const utcOpenEl = card.querySelector("[data-utc-open]");
    const utcCloseEl = card.querySelector("[data-utc-close]");
    const eatOpenEl = card.querySelector("[data-eat-open]");
    const eatCloseEl = card.querySelector("[data-eat-close]");
    const badgeEl = card.querySelector("[data-badge]");
    const countdownEl = card.querySelector("[data-countdown]");

    if (utcOpenEl) utcOpenEl.textContent = s.startUTC;
    if (utcCloseEl) utcCloseEl.textContent = s.endUTC;

    // Convert by formatting the UTC date into EAT timezone
    const eatOpen = fmtTime(startUtc, TZ).slice(0, 5);
    const eatClose = fmtTime(endUtc, TZ).slice(0, 5);

    if (eatOpenEl) eatOpenEl.textContent = eatOpen;
    if (eatCloseEl) eatCloseEl.textContent = eatClose;

    const isOpen = now >= startUtc && now <= endUtc;

    if (badgeEl) {
      badgeEl.classList.toggle("open", isOpen);
      badgeEl.classList.toggle("closed", !isOpen);
      badgeEl.innerHTML = isOpen
        ? '<i class="fa-solid fa-circle"></i> OPEN'
        : '<i class="fa-solid fa-circle"></i> CLOSED';
    }

    if (countdownEl) {
      if (isOpen) {
        const left = endUtc - now;
        countdownEl.innerHTML = `Closes in <strong>${msToHuman(left)}</strong>`;
      } else {
        const until = startUtc - now;
        countdownEl.innerHTML = `Opens in <strong>${msToHuman(until)}</strong>`;
      }
    }
  });
}

// Init
buildSessionCards();
updateSessionsLive();
setInterval(updateSessionsLive, 1000);