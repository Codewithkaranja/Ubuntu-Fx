// ===== Year =====
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("updatedLabel").textContent = new Date().toLocaleDateString();

    // ===== Mobile nav =====
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

    // ===== Demo Analysis Data (replace later with CMS/API) =====
    // Fields: id, date, asset, pairKey, pairLabel, title, executive, macro, structure, levels, scenarios, risk, tags, impactScore
    const analyses = [
      {
        id: "gbpusd-boe-fed",
        date: "2026-02-15",
        asset: "FX",
        pairKey: "GBPUSD",
        pairLabel: "GBP/USD",
        title: "GBP/USD: BoE vs Fed — Who blinks first?",
        executive: "GBP remains supported above key demand, but upside is capped until a clean break above resistance. Bias is bullish only after confirmation.",
        macro: "Main driver is rate path divergence. Watch UK inflation prints and Fed guidance. Risk: headline volatility during speeches and data.",
        structure: "Higher timeframe structure is mixed. Intraday: wait for liquidity sweep then BOS above the last swing high to confirm continuation.",
        levels: [
          {k:"Key Resistance", v:"1.2850", s:"Break & hold → continuation"},
          {k:"Key Support", v:"1.2700", s:"Loss → bearish scenario"},
          {k:"Liquidity Zone", v:"1.2770–1.2790", s:"Sweep zone"},
          {k:"Invalidation", v:"Below 1.2685", s:"Bias invalid"}
        ],
        scenarios: [
          {name:"Plan A (Bull)", text:"Liquidity sweep → BOS → retest demand. Target next resistance while protecting risk."},
          {name:"Plan B (Bear)", text:"Failure to reclaim resistance + breakdown below support. Look for pullback entries with strict invalidation."}
        ],
        risk: "News risk is elevated. If trading within 30–60 minutes of high-impact events, reduce size and avoid tight stops. Max 1–2 quality attempts, no revenge trades.",
        tags: ["Exec Summary","Macro","Structure","Scenarios","Risk Plan"],
        impactScore: 92
      },
      {
        id: "eurusd-ecb-bias",
        date: "2026-02-14",
        asset: "FX",
        pairKey: "EURUSD",
        pairLabel: "EUR/USD",
        title: "EUR/USD: Testing upper range — clarity comes after confirmation",
        executive: "EUR/USD is pressing a key ceiling. Avoid buying highs. Wait for breakout confirmation or rejection structure.",
        macro: "EUR is sensitive to inflation and ECB tone; USD to rates and risk sentiment. Watch calendar for CPI/PMIs and Fed speakers.",
        structure: "Range environment: trade edges only. If breakout occurs, wait for retest (don’t chase the first candle).",
        levels: [
          {k:"Range High", v:"1.0950", s:"Break → bullish continuation"},
          {k:"Midpoint", v:"1.0880", s:"Decision zone"},
          {k:"Range Low", v:"1.0790", s:"Rejection → bounce zone"},
          {k:"Invalidation", v:"Below 1.0765", s:"Range break down"}
        ],
        scenarios: [
          {name:"Plan A (Breakout)", text:"Clean break above range high → retest → continuation targets."},
          {name:"Plan B (Rejection)", text:"Rejection + bearish shift in structure → target midpoint then range low."}
        ],
        risk: "Range markets punish impatience. Reduce frequency. Only take A+ setups with clear invalidation.",
        tags: ["Exec Summary","Macro","Structure","Scenarios","Risk Plan"],
        impactScore: 85
      },
      {
        id: "usdjpy-boj-risk",
        date: "2026-02-14",
        asset: "FX",
        pairKey: "USDJPY",
        pairLabel: "USD/JPY",
        title: "USD/JPY: Intervention risk caps upside — trade structure, not fear",
        executive: "USD/JPY remains sensitive to intervention headlines. Bias depends on whether price holds above key structure support.",
        macro: "Japan policy normalization narrative vs US yields. Watch rate differentials and BoJ communication.",
        structure: "Volatility spikes possible. Let price show direction after liquidity sweeps.",
        levels: [
          {k:"Resistance", v:"149.80", s:"Above → continuation"},
          {k:"Support", v:"148.20", s:"Hold → bullish bias"},
          {k:"Risk Zone", v:"149.30–149.60", s:"Headline sweep area"},
          {k:"Invalidation", v:"Below 147.80", s:"Bull bias invalid"}
        ],
        scenarios: [
          {name:"Plan A (Continuation)", text:"Hold support → BOS → retest → continuation toward resistance."},
          {name:"Plan B (Reversal)", text:"Break support → retest → sell rallies with strict invalidation."}
        ],
        risk: "Headlines can invalidate technicals. Keep size smaller than usual and avoid holding through major speeches.",
        tags: ["Exec Summary","Macro","Structure","Scenarios","Risk Plan"],
        impactScore: 80
      },
      {
        id: "xauusd-ath-watch",
        date: "2026-02-13",
        asset: "GOLD",
        pairKey: "XAUUSD",
        pairLabel: "XAU/USD",
        title: "XAU/USD: Momentum remains strong — manage risk near highs",
        executive: "Gold is strong, but highs attract sharp pullbacks. Prefer pullback entries over breakout chasing.",
        macro: "Driver: real yields, USD tone, risk aversion. Watch CPI/rates for volatility.",
        structure: "Trend intact; focus on continuation after pullbacks and confirmation on lower timeframes.",
        levels: [
          {k:"Resistance", v:"2180", s:"Profit-taking zone"},
          {k:"Support", v:"2145", s:"Key trend support"},
          {k:"Demand", v:"2125–2135", s:"Pullback zone"},
          {k:"Invalidation", v:"Below 2118", s:"Trend risk"}
        ],
        scenarios: [
          {name:"Plan A (Pullback Buy)", text:"Pullback into demand → confirmation → continuation."},
          {name:"Plan B (Deep Retrace)", text:"Break below support → wait for reclaim or trend pause."}
        ],
        risk: "At highs, spreads and wicks expand. Lower size, take partials, and don’t widen stops emotionally.",
        tags: ["Exec Summary","Macro","Structure","Scenarios","Risk Plan"],
        impactScore: 78
      },
      {
        id: "nas100-risk-on",
        date: "2026-02-12",
        asset: "INDICES",
        pairKey: "NAS100",
        pairLabel: "NAS100",
        title: "NAS100: Risk sentiment vs yields — trade the reaction, not the rumor",
        executive: "Index bias depends on yields. If yields rise sharply, risk assets can pull back.",
        macro: "Key driver: rates expectations, earnings headlines, and macro data. Watch Fed speakers and CPI.",
        structure: "Look for trend continuation only after confirmation; avoid entering mid-range.",
        levels: [
          {k:"Resistance", v:"17850", s:"Break → continuation"},
          {k:"Support", v:"17520", s:"Hold → bullish bias"},
          {k:"Demand", v:"17440–17490", s:"Pullback area"},
          {k:"Invalidation", v:"Below 17380", s:"Bull invalid"}
        ],
        scenarios: [
          {name:"Plan A (Continuation)", text:"Hold support → BOS → retest → continuation."},
          {name:"Plan B (Pullback)", text:"Break support → wait for reclaim or lower demand."}
        ],
        risk: "Avoid holding through major data if your setup is fragile. Tighten risk rules on high-volatility days.",
        tags: ["Exec Summary","Macro","Structure","Scenarios","Risk Plan"],
        impactScore: 70
      },
      {
        id: "btcusd-volatility",
        date: "2026-02-11",
        asset: "CRYPTO",
        pairKey: "BTCUSD",
        pairLabel: "BTC/USD",
        title: "BTC/USD: Volatility pockets — structure first, hype last",
        executive: "BTC is range-bound. Expect fakeouts. Only trade edges with clear invalidation.",
        macro: "Risk sentiment and liquidity conditions. Watch USD strength and broader risk environment.",
        structure: "Range logic: buy low/sell high only with confirmation. Avoid mid-range entries.",
        levels: [
          {k:"Range High", v:"72,000", s:"Break → expansion"},
          {k:"Midpoint", v:"70,000", s:"Chop zone"},
          {k:"Range Low", v:"68,000", s:"Demand edge"},
          {k:"Invalidation", v:"Below 67,400", s:"Breakdown risk"}
        ],
        scenarios: [
          {name:"Plan A (Range Edge)", text:"Sweep lows → reclaim → target midpoint then highs."},
          {name:"Plan B (Breakout)", text:"Break and retest above highs → continuation (only after confirmation)."}
        ],
        risk: "Crypto can wick hard. Reduce leverage and don’t average down.",
        tags: ["Exec Summary","Macro","Structure","Scenarios","Risk Plan"],
        impactScore: 68
      }
    ];

    // ===== State =====
    let activeAsset = "ALL";
    let activePair = "ALL";
    let query = "";
    let sort = "newest";
    let visibleCount = 6;

    // bookmarks in localStorage
    const LS_KEY = "ubuntufx_bookmarks";
    function getBookmarks(){
      try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
    }
    function setBookmarks(arr){
      localStorage.setItem(LS_KEY, JSON.stringify(arr));
    }

    // ===== UI refs =====
    const gridEl = document.getElementById("cardsGrid");
    const countEl = document.getElementById("resultsCount");
    const searchInput = document.getElementById("searchInput");
    const sortSelect = document.getElementById("sortSelect");

    // featured refs
    const featTitle = document.getElementById("featTitle");
    const featMeta = document.getElementById("featMeta");
    const featSummary = document.getElementById("featSummary");
    const featLevels = document.getElementById("featLevels");
    const featOpen = document.getElementById("featOpen");
    const featSave = document.getElementById("featSave");
    const featShare = document.getElementById("featShare");

    // drawer refs
    const overlay = document.getElementById("overlay");
    const drawer = document.getElementById("drawer");
    const drawerTitle = document.getElementById("drawerTitle");
    const drawerMeta = document.getElementById("drawerMeta");
    const drawerBody = document.getElementById("drawerBody");
    const drawerClose = document.getElementById("drawerClose");

    // ===== Helpers =====
    function fmtDate(iso){
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString(undefined, {year:"numeric", month:"short", day:"2-digit"});
    }
    function impactLabel(score){
      if (score >= 85) return {txt:"High", icon:"fa-triangle-exclamation", color:"rgba(244,67,54,.22)", border:"rgba(244,67,54,.35)", text:"#ffd1d1"};
      if (score >= 70) return {txt:"Medium", icon:"fa-bolt", color:"rgba(255,193,7,.18)", border:"rgba(255,193,7,.32)", text:"#ffe9a8"};
      return {txt:"Low", icon:"fa-circle", color:"rgba(76,175,80,.18)", border:"rgba(76,175,80,.30)", text:"#bff0c2"};
    }
    function matches(a){
      if (activeAsset !== "ALL" && a.asset !== activeAsset) return false;
      if (activePair !== "ALL" && a.pairKey !== activePair) return false;

      if (query.trim()){
        const q = query.trim().toLowerCase();
        const hay = `${a.pairLabel} ${a.title} ${a.executive} ${a.macro} ${a.structure}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }
    function sortList(list){
      const arr = [...list];
      if (sort === "newest") arr.sort((x,y) => y.date.localeCompare(x.date));
      if (sort === "oldest") arr.sort((x,y) => x.date.localeCompare(y.date));
      if (sort === "impact") arr.sort((x,y) => (y.impactScore - x.impactScore) || y.date.localeCompare(x.date));
      if (sort === "pair") arr.sort((x,y) => x.pairLabel.localeCompare(y.pairLabel));
      return arr;
    }

    // ===== Render Featured =====
    let featuredId = analyses[0].id;

    function renderFeatured(){
      const a = analyses.find(x => x.id === featuredId) || analyses[0];
      const imp = impactLabel(a.impactScore);
      featTitle.textContent = a.title;

      featMeta.innerHTML = `
        <span><i class="fa-regular fa-calendar"></i> ${fmtDate(a.date)}</span>
        <span><i class="fa-solid fa-layer-group"></i> ${a.asset}</span>
        <span><i class="fa-solid fa-tag"></i> ${a.pairLabel}</span>
        <span style="display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;
          border:1px solid ${imp.border}; background:${imp.color}; color:${imp.text}; font-weight:900; font-size:12px;">
          <i class="fa-solid ${imp.icon}"></i> ${imp.txt} Impact
        </span>
      `;

      featSummary.textContent = a.executive;

      featLevels.innerHTML = a.levels.slice(0,4).map(l => `
        <div class="kv">
          <div class="k">${l.k}</div>
          <div class="v">${l.v} <span>• ${l.s}</span></div>
        </div>
      `).join("");

      featOpen.onclick = () => openDrawer(a.id);
      featSave.onclick = () => toggleBookmark(a.id);
      featShare.onclick = () => copyLink("#analysis=" + a.id);

      // update save btn icon
      syncBookmarkBtn(featSave, a.id);
    }

    function syncBookmarkBtn(btn, id){
      const saved = getBookmarks().includes(id);
      btn.innerHTML = saved
        ? '<i class="fa-solid fa-bookmark"></i> Bookmarked'
        : '<i class="fa-regular fa-bookmark"></i> Bookmark';
    }

    // ===== Render Cards =====
    function renderCards(){
      const filtered = sortList(analyses.filter(matches));
      countEl.textContent = String(filtered.length);

      const slice = filtered.slice(0, visibleCount);

      gridEl.innerHTML = slice.map(a => {
        const imp = impactLabel(a.impactScore);
        const saved = getBookmarks().includes(a.id);

        return `
          <article class="card">
            <div class="card-top">
              <span class="pair"><i class="fa-solid fa-tag"></i> ${a.pairLabel}</span>
              <span class="when"><i class="fa-regular fa-calendar"></i> ${fmtDate(a.date)}</span>
            </div>

            <h3>${a.title}</h3>
            <p>${a.executive}</p>

            <div class="chips">
              <span class="chip"><i class="fa-solid fa-layer-group"></i> ${a.asset}</span>
              <span class="chip" style="border-color:${imp.border}; background:${imp.color}; color:${imp.text};">
                <i class="fa-solid ${imp.icon}"></i> ${imp.txt}
              </span>
              <span class="chip"><i class="fa-solid fa-sitemap"></i> Structure</span>
              <span class="chip"><i class="fa-solid fa-shield-halved"></i> Risk</span>
            </div>

            <div class="card-actions">
              <a class="link" href="javascript:void(0)" data-open="${a.id}">
                Read <i class="fa-solid fa-arrow-right"></i>
              </a>
              <a class="link" href="javascript:void(0)" data-bookmark="${a.id}">
                ${saved ? 'Saved' : 'Save'} <i class="fa-solid fa-bookmark"></i>
              </a>
              <a class="link" href="javascript:void(0)" data-setfeatured="${a.id}">
                Feature <i class="fa-solid fa-star"></i>
              </a>
            </div>
          </article>
        `;
      }).join("");

      document.getElementById("btnLoadMore").style.display =
        (visibleCount < filtered.length) ? "inline-flex" : "none";
    }

    // ===== Drawer (full view) =====
    function openDrawer(id){
      const a = analyses.find(x => x.id === id);
      if (!a) return;

      const imp = impactLabel(a.impactScore);

      drawerTitle.textContent = a.title;
      drawerMeta.innerHTML = `
        <span><i class="fa-regular fa-calendar"></i> ${fmtDate(a.date)}</span>
        <span><i class="fa-solid fa-layer-group"></i> ${a.asset}</span>
        <span><i class="fa-solid fa-tag"></i> ${a.pairLabel}</span>
        <span style="display:inline-flex;align-items:center;gap:8px;padding:6px 10px;border-radius:999px;
          border:1px solid ${imp.border}; background:${imp.color}; color:${imp.text}; font-weight:900; font-size:12px;">
          <i class="fa-solid ${imp.icon}"></i> ${imp.txt} Impact
        </span>
      `;

      drawerBody.innerHTML = `
        <div class="drawer-block">
          <h4><i class="fa-solid fa-file-lines"></i> Executive Summary</h4>
          <p>${a.executive}</p>
        </div>

        <div class="drawer-block">
          <h4><i class="fa-solid fa-globe"></i> Macro Context</h4>
          <p>${a.macro}</p>
          <div class="bullets">
            <div class="bullet"><i class="fa-solid fa-check"></i> Identify the main driver (rates, CPI, risk sentiment).</div>
            <div class="bullet"><i class="fa-solid fa-check"></i> Map calendar risks (speeches, CPI, NFP, GDP).</div>
          </div>
        </div>

        <div class="drawer-block">
          <h4><i class="fa-solid fa-chart-simple"></i> Technical Structure</h4>
          <p>${a.structure}</p>
          <div class="bullets">
            <div class="bullet"><i class="fa-solid fa-check"></i> Wait for liquidity sweep → BOS/CHOCH → retest.</div>
            <div class="bullet"><i class="fa-solid fa-check"></i> Avoid mid-range entries. Trade at levels only.</div>
          </div>
        </div>

        <div class="drawer-block">
          <h4><i class="fa-solid fa-bullseye"></i> Key Levels</h4>
          <div class="bullets">
            ${a.levels.map(l => `
              <div class="bullet">
                <i class="fa-solid fa-crosshairs"></i>
                <div>
                  <div style="font-weight:900;color:var(--white)">${l.k}: <span class="num">${l.v}</span></div>
                  <div style="color:var(--muted2);font-weight:800;margin-top:2px">${l.s}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="drawer-block">
          <h4><i class="fa-solid fa-route"></i> Scenarios</h4>
          <div class="bullets">
            ${a.scenarios.map(s => `
              <div class="bullet">
                <i class="fa-solid fa-diagram-project"></i>
                <div>
                  <div style="font-weight:900;color:var(--white)">${s.name}</div>
                  <div style="color:var(--muted);font-weight:800;margin-top:2px">${s.text}</div>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="riskbox">
            <strong><i class="fa-solid fa-shield-halved" style="color:var(--gold);margin-right:8px;"></i> Risk Plan</strong>
            <div style="margin-top:8px;color:var(--muted);font-size:14.5px;line-height:1.75;">
              ${a.risk}
            </div>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
            <button class="btn btn-ghost" onclick="copyLink('#analysis=${a.id}')"><i class="fa-solid fa-link"></i> Copy Link</button>
            <button class="btn btn-primary" onclick="toggleBookmark('${a.id}')"><i class="fa-solid fa-bookmark"></i> Toggle Bookmark</button>
          </div>
        </div>
      `;

      overlay.classList.add("show");
      drawer.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeDrawer(){
      overlay.classList.remove("show");
      drawer.classList.remove("show");
      document.body.style.overflow = "";
    }
    overlay.addEventListener("click", closeDrawer);
    drawerClose.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeDrawer();
    });

    // ===== Actions =====
    function toggleBookmark(id){
      const cur = getBookmarks();
      const idx = cur.indexOf(id);
      if (idx >= 0) cur.splice(idx, 1);
      else cur.push(id);
      setBookmarks(cur);

      renderCards();
      renderFeatured();
      toast(idx >= 0 ? "Removed bookmark." : "Saved to bookmarks.");
    }
    window.toggleBookmark = toggleBookmark;

    function copyLink(hash){
      const url = location.origin + location.pathname + hash;
      navigator.clipboard?.writeText(url).then(() => toast("Link copied."));
      // fallback (still ok if clipboard blocked)
      if (!navigator.clipboard) toast("Copy not supported in this browser.");
    }
    window.copyLink = copyLink;

    // ===== Filter UI wiring =====
    document.querySelectorAll("[data-asset]").forEach(p => {
      p.addEventListener("click", () => {
        activeAsset = p.getAttribute("data-asset");
        document.querySelectorAll('[aria-label="Asset Class"] .filter-pill').forEach(x => x.classList.remove("active"));
        p.classList.add("active");
        visibleCount = 6;
        renderCards();
      });
    });

    document.querySelectorAll("[data-pair]").forEach(p => {
      p.addEventListener("click", () => {
        activePair = p.getAttribute("data-pair");
        document.querySelectorAll('[aria-label="Pairs"] .filter-pill').forEach(x => x.classList.remove("active"));
        p.classList.add("active");
        visibleCount = 6;
        renderCards();
      });
    });

    searchInput.addEventListener("input", (e) => {
      query = e.target.value;
      visibleCount = 6;
      renderCards();
    });

    sortSelect.addEventListener("change", (e) => {
      sort = e.target.value;
      visibleCount = 6;
      renderCards();
    });

    // card actions delegation
    document.addEventListener("click", (e) => {
      const open = e.target.closest("[data-open]");
      const bm = e.target.closest("[data-bookmark]");
      const setf = e.target.closest("[data-setfeatured]");

      if (open){
        openDrawer(open.getAttribute("data-open"));
      }
      if (bm){
        toggleBookmark(bm.getAttribute("data-bookmark"));
      }
      if (setf){
        featuredId = setf.getAttribute("data-setfeatured");
        renderFeatured();
        toast("Featured updated.");
        document.getElementById("featuredCard").scrollIntoView({behavior:"smooth", block:"start"});
      }
    });

    // Top buttons
    document.getElementById("btnLoadMore").addEventListener("click", () => {
      visibleCount += 6;
      renderCards();
    });

    document.getElementById("btnReset").addEventListener("click", () => {
      activeAsset = "ALL";
      activePair = "ALL";
      query = "";
      sort = "newest";
      visibleCount = 6;

      searchInput.value = "";
      sortSelect.value = "newest";

      // reset pills
      document.querySelectorAll('[aria-label="Asset Class"] .filter-pill').forEach(x => x.classList.remove("active"));
      document.querySelector('[data-asset="ALL"]').classList.add("active");

      document.querySelectorAll('[aria-label="Pairs"] .filter-pill').forEach(x => x.classList.remove("active"));
      document.querySelector('[data-pair="ALL"]').classList.add("active");

      renderCards();
      toast("Filters reset.");
    });

    document.getElementById("btnLatest").addEventListener("click", () => {
      // open newest based on date
      const newest = sortList([...analyses]).sort((a,b)=>b.date.localeCompare(a.date))[0];
      openDrawer(newest.id);
    });

    document.getElementById("btnBookmark").addEventListener("click", () => {
      const saved = getBookmarks();
      if (!saved.length){ toast("No bookmarks yet."); return; }
      // show only bookmarks
      query = "";
      searchInput.value = "";
      activeAsset = "ALL";
      activePair = "ALL";

      // reset pills
      document.querySelectorAll('[aria-label="Asset Class"] .filter-pill').forEach(x => x.classList.remove("active"));
      document.querySelector('[data-asset="ALL"]').classList.add("active");
      document.querySelectorAll('[aria-label="Pairs"] .filter-pill').forEach(x => x.classList.remove("active"));
      document.querySelector('[data-pair="ALL"]').classList.add("active");

      // temporary filter: override matches
      const temp = analyses.filter(a => saved.includes(a.id));
      countEl.textContent = String(temp.length);
      visibleCount = 999;

      gridEl.innerHTML = temp.map(a => {
        const imp = impactLabel(a.impactScore);
        return `
          <article class="card">
            <div class="card-top">
              <span class="pair"><i class="fa-solid fa-tag"></i> ${a.pairLabel}</span>
              <span class="when"><i class="fa-regular fa-calendar"></i> ${fmtDate(a.date)}</span>
            </div>
            <h3>${a.title}</h3>
            <p>${a.executive}</p>
            <div class="chips">
              <span class="chip"><i class="fa-solid fa-layer-group"></i> ${a.asset}</span>
              <span class="chip" style="border-color:${imp.border}; background:${imp.color}; color:${imp.text};">
                <i class="fa-solid ${imp.icon}"></i> ${imp.txt}
              </span>
            </div>
            <div class="card-actions">
              <a class="link" href="javascript:void(0)" data-open="${a.id}">Read <i class="fa-solid fa-arrow-right"></i></a>
              <a class="link" href="javascript:void(0)" data-bookmark="${a.id}">Remove <i class="fa-solid fa-bookmark"></i></a>
            </div>
          </article>
        `;
      }).join("");

      toast("Showing bookmarks.");
    });

    // ===== Hash deep link (#analysis=ID) =====
    function checkHash(){
      const h = location.hash || "";
      const match = h.match(/analysis=([^&]+)/);
      if (match && match[1]){
        const id = decodeURIComponent(match[1]);
        const found = analyses.find(a => a.id === id);
        if (found) openDrawer(found.id);
      }
    }
    window.addEventListener("hashchange", checkHash);

    // ===== Initial render =====
    renderFeatured();
    renderCards();
    checkHash();

    // ===== Toast =====
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