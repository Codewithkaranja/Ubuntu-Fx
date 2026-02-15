// ===== YEAR =====
    document.getElementById("year").textContent = new Date().getFullYear();

    // ===== MOBILE NAV TOGGLE (dropdown) =====
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
    mobilePanel.addEventListener("click", (e) => {
      if (e.target.tagName === "A") setMenu(false);
    });
    document.addEventListener("click", (e) => {
      const isOpen = document.body.classList.contains("mobile-open");
      if (!isOpen) return;
      const navWrap = document.querySelector(".nav-wrap");
      if (!navWrap.contains(e.target)) setMenu(false);
    });

    // ===== CALENDAR DATA (demo) =====
    // You can replace this with API data later.
    // Fields: time, ccy, event, note, actual, forecast, previous, impact(HIGH|MED|LOW), status(UPCOMING|DONE), guidance
    const events = [
      {
        id: "e1",
        time: "09:00",
        ccy: "EUR",
        event: "German CPI (MoM)",
        note: "Inflation data often impacts EUR strength via ECB expectations.",
        actual: "0.4%",
        forecast: "0.3%",
        previous: "0.2%",
        impact: "HIGH",
        status: "DONE",
        guidance: "If CPI prints hot, EUR may strengthen. Wait for structure confirmation (don’t chase the first spike)."
      },
      {
        id: "e2",
        time: "10:30",
        ccy: "GBP",
        event: "BoE Monetary Policy Report",
        note: "Tone (hawkish/dovish) can shift rate path expectations quickly.",
        actual: "—",
        forecast: "—",
        previous: "—",
        impact: "HIGH",
        status: "UPCOMING",
        guidance: "Expect spread widening. Reduce size and avoid tight stops during first minutes."
      },
      {
        id: "e3",
        time: "12:00",
        ccy: "USD",
        event: "Fed Chair Powell Testifies",
        note: "Markets react to forward guidance, inflation stance, and labor market comments.",
        actual: "—",
        forecast: "—",
        previous: "—",
        impact: "HIGH",
        status: "UPCOMING",
        guidance: "Focus on USD pairs and indices. Look for liquidity sweep → BOS → retest."
      },
      {
        id: "e4",
        time: "15:30",
        ccy: "USD",
        event: "Initial Jobless Claims",
        note: "High-frequency labor indicator; can affect rate expectations intraday.",
        actual: "215K",
        forecast: "220K",
        previous: "218K",
        impact: "MED",
        status: "DONE",
        guidance: "Lower claims may support USD. Avoid over-weighting this if a bigger event is later."
      },
      {
        id: "e5",
        time: "16:45",
        ccy: "EUR",
        event: "ECB President Lagarde Speech",
        note: "Watch language around inflation progress and policy restrictiveness.",
        actual: "—",
        forecast: "—",
        previous: "—",
        impact: "MED",
        status: "UPCOMING",
        guidance: "Speeches can cause whipsaws. Trade only after structure settles."
      },
      {
        id: "e6",
        time: "21:00",
        ccy: "USD",
        event: "10Y Bond Auction",
        note: "Rates sensitivity can spill into USD and equities on poor demand.",
        actual: "4.12%",
        forecast: "4.15%",
        previous: "4.08%",
        impact: "LOW",
        status: "DONE",
        guidance: "Typically lower impact, but watch if demand is unusually weak/strong."
      },
      {
        id: "e7",
        time: "23:50",
        ccy: "JPY",
        event: "BoJ Core CPI (YoY)",
        note: "Inflation pressure influences BoJ policy normalization narrative.",
        actual: "2.1%",
        forecast: "2.0%",
        previous: "1.9%",
        impact: "HIGH",
        status: "DONE",
        guidance: "Higher CPI may strengthen JPY. Watch USDJPY structure around Asian open."
      }
    ];

    // ===== FILTER STATE =====
    // impacts default: HIGH + MED on, LOW off
    let activeRange = "today";
    let activeCcy = "ALL";
    let impacts = new Set(["HIGH", "MED"]);
    let query = "";

    const bodyEl = document.getElementById("calendarBody");
    const countEl = document.getElementById("resultsCount");
    const searchInput = document.getElementById("searchInput");

    function impactBadge(impact){
      if (impact === "HIGH") return '<span class="impact high">High</span>';
      if (impact === "MED")  return '<span class="impact med">Medium</span>';
      return '<span class="impact low">Low</span>';
    }
    function statusBadge(status){
      if (status === "UPCOMING") return '<span class="status upcoming"><i class="fa-regular fa-hourglass-half"></i> Upcoming</span>';
      if (status === "LIVE") return '<span class="status live"><i class="fa-solid fa-signal"></i> Live</span>';
      return '<span class="status done"><i class="fa-regular fa-circle-check"></i> Released</span>';
    }
    function currencyBadge(ccy){
      return `<span class="currency-badge"><span class="currency-dot"></span>${ccy}</span>`;
    }

    function matchesFilters(ev){
      if (activeCcy !== "ALL" && ev.ccy !== activeCcy) return false;
      if (!impacts.has(ev.impact)) return false;

      if (query.trim()){
        const q = query.trim().toLowerCase();
        const hay = `${ev.ccy} ${ev.event} ${ev.note}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // Range is demo-only. You can wire real dates later.
      return true;
    }

    function render(){
      const filtered = events.filter(matchesFilters);

      bodyEl.innerHTML = filtered.map(ev => {
        const rowId = `row-${ev.id}`;
        const moreId = `more-${ev.id}`;

        return `
          <tr id="${rowId}" data-id="${ev.id}">
            <td class="num">${ev.time}</td>
            <td>${currencyBadge(ev.ccy)}</td>
            <td>
              <div class="event-title">${ev.event}</div>
              <div class="event-sub">${ev.note}</div>
            </td>
            <td class="num">${ev.actual}</td>
            <td class="num">${ev.forecast}</td>
            <td class="num">${ev.previous}</td>
            <td>${impactBadge(ev.impact)}</td>
            <td>${statusBadge(ev.status)}</td>
            <td>
              <div class="row-actions">
                <button class="row-btn gold" data-toggle="${ev.id}">
                  <i class="fa-solid fa-circle-info"></i> Details
                </button>
                <button class="row-btn green" data-watch="${ev.id}">
                  <i class="fa-solid fa-bell"></i> Watch
                </button>
              </div>
            </td>
          </tr>

          <tr class="more-row" id="${moreId}">
            <td colspan="9" class="more">
              <div class="box">
                <div>
                  <h4><i class="fa-solid fa-bullseye" style="color:var(--accent); margin-right:8px;"></i> UbuntuFX Trading Guidance</h4>
                  <p>${ev.guidance}</p>
                  <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
                    <span class="badge"><i class="fa-solid fa-chart-simple"></i> Focus: Structure confirmation</span>
                    <span class="badge"><i class="fa-solid fa-shield"></i> Protect risk near news</span>
                    <span class="badge"><i class="fa-solid fa-clock"></i> Session timing matters</span>
                  </div>
                </div>

                <div class="mini-grid">
                  <div class="mini">
                    <div class="k">Volatility expectation</div>
                    <div class="v">${ev.impact === "HIGH" ? "High" : ev.impact === "MED" ? "Moderate" : "Low"} <span>• adjust stops</span></div>
                  </div>
                  <div class="mini">
                    <div class="k">Execution rule</div>
                    <div class="v">${ev.impact === "HIGH" ? "Wait 5–15 min" : "Wait for BOS"} <span>• confirm direction</span></div>
                  </div>
                  <div class="mini">
                    <div class="k">Pairs to watch</div>
                    <div class="v">${ev.ccy}/USD <span>• majors first</span></div>
                  </div>
                  <div class="mini">
                    <div class="k">Risk note</div>
                    <div class="v">${ev.impact === "HIGH" ? "Reduce size" : "Normal risk"} <span>• avoid revenge trades</span></div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      countEl.textContent = String(filtered.length);
    }

    // ===== FILTER UI WIRING =====
    function setActive(el, groupSelector){
      document.querySelectorAll(groupSelector + " .filter-pill").forEach(p => p.classList.remove("active"));
      el.classList.add("active");
    }

    // Range pills (single-select)
    document.querySelectorAll('[data-range]').forEach(pill => {
      pill.addEventListener("click", () => {
        activeRange = pill.getAttribute("data-range");
        setActive(pill, '[aria-label="Date Range Filters"]');
        render();
      });
    });

    // Currency pills (single-select)
    document.querySelectorAll('[data-ccy]').forEach(pill => {
      pill.addEventListener("click", () => {
        activeCcy = pill.getAttribute("data-ccy");
        setActive(pill, '[aria-label="Currency Filters"]');
        render();
      });
    });

    // Impact pills (multi-select)
    document.querySelectorAll('[data-impact]').forEach(pill => {
      pill.addEventListener("click", () => {
        const val = pill.getAttribute("data-impact");
        if (impacts.has(val)) {
          impacts.delete(val);
          pill.classList.remove("active");
        } else {
          impacts.add(val);
          pill.classList.add("active");
        }
        // prevent empty set (keep at least one)
        if (impacts.size === 0) {
          impacts.add("HIGH");
          document.querySelector('[data-impact="HIGH"]').classList.add("active");
        }
        render();
      });
    });

    // Search
    searchInput.addEventListener("input", (e) => {
      query = e.target.value;
      render();
    });

    // Row actions (toggle details + watch)
    document.addEventListener("click", (e) => {
      const tgl = e.target.closest("[data-toggle]");
      const w = e.target.closest("[data-watch]");

      if (tgl){
        const id = tgl.getAttribute("data-toggle");
        const moreRow = document.getElementById("more-" + id);
        const open = moreRow.style.display === "table-row";
        moreRow.style.display = open ? "none" : "table-row";
        return;
      }

      if (w){
        const id = w.getAttribute("data-watch");
        toast("Added to watchlist (demo): " + id.toUpperCase());
        return;
      }
    });

    // Jump to next upcoming
    document.getElementById("btnNow").addEventListener("click", () => {
      // find first upcoming in current filtered list
      const filtered = events.filter(matchesFilters);
      const next = filtered.find(ev => ev.status === "UPCOMING") || filtered[0];
      if (!next){ toast("No events found."); return; }
      const row = document.getElementById("row-" + next.id);
      row?.scrollIntoView({behavior:"smooth", block:"center"});
      row.style.outline = "2px solid rgba(0,200,83,.35)";
      row.style.outlineOffset = "-2px";
      setTimeout(() => { row.style.outline = "none"; }, 1400);
    });

    // Reset filters
    document.getElementById("btnReset").addEventListener("click", () => {
      activeRange = "today";
      activeCcy = "ALL";
      impacts = new Set(["HIGH","MED"]);
      query = "";
      searchInput.value = "";

      // reset UI states
      setActive(document.querySelector('[data-range="today"]'), '[aria-label="Date Range Filters"]');
      setActive(document.querySelector('[data-ccy="ALL"]'), '[aria-label="Currency Filters"]');

      document.querySelectorAll('[data-impact]').forEach(p => p.classList.remove("active"));
      document.querySelectorAll('[data-impact="HIGH"],[data-impact="MED"]').forEach(p => p.classList.add("active"));

      render();
      toast("Filters reset.");
    });

    // Export CSV (filtered)
    document.getElementById("btnExport").addEventListener("click", () => {
      const filtered = events.filter(matchesFilters);
      if (!filtered.length){ toast("Nothing to export."); return; }

      const headers = ["Time(UTC+3)","Currency","Event","Actual","Forecast","Previous","Impact","Status"];
      const rows = filtered.map(ev => [ev.time, ev.ccy, ev.event, ev.actual, ev.forecast, ev.previous, ev.impact, ev.status]);
      const csv = [headers, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(",")).join("\n");

      const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ubuntufx-economic-calendar.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast("CSV exported.");
    });

    // Initial render
    render();

    // ===== TOAST =====
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