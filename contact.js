// ===== Contact.js (premium + reliable mobile toggle) =====
(() => {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Elements
  const menuBtn = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");
  const navWrap = document.querySelector(".nav-wrap");

  if (!menuBtn || !mobilePanel || !navWrap) return;

  // Helpers
  const isOpen = () => document.body.classList.contains("mobile-open");

  function setMenu(open) {
    document.body.classList.toggle("mobile-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  }

  // Start closed (safe default)
  setMenu(false);

  // Toggle (use pointerdown for best mobile reliability)
  menuBtn.addEventListener(
    "pointerdown",
    (e) => {
      e.preventDefault();
      e.stopPropagation(); // prevents outside-click handler from immediately closing
      setMenu(!isOpen());
    },
    { passive: false }
  );

  // Close when clicking a link inside the panel
  mobilePanel.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link) setMenu(false);
  });

  // Close on outside click / tap
  document.addEventListener("pointerdown", (e) => {
    if (!isOpen()) return;
    if (!navWrap.contains(e.target)) setMenu(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) setMenu(false);
  });

  // If user resizes to desktop, force close
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && isOpen()) setMenu(false);
  });
})();