// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav toggle
const menuBtn = document.getElementById("menuBtn");
const mobilePanel = document.getElementById("mobilePanel");
const navWrap = document.querySelector(".nav-wrap");

function setMenu(open){
  document.body.classList.toggle("mobile-open", open);
  menuBtn?.setAttribute("aria-expanded", String(open));
  if (menuBtn){
    menuBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  }
}

if (menuBtn && mobilePanel){
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setMenu(!document.body.classList.contains("mobile-open"));
  });

  mobilePanel.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setMenu(false);
  });

  document.addEventListener("click", (e) => {
    if (!document.body.classList.contains("mobile-open")) return;
    if (navWrap && !navWrap.contains(e.target)) setMenu(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) en.target.classList.add("show");
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// Demo toast
function toast(msg){
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


// Demo market tick helpers
function jitter(value, step){
  const n = Number(value);
  if (!Number.isFinite(n)) return value;
  const delta = (Math.random() - 0.5) * step;
  return (n + delta).toFixed(String(value).includes(".") ? 4 : 2);
}

// Update demo market values + sync to mobile
function updateMarket(){
  const eur = document.getElementById("eurusd");
  const gbp = document.getElementById("gbpusd");
  const jpy = document.getElementById("usdjpy");

  if (!eur || !gbp || !jpy) return;

  eur.textContent = jitter(eur.textContent, 0.0006);
  gbp.textContent = jitter(gbp.textContent, 0.0007);
  jpy.textContent = jitter(jpy.textContent, 0.08);

  // Sync mobile values
  const eurM = document.getElementById("eurusd_m");
  const gbpM = document.getElementById("gbpusd_m");
  const jpyM = document.getElementById("usdjpy_m");

  if (eurM) eurM.textContent = eur.textContent;
  if (gbpM) gbpM.textContent = gbp.textContent;
  if (jpyM) jpyM.textContent = jpy.textContent;
}

updateMarket();
setInterval(updateMarket, 3200);


// Mobile dock "swiper-feel" rotation (custom)
const dockTrack = document.getElementById("dockTrack");
if (dockTrack){
  const slides = Array.from(dockTrack.querySelectorAll(".dock-slide"));
  let idx = 0;

  function showSlide(i){
    slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
  }

  if (slides.length){
    showSlide(idx);
    setInterval(() => {
      idx = (idx + 1) % slides.length;
      showSlide(idx);
    }, 2200);
  }
}
const tSwiper = new Swiper(".ubxTestimonials", {
  loop: true,
  grabCursor: true,
  spaceBetween: 16,
  autoHeight: true,
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
