  // year
    document.getElementById("year").textContent = new Date().getFullYear();

    // mobile nav dropdown (works)
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");

    function setMenu(open){
      document.body.classList.toggle("mobile-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    }

    menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("mobile-open")));

    mobilePanel.addEventListener("click", (e) => {
      if (e.target.tagName === "A") setMenu(false);
    });

    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("mobile-open")) return;
      if (!document.querySelector(".nav-wrap").contains(e.target)) setMenu(false);
    });