// Dynamic year
    document.getElementById("year").textContent = new Date().getFullYear();

    // Mobile menu toggle
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");

    if (menuBtn && mobilePanel) {
      menuBtn.addEventListener("click", () => {
        const isOpen = mobilePanel.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.innerHTML = isOpen
          ? '<i class="fa-solid fa-xmark"></i>'
          : '<i class="fa-solid fa-bars"></i>';
      });
    }

    // TOC toggle on smaller screens
    const toc = document.querySelector(".toc");
    const tocToggle = document.getElementById("tocToggle");

    function setTocForViewport() {
      if (window.innerWidth <= 1080) {
        toc.classList.remove("open");
        tocToggle.setAttribute("aria-expanded", "false");
      } else {
        toc.classList.add("open");
        tocToggle.setAttribute("aria-expanded", "true");
      }
    }

    setTocForViewport();
    window.addEventListener("resize", setTocForViewport);

    if (tocToggle) {
      tocToggle.addEventListener("click", () => {
        if (window.innerWidth <= 1080) {
          const isOpen = toc.classList.toggle("open");
          tocToggle.setAttribute("aria-expanded", String(isOpen));
        }
      });
    }

    // Scroll spy
    const sections = document.querySelectorAll(".article-card h2[id]");
    const tocLinks = document.querySelectorAll(".toc-links a");

    function updateActiveToc() {
      let currentId = "";
      const offset = 140;

      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top + window.scrollY - offset;
        if (window.scrollY >= top) {
          currentId = section.id;
        }
      });

      tocLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
      });
    }

    window.addEventListener("scroll", updateActiveToc);
    window.addEventListener("load", updateActiveToc);

    // Close mobile menu after clicking a mobile nav link
    const mobileLinks = mobilePanel ? mobilePanel.querySelectorAll("a") : [];
    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobilePanel.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });