 // ===== Basics =====
    document.getElementById("year").textContent = new Date().getFullYear();
    document.getElementById("updated").textContent = new Date().toLocaleString();

    // ===== Mobile nav =====
    const menuBtn = document.getElementById("menuBtn");
    const mobilePanel = document.getElementById("mobilePanel");
    function setMenu(open){
      document.body.classList.toggle("mobile-open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    }
    menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("mobile-open")));
    mobilePanel.addEventListener("click", (e) => { if (e.target.tagName === "A") setMenu(false); });
    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("mobile-open")) return;
      if (!document.querySelector(".nav-wrap").contains(e.target)) setMenu(false);
    });

    // ===== Toast =====
    const toastEl = document.getElementById("toast");
    function toast(msg){
      toastEl.textContent = msg;
      toastEl.classList.add("show");
      clearTimeout(toastEl._t);
      toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2200);
    }

    // ===== Curriculum data (premium, outcome-driven) =====
    const MODULES = [
      // Beginner / Basics
      {
        id:"pips-lots-leverage",
        icon:"fa-book",
        level:"beginner",
        topic:"basics",
        title:"Forex Basics: Pips, Lots & Leverage",
        duration:"20 min",
        desc:"Learn how pricing works, how pip value is calculated, and why leverage magnifies both gains and losses.",
        tags:["Beginner","Basics","Foundation"],
        outcomes:[
          "Calculate pip value for major pairs.",
          "Understand lot sizing (micro/mini/standard).",
          "Identify leverage traps and margin risk."
        ],
        checklist:[
          "Do I know my pip value for this pair?",
          "Is my lot size aligned with my stop distance?",
          "Do I understand margin required before entry?"
        ],
        next:["Continue: Reading Quotes & Spreads"]
      },
      {
        id:"quotes-spreads",
        icon:"fa-scale-balanced",
        level:"beginner",
        topic:"basics",
        title:"How to Read a Forex Quote (Bid/Ask & Spread)",
        duration:"25 min",
        desc:"Master base vs quote currency, bid/ask pricing, and how spreads affect entries, stops, and profitability.",
        tags:["Beginner","Basics","Execution"],
        outcomes:[
          "Interpret quote direction correctly.",
          "Understand spread costs and session differences.",
          "Avoid stop placement inside spread noise."
        ],
        checklist:[
          "Is spread currently normal for this session?",
          "Is my stop beyond spread + volatility?",
          "Am I trading a liquid pair for my level?"
        ],
        next:["Continue: Order Types & Execution"]
      },
      {
        id:"order-types",
        icon:"fa-bullseye",
        level:"beginner",
        topic:"basics",
        title:"Order Types: Market, Limit, Stop (and When to Use Each)",
        duration:"35 min",
        desc:"Execution clarity: when to use market orders, when to place limits, and how stop orders behave during volatility.",
        tags:["Beginner","Basics","Execution"],
        outcomes:[
          "Choose the correct order for your setup.",
          "Avoid slippage mistakes around news.",
          "Place orders with defined invalidation."
        ],
        checklist:[
          "Am I entering on confirmation or pulling price?",
          "Does a limit order make sense (retest)?",
          "Is a market order safe given spreads/volatility?"
        ],
        next:["Continue: Risk Management Essentials"]
      },
      {
        id:"beginner-plan",
        icon:"fa-clipboard-check",
        level:"beginner",
        topic:"risk",
        title:"Your First Trading Plan (Rules, Not Hopes)",
        duration:"40 min",
        desc:"Build a simple plan: setup definition, entry trigger, invalidation, risk per trade, and a repeatable checklist.",
        tags:["Beginner","Risk","Discipline"],
        outcomes:[
          "Write a 1-page plan you can follow daily.",
          "Define your maximum daily/weekly drawdown.",
          "Create a pre-trade checklist to avoid impulse entries."
        ],
        checklist:[
          "What is my setup and why does it work?",
          "Where is invalidation (not discomfort)?",
          "Is my risk fixed and acceptable?"
        ],
        next:["Move to Intermediate: Support & Resistance"]
      },

      // Intermediate / Technical + Risk
      {
        id:"sr-foundation",
        icon:"fa-chart-simple",
        level:"intermediate",
        topic:"technical",
        title:"Support & Resistance (Levels That Actually Matter)",
        duration:"45 min",
        desc:"Learn how to mark meaningful levels using structure, liquidity, and timeframes—not random lines.",
        tags:["Intermediate","Technical","Structure"],
        outcomes:[
          "Mark HTF levels that price respects.",
          "Identify role reversal and level quality.",
          "Avoid clutter and overfitting."
        ],
        checklist:[
          "Is this level HTF or just noise?",
          "Has it been respected multiple times?",
          "Is there liquidity nearby (stops/targets)?"
        ],
        next:["Continue: Candles & Confirmation"]
      },
      {
        id:"candles-sentiment",
        icon:"fa-fire",
        level:"intermediate",
        topic:"technical",
        title:"Candlesticks & Confirmation (Momentum vs Exhaustion)",
        duration:"40 min",
        desc:"Interpret candles as information: rejection, absorption, momentum, and where retail patterns fail.",
        tags:["Intermediate","Technical","Execution"],
        outcomes:[
          "Read rejection and momentum candles correctly.",
          "Use confirmation without late entries.",
          "Avoid trading ‘pretty’ patterns in bad context."
        ],
        checklist:[
          "Is this candle reacting at a real level?",
          "Does volume/impulse support the story?",
          "Is confirmation improving my R:R or ruining it?"
        ],
        next:["Continue: Moving Averages & Trend Filters"]
      },
      {
        id:"risk-sizing",
        icon:"fa-shield-halved",
        level:"intermediate",
        topic:"risk",
        title:"Risk Management: Position Sizing & Stop Placement",
        duration:"35 min",
        desc:"Professional risk foundations: fixed risk %, stop logic, and sizing based on invalidation—not emotions.",
        tags:["Intermediate","Risk","Professional"],
        outcomes:[
          "Size trades based on stop distance.",
          "Set stops beyond invalidation logically.",
          "Build consistency through risk budgeting."
        ],
        checklist:[
          "Is my stop logical (invalidation) not emotional?",
          "Is R:R ≥ 1.5R with clean target liquidity?",
          "Am I stacking correlated risk?"
        ],
        next:["Continue: Journaling Like a Pro"]
      },
      {
        id:"journaling",
        icon:"fa-pen-to-square",
        level:"intermediate",
        topic:"psychology",
        title:"Trading Journal: The Fastest Way to Improve",
        duration:"55 min",
        desc:"Track rules followed, screenshots, mistakes, and patterns. Elite improvement is data + reflection.",
        tags:["Intermediate","Psychology","Performance"],
        outcomes:[
          "Identify top mistakes and fix them systematically.",
          "Measure rule adherence (not just wins/losses).",
          "Build a playbook of your best setups."
        ],
        checklist:[
          "Did I follow my rules?",
          "What was the market condition (trend/range/news)?",
          "What will I do differently next time?"
        ],
        next:["Move to Advanced: Structure & Liquidity"]
      },

      // Advanced / Structure + Macro
      {
        id:"structure-liquidity",
        icon:"fa-chess",
        level:"advanced",
        topic:"technical",
        title:"Market Structure & Liquidity Pools",
        duration:"60 min",
        desc:"Understand BOS/CHOCH concepts, where liquidity sits, and why price targets highs/lows before moving.",
        tags:["Advanced","Structure","Liquidity"],
        outcomes:[
          "Map liquidity targets (equal highs/lows, PDH/PDL).",
          "Recognize structure shift before entry.",
          "Avoid chasing moves after liquidity is taken."
        ],
        checklist:[
          "Where is liquidity likely to be taken next?",
          "Do I have structure confirmation?",
          "Is my invalidation beyond the sweep?"
        ],
        next:["Continue: Order Blocks & FVG"]
      },
      {
        id:"macro-policy",
        icon:"fa-landmark",
        level:"advanced",
        topic:"fundamental",
        title:"Central Bank Narratives & Policy (Fed/ECB/BoJ)",
        duration:"55 min",
        desc:"Macro framework: rates, inflation, guidance, and how narratives drive trends—especially in FX.",
        tags:["Advanced","Fundamental","Macro"],
        outcomes:[
          "Track policy direction and market expectations.",
          "Understand why trends persist for weeks/months.",
          "Avoid being blindsided by key macro dates."
        ],
        checklist:[
          "What is the current narrative (risk-on/off)?",
          "What does the market expect vs reality?",
          "Are high-impact events approaching?"
        ],
        next:["Pair this with: Economic Calendar + Market Analysis"]
      }
    ];

    // ===== DOM =====
    const modulesEl = document.getElementById("modules");
    const resultCountEl = document.getElementById("resultCount");
    const searchEl = document.getElementById("search");
    const levelRow = document.getElementById("levelRow");
    const topicRow = document.getElementById("topicRow");

    const state = { level:"all", topic:"all", q:"" };

    function setActive(rowEl, attr, value){
      rowEl.querySelectorAll(".filter-pill").forEach(p => p.classList.toggle("active", p.getAttribute(attr) === value));
    }

    function matches(m){
      const q = state.q.trim().toLowerCase();
      const hay = (m.title + " " + m.desc + " " + m.tags.join(" ") + " " + m.topic + " " + m.level).toLowerCase();
      const okLevel = state.level === "all" || m.level === state.level;
      const okTopic = state.topic === "all" || m.topic === state.topic;
      const okQ = !q || hay.includes(q);
      return okLevel && okTopic && okQ;
    }

    function lvlChip(level){
      if (level === "beginner") return `<span class="lvl beginner"><i class="fa-solid fa-seedling"></i> BEGINNER</span>`;
      if (level === "intermediate") return `<span class="lvl intermediate"><i class="fa-solid fa-chart-line"></i> INTERMEDIATE</span>`;
      return `<span class="lvl advanced"><i class="fa-solid fa-brain"></i> ADVANCED</span>`;
    }

    function topicIcon(topic){
      const map = {
        basics: "fa-book",
        technical: "fa-chart-simple",
        fundamental: "fa-landmark",
        risk: "fa-shield-halved",
        psychology: "fa-heart-pulse"
      };
      return map[topic] || "fa-layer-group";
    }

    function render(){
      const list = MODULES.filter(matches);
      resultCountEl.textContent = list.length;

      modulesEl.innerHTML = list.map((m) => `
        <article class="module" data-id="${m.id}">
          <div class="module-top">
            <div>
              <div class="meta">
                ${lvlChip(m.level)}
                <span class="duration"><i class="fa-regular fa-clock"></i> ${m.duration}</span>
              </div>
              <h3 style="margin-top:8px;">${m.title}</h3>
            </div>
            <div class="track-icon" title="${m.topic}">
              <i class="fa-solid ${topicIcon(m.topic)}"></i>
            </div>
          </div>

          <div class="tags">
            <span class="tag"><i class="fa-solid fa-folder"></i> ${m.topic.toUpperCase()}</span>
            ${m.tags.slice(0,3).map(t => `<span class="tag"><i class="fa-solid fa-star"></i> ${t}</span>`).join("")}
          </div>

          <p>${m.desc}</p>

          <a href="#" class="learn-more" data-open="${m.id}">
            View Module <i class="fa-solid fa-arrow-right"></i>
          </a>
        </article>
      `).join("");

      // handlers
      document.querySelectorAll("[data-open]").forEach(a => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          openModal(a.getAttribute("data-open"));
        });
      });

      // Start button opens first beginner module
      document.getElementById("btnStart").onclick = () => openModal("pips-lots-leverage");

      if (!list.length){
        modulesEl.innerHTML = `
          <div class="card" style="grid-column: 1 / -1;">
            <h3 style="font-size:18px;"><i class="fa-solid fa-circle-info" style="color:var(--gold);margin-right:10px;"></i>No modules found</h3>
            <p style="margin-top:6px;">Try removing filters or search for broader terms like <b style="color:rgba(255,255,255,.92)">risk</b>, <b style="color:rgba(255,255,255,.92)">support</b>, or <b style="color:rgba(255,255,255,.92)">journal</b>.</p>
          </div>
        `;
      }
    }

    // ===== Modal =====
    const modal = document.getElementById("modal");
    const mClose = document.getElementById("mClose");
    const mTitle = document.getElementById("mTitle");
    const mTags = document.getElementById("mTags");
    const mDesc = document.getElementById("mDesc");
    const mOutcomes = document.getElementById("mOutcomes");
    const mChecklist = document.getElementById("mChecklist");
    const mNext = document.getElementById("mNext");

    function li(icon, text){
      return `<div class="li"><i class="fa-solid ${icon}"></i><div>${text}</div></div>`;
    }

    function openModal(id){
      const m = MODULES.find(x => x.id === id);
      if (!m) return;

      mTitle.textContent = m.title;

      mTags.innerHTML = `
        <span class="tag"><i class="fa-solid ${topicIcon(m.topic)}"></i> ${m.topic.toUpperCase()}</span>
        <span class="tag"><i class="fa-solid fa-signal"></i> ${m.level.toUpperCase()}</span>
        <span class="tag"><i class="fa-regular fa-clock"></i> ${m.duration}</span>
      `;

      mDesc.textContent = m.desc;

      mOutcomes.innerHTML = m.outcomes.map(x => li("fa-check", x)).join("");
      mChecklist.innerHTML = m.checklist.map(x => li("fa-list-check", x)).join("");
      mNext.innerHTML = m.next.map(x => li("fa-arrow-right", x)).join("");

      modal.classList.add("show");
      modal.setAttribute("aria-hidden","false");
      toast("Module opened.");
    }
    function closeModal(){
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden","true");
    }
    mClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

    // ===== Filters =====
    function wireRow(rowEl, key, attr){
      rowEl.addEventListener("click", (e) => {
        const pill = e.target.closest(".filter-pill");
        if (!pill) return;
        const v = pill.getAttribute(attr);
        state[key] = v;
        setActive(rowEl, attr, v);
        render();
      });
    }
    wireRow(levelRow, "level", "data-level");
    wireRow(topicRow, "topic", "data-topic");

    searchEl.addEventListener("input", (e) => {
      state.q = e.target.value;
      render();
    });

    // Newsletter (demo)
    document.getElementById("newsletter").addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Subscribed (demo). Wire this to your backend/email tool.");
      e.target.reset();
    });

    // Init
    render();