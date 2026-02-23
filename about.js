// Year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile nav (reliable on mobile: pointerdown + outside click + ESC)
const menuBtn = document.getElementById("menuBtn");
const mobilePanel = document.getElementById("mobilePanel");
const navWrap = document.querySelector(".nav-wrap");

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

  // Close when tapping a link
  mobilePanel.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setMenu(false);
  });

  // Close when clicking outside
  document.addEventListener("pointerdown", (e) => {
    if (!document.body.classList.contains("mobile-open")) return;
    if (!navWrap.contains(e.target)) setMenu(false);
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
}