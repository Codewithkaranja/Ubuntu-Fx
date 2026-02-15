 // Year
    document.getElementById("year").textContent = new Date().getFullYear();

    // Mobile nav toggle (dropdown)
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");

    function setMenu(open){
      document.body.classList.toggle("mobile-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    }

    menuBtn.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("mobile-open");
      setMenu(!isOpen);
    });

    // Close menu when clicking a link
    mobilePanel.addEventListener("click", (e) => {
      if (e.target.tagName === "A") setMenu(false);
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      const isOpen = document.body.classList.contains("mobile-open");
      if (!isOpen) return;
      const navWrap = document.querySelector(".nav-wrap");
      if (!navWrap.contains(e.target)) setMenu(false);
    });

    // Subtle reveal on scroll
    const revealEls = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) en.target.classList.add("show");
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

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

    // Demo market tick (optional)
    function jitter(value, step){
      const n = Number(value);
      const delta = (Math.random() - 0.5) * step;
      return (n + delta).toFixed(String(value).includes(".") ? 4 : 2);
    }
    setInterval(() => {
      const eur = document.getElementById("eurusd");
      const gbp = document.getElementById("gbpusd");
      const jpy = document.getElementById("usdjpy");
      eur.textContent = jitter(eur.textContent, 0.0006);
      gbp.textContent = jitter(gbp.textContent, 0.0007);
      jpy.textContent = jitter(jpy.textContent, 0.08);
    }, 3200);