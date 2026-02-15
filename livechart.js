 // ===== Year + Updated =====
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("updatedLabel").textContent = new Date().toLocaleString();

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
    mobilePanel.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
    document.addEventListener("click", (e) => {
      const isOpen = document.body.classList.contains("mobile-open");
      if (!isOpen) return;
      const navWrap = document.querySelector(".nav-wrap");
      if (!navWrap.contains(e.target)) setMenu(false);
    });

    // ===== Toast =====
    const toastEl = document.getElementById("toast");
    function toast(msg){
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastEl._t);
      toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
    }

    // ===== Instruments + Timeframes =====
    // NOTE: This page can run in DEMO mode (no external scripts).
    // When you want real interactive charts, enable TradingView embed via iframe injection below.
    const instruments = [
      { key:"FX:EURUSD", name:"EUR/USD", asset:"FX" },
      { key:"FX:GBPUSD", name:"GBP/USD", asset:"FX" },
      { key:"FX:USDJPY", name:"USD/JPY", asset:"FX" },
      { key:"FX:AUDUSD", name:"AUD/USD", asset:"FX" },
      { key:"FX:USDCAD", name:"USD/CAD", asset:"FX" },
      { key:"OANDA:XAUUSD", name:"XAU/USD (Gold)", asset:"Gold" },
      { key:"NASDAQ:NDX", name:"NAS100 (NDX)", asset:"Indices" },
      { key:"BINANCE:BTCUSDT", name:"BTC/USDT", asset:"Crypto" }
    ];
    const timeframes = ["1","5","15","30","60","240","D"]; // minutes or "D"
    const tfLabels = { "1":"1m","5":"5m","15":"15m","30":"30m","60":"1h","240":"4h","D":"1D" };

    // ===== State (with persistence) =====
    const LS_VIEW = "ubuntufx_chart_view";
    let state = {
      symbol: "FX:EURUSD",
      tf: "15",
      pro: true,
      risk: true,
      loaded: false
    };

    // restore if exists
    try{
      const saved = JSON.parse(localStorage.getItem(LS_VIEW) || "null");
      if (saved && saved.symbol && saved.tf) state = { ...state, ...saved };
    }catch(e){}

    // ===== Render pills =====
    const pairsRow = document.getElementById("pairsRow");
    const tfsRow = document.getElementById("tfsRow");
    const pairSearch = document.getElementById("pairSearch");

    function renderPairs(filterText=""){
      const q = (filterText || "").trim().toLowerCase();
      const filtered = instruments.filter(x => {
        if (!q) return true;
        return (x.name + " " + x.key).toLowerCase().includes(q);
      });

      pairsRow.innerHTML = filtered.map(x => {
        const active = x.key === state.symbol ? "active" : "";
        return `<span class="filter-pill ${active}" data-symbol="${x.key}">
          <i class="fa-solid fa-tag" style="color:rgba(249,168,37,.92)"></i> ${x.name}
        </span>`;
      }).join("");

      // attach click
      pairsRow.querySelectorAll("[data-symbol]").forEach(el => {
        el.addEventListener("click", () => {
          state.symbol = el.getAttribute("data-symbol");
          state.loaded = false; // require reload
          updateHeader();
          renderPairs(pairSearch.value);
          updateChart();
          toast("Instrument updated.");
        });
      });
    }

    function renderTFs(){
      tfsRow.innerHTML = timeframes.map(tf => {
        const active = tf === state.tf ? "active" : "";
        return `<span class="filter-pill ${active}" data-tf="${tf}">
          <i class="fa-solid fa-clock" style="color:rgba(249,168,37,.92)"></i> ${tfLabels[tf]}
        </span>`;
      }).join("");

      tfsRow.querySelectorAll("[data-tf]").forEach(el => {
        el.addEventListener("click", () => {
          state.tf = el.getAttribute("data-tf");
          state.loaded = false;
          updateHeader();
          renderTFs();
          updateChart();
          toast("Timeframe updated.");
        });
      });
    }

    pairSearch.addEventListener("input", (e) => renderPairs(e.target.value));

    // keyboard shortcut
    document.addEventListener("keydown", (e) => {
      if (e.key === "/"){
        e.preventDefault();
        pairSearch.focus();
      }
    });

    // ===== Switches =====
    const proSwitch = document.getElementById("proSwitch");
    const riskSwitch = document.getElementById("riskSwitch");
    const snapshotCard = document.getElementById("snapshotCard");
    const riskCard = document.getElementById("riskCard");

    function setSwitch(el, on){
      el.classList.toggle("on", on);
      el.setAttribute("aria-checked", String(on));
    }
    function updateSwitchUI(){
      setSwitch(proSwitch, state.pro);
      setSwitch(riskSwitch, state.risk);

      snapshotCard.style.display = state.pro ? "block" : "none";
      // risk panel can be toggled independent
      riskCard.style.display = state.risk ? "block" : "none";
    }

    function switchClick(which){
      if (which === "pro") state.pro = !state.pro;
      if (which === "risk") state.risk = !state.risk;
      updateSwitchUI();
      persistView();
      toast("Layout updated.");
    }
    proSwitch.addEventListener("click", () => switchClick("pro"));
    riskSwitch.addEventListener("click", () => switchClick("risk"));
    proSwitch.addEventListener("keydown", (e) => { if (e.key==="Enter"||e.key===" "){ e.preventDefault(); switchClick("pro"); }});
    riskSwitch.addEventListener("keydown", (e) => { if (e.key==="Enter"||e.key===" "){ e.preventDefault(); switchClick("risk"); }});

    // ===== Header + badges =====
    const selectedBadge = document.getElementById("selectedBadge");
    const chartName = document.getElementById("chartName");
    const assetLabel = document.getElementById("assetLabel");
    const tfLabel = document.getElementById("tfLabel");
    const feedLabel = document.getElementById("feedLabel");
    const dataMode = document.getElementById("dataMode");

    function getInstrument(){
      return instruments.find(x => x.key === state.symbol) || instruments[0];
    }
    function updateHeader(){
      const ins = getInstrument();
      chartName.textContent = ins.name;
      assetLabel.textContent = ins.asset;
      tfLabel.textContent = tfLabels[state.tf];
      selectedBadge.innerHTML = `<i class="fa-solid fa-tag" style="color:var(--gold)"></i> ${ins.name} • ${tfLabels[state.tf]}`;
    }

    // ===== Snapshot (demo feed) =====
    const snapshotBody = document.getElementById("snapshotBody");

    function rand(n, spread=0.01){ // deterministic-ish small changes per refresh
      return (n + (Math.random() - 0.5) * spread);
    }
    // base demo prices
    let demo = [
      { name:"EUR/USD", price:1.0725, chg: +0.12, spr: 0.7, ses:"London" },
      { name:"GBP/USD", price:1.2648, chg: -0.08, spr: 0.9, ses:"London" },
      { name:"USD/JPY", price:149.83, chg: +0.23, spr: 1.1, ses:"Tokyo" },
      { name:"XAU/USD", price:2158.30, chg: +0.35, spr: 2.6, ses:"NY" },
      { name:"NAS100",  price:17820,  chg: -0.14, spr: 1.9, ses:"NY" },
      { name:"BTC/USDT",price:68940,  chg: -1.20, spr: 0.0, ses:"24/7" },
    ];

    function renderSnapshot(){
      // simulate tiny movements
      demo = demo.map(x => {
        const p = (typeof x.price === "number") ? x.price : Number(x.price);
        const newP = rand(p, p < 10 ? 0.0018 : (p < 1000 ? 2.2 : 60));
        const newChg = rand(x.chg, 0.18);

        return { ...x, price: newP, chg: newChg };
      });

      snapshotBody.innerHTML = demo.map(x => {
        const pos = x.chg >= 0;
        const cls = pos ? "pos" : "neg";
        const sign = pos ? "+" : "";
        const priceFmt = (x.price < 10) ? x.price.toFixed(4) : (x.price < 1000 ? x.price.toFixed(2) : Math.round(x.price).toString());

        return `
          <tr>
            <td>
              <div class="row-pair">
                <i class="fa-solid fa-chart-line" style="color:rgba(249,168,37,.95)"></i>
                ${x.name}
              </div>
            </td>
            <td>${priceFmt}</td>
            <td class="chg ${cls}">${sign}${x.chg.toFixed(2)}%</td>
            <td>${x.spr ? x.spr.toFixed(1) + " pips" : "—"}</td>
            <td><span class="tiny">${x.ses}</span></td>
          </tr>
        `;
      }).join("");
    }

    // ===== TradingView Embed (iframe, no external scripts) =====
    // For real production: replace the iframe with TV official widget script or your data feed.
    const chartWrap = document.getElementById("chartWrap");
    const chartHost = document.getElementById("chartHost");
    const btnOpenTV = document.getElementById("btnOpenTV");

    function buildTVUrl(symbol, interval){
      // TradingView embeddable "widgetembed" URL
      // interval: 1,5,15,30,60,240,D
      const theme = "dark";
      const params = new URLSearchParams({
        symbol,
        interval,
        hidetoptoolbar: "0",
        hidelegend: "0",
        saveimage: "1",
        toolbarbg: "rgba(0,0,0,1)",
        studies: "",
        theme,
        style: "1",
        timezone: "Africa/Nairobi",
        withdateranges: "1",
        allow_symbol_change: "1",
        details: "1",
        hotlist: "0",
        calendar: "0",
      });
      return "https://s.tradingview.com/widgetembed/?" + params.toString();
    }

    function updateChart(){
      // if not loaded, show overlay only
      if (!state.loaded){
        chartHost.innerHTML = "";
        chartWrap.classList.add("loading");
        feedLabel.textContent = "Demo";
        dataMode.textContent = "Demo";
        return;
      }

      // load iframe
      chartWrap.classList.add("loading");
      const url = buildTVUrl(state.symbol, state.tf);
      chartHost.innerHTML = `
        <iframe class="tv-embed" title="TradingView Chart" src="${url}" loading="lazy"></iframe>
      `;

      const iframe = chartHost.querySelector("iframe");
      // remove loading overlay once iframe has loaded
      iframe.addEventListener("load", () => {
        chartWrap.classList.remove("loading");
        feedLabel.textContent = "TradingView";
        dataMode.textContent = "Live (Embed)";
      });
    }

    btnOpenTV.addEventListener("click", () => {
      state.loaded = true;
      persistView();
      updateChart();
      toast("Loading interactive chart...");
    });

    // ===== Fullscreen =====
    document.getElementById("btnFullscreen").addEventListener("click", async () => {
      const target = document.querySelector(".chart-wrap");
      if (!document.fullscreenElement){
        await target.requestFullscreen?.();
        toast("Fullscreen enabled.");
      }else{
        await document.exitFullscreen?.();
      }
    });

    // Guides
    document.getElementById("btnIndicators").addEventListener("click", () => {
      toast("Tip: Use 1–2 indicators max. Price + structure first.");
    });
    document.getElementById("btnDraw").addEventListener("click", () => {
      toast("Tip: Mark HTF levels → wait for LTF confirmation.");
    });

    // ===== Checklist validation =====
    document.getElementById("btnChecklist").addEventListener("click", () => {
      const ok = ["c1","c2","c3","c4"].every(id => document.getElementById(id).checked);
      toast(ok ? "Checklist validated. Trade only if rules match." : "Checklist incomplete. Slow down.");
    });

    // ===== Save / Restore View =====
    function persistView(){
      localStorage.setItem(LS_VIEW, JSON.stringify({
        symbol: state.symbol,
        tf: state.tf,
        pro: state.pro,
        risk: state.risk,
        loaded: state.loaded
      }));
    }
    document.getElementById("btnSaveView").addEventListener("click", () => {
      persistView();
      toast("View saved.");
    });
    document.getElementById("btnRestoreView").addEventListener("click", () => {
      try{
        const saved = JSON.parse(localStorage.getItem(LS_VIEW) || "null");
        if (!saved){ toast("No saved view found."); return; }
        state = { ...state, ...saved };
        renderPairs(pairSearch.value);
        renderTFs();
        updateHeader();
        updateSwitchUI();
        updateChart();
        toast("View restored.");
      }catch(e){
        toast("Failed to restore view.");
      }
    });

    // Reset
    document.getElementById("btnReset").addEventListener("click", () => {
      state.symbol = "FX:EURUSD";
      state.tf = "15";
      state.pro = true;
      state.risk = true;
      state.loaded = false;
      pairSearch.value = "";
      renderPairs("");
      renderTFs();
      updateHeader();
      updateSwitchUI();
      updateChart();
      persistView();
      toast("Reset complete.");
    });

    // Copy link (deep link via hash)
    document.getElementById("btnCopy").addEventListener("click", () => {
      const hash = `#symbol=${encodeURIComponent(state.symbol)}&tf=${encodeURIComponent(state.tf)}`;
      const url = location.origin + location.pathname + hash;
      navigator.clipboard?.writeText(url).then(() => toast("Link copied."));
    });

    // deep link support
    function readHash(){
      const h = location.hash.replace("#","");
      if (!h) return;
      const p = new URLSearchParams(h);
      const sym = p.get("symbol");
      const tf = p.get("tf");
      if (sym && instruments.some(x => x.key === sym)) state.symbol = sym;
      if (tf && timeframes.includes(tf)) state.tf = tf;
    }
    window.addEventListener("hashchange", () => {
      readHash();
      renderPairs(pairSearch.value);
      renderTFs();
      updateHeader();
      updateChart();
      toast("Link loaded.");
    });

    // ===== Init =====
    readHash();
    renderPairs("");
    renderTFs();
    updateHeader();
    updateSwitchUI();
    updateChart();
    renderSnapshot();

    // demo snapshot refresh every 10s (only if pro mode)
    setInterval(() => {
      if (state.pro) renderSnapshot();
    }, 10000);