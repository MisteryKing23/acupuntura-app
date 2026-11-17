// App state
let currentView = "front";
let currentMeridian = "all";
let scale = 1;
let panX = 0, panY = 0;
let allPoints = getMirroredPoints();

const SVG_W = 400, SVG_H = 900;
const container = document.getElementById("canvas-container");
const svg = document.getElementById("body-map");
const infoPanel = document.getElementById("info-panel");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

// Body outline paths for each view
const BODY_OUTLINES = {
  front: `
    M200,30 C220,30 235,35 240,55 C245,70 240,85 235,95
    C232,100 230,110 232,115 C238,120 245,128 240,135
    L225,138 C222,142 220,148 218,155
    L210,160 C208,164 207,170 207,178
    C207,185 203,188 200,190 C197,188 193,185 193,178
    C193,170 192,164 190,160
    L182,155 C180,148 178,142 175,138
    L160,135 C155,128 162,120 168,115
    C170,110 168,100 165,95 C160,85 155,70 160,55
    C165,35 180,30 200,30 Z

    M168,160 L140,165 C128,168 118,175 112,185
    C106,195 102,205 98,220
    L88,260 C84,275 80,310 78,340
    C76,355 78,365 82,370
    L90,375 C95,378 97,382 96,390
    L92,420 C90,435 86,450 80,460
    L65,490 C60,498 58,505 62,510

    M232,160 L260,165 C272,168 282,175 288,185
    C294,195 298,205 302,220
    L312,260 C316,275 320,310 322,340
    C324,355 322,365 318,370
    L310,375 C305,378 303,382 304,390
    L308,420 C310,435 314,450 320,460
    L335,490 C340,498 342,505 338,510

    M175,190 C170,210 165,225 162,240
    L155,268 C152,285 150,310 152,335
    L155,360 C156,380 157,395 158,410
    L160,435 C162,460 165,485 168,510
    L170,535 C172,555 173,575 173,600
    L172,640 C172,660 171,680 170,700
    L169,730 C168,745 168,755 170,765
    C172,775 175,780 176,790
    L178,800 C180,810 184,815 188,820
    L196,830 C198,832 199,835 199,845
    L199,855 C199,860 198,865 195,870
    C190,878 185,880 182,878

    M225,190 C230,210 235,225 238,240
    L245,268 C248,285 250,310 248,335
    L245,360 C244,380 243,395 242,410
    L240,435 C238,460 235,485 232,510
    L230,535 C228,555 227,575 227,600
    L228,640 C228,660 229,680 230,700
    L231,730 C232,745 232,755 230,765
    C228,775 225,780 224,790
    L222,800 C220,810 216,815 212,820
    L204,830 C202,832 201,835 201,845
    L201,855 C201,860 202,865 205,870
    C210,878 215,880 218,878
  `,
  back: `
    M200,30 C220,30 235,35 240,55 C245,70 240,85 235,95
    C232,100 230,105 232,110 L200,115 L168,110
    C170,105 168,100 165,95 C160,85 155,70 160,55
    C165,35 180,30 200,30 Z

    M168,110 L140,120 C125,125 115,135 108,150
    C100,170 95,195 90,220
    L82,260 C78,280 76,310 78,340
    C80,355 82,365 86,370
    L94,378 C97,382 98,388 96,395
    L92,420 C90,440 86,455 80,465
    L65,495 C60,502 58,508 62,512

    M232,110 L260,120 C275,125 285,135 292,150
    C300,170 305,195 310,220
    L318,260 C322,280 324,310 322,340
    C320,355 318,365 314,370
    L306,378 C303,382 302,388 304,395
    L308,420 C310,440 314,455 320,465
    L335,495 C340,502 342,508 338,512

    M172,115 C168,140 165,160 163,180
    L160,220 C158,250 157,280 158,310
    L160,350 C161,380 162,400 163,420
    L165,460 C167,490 169,520 170,540
    L172,580 C173,610 173,640 172,670
    L170,710 C169,730 168,745 170,760
    C172,772 175,778 176,788
    L180,810 C183,818 188,822 194,828
    L200,840 L206,828 C212,822 217,818 220,810
    L224,788 C225,778 228,772 230,760
    C232,745 231,730 230,710
    L228,670 C227,640 227,610 228,580
    L230,540 C231,520 233,490 235,460
    L237,420 C238,400 239,380 240,350
    L242,310 C243,280 242,250 240,220
    L237,180 C235,160 232,140 228,115 Z

    M200,130 L200,350
    M175,180 L225,180
    M175,200 L225,200
    M175,220 L225,220
    M175,240 L225,240
    M175,260 L225,260
    M175,290 L225,290
    M175,320 L225,320
  `,
  side: `
    M200,30 C215,30 225,38 230,55 C235,70 232,85 228,95
    C225,105 222,115 220,125
    L218,138 C215,148 212,160 210,172
    C208,180 205,186 200,190
    C195,186 192,178 190,170
    L185,155 C180,140 175,130 170,125
    C168,118 170,105 172,95
    C175,82 178,70 175,55
    C172,40 180,30 200,30 Z

    M210,172 C215,185 220,200 225,215
    L235,250 C240,270 242,290 240,310
    C238,330 234,350 230,365
    L225,385 C222,395 220,410 222,425
    L228,460 C230,475 232,490 228,500
    L215,520 C212,528 215,535 220,538

    M190,170 C185,180 180,195 178,210
    L175,230 C173,245 172,260 173,280
    L175,320 C176,340 178,360 180,380
    L182,410 C183,430 184,460 185,490
    L187,520 C188,550 188,580 187,610
    L186,650 C186,680 185,710 186,740
    C187,755 190,770 192,785
    L195,800 C197,810 200,815 205,820
    L215,835 C218,838 220,842 220,850
    L220,860 C220,866 218,870 215,875
    C210,882 205,884 200,882
  `
};

// Reference lines for body parts
const BODY_REFS = {
  front: [
    { y: 30, label: "Vértex" },
    { y: 90, label: "Ojos" },
    { y: 120, label: "Boca" },
    { y: 175, label: "Garganta" },
    { y: 220, label: "Pecho" },
    { y: 275, label: "Epigastrio" },
    { y: 302, label: "Ombligo" },
    { y: 345, label: "Hipogastrio" },
    { y: 560, label: "Rodilla" },
    { y: 740, label: "Tobillo" },
    { y: 830, label: "Pie" }
  ],
  back: [
    { y: 130, label: "C7" },
    { y: 180, label: "T3" },
    { y: 220, label: "T7" },
    { y: 290, label: "L2" },
    { y: 318, label: "L4" },
    { y: 530, label: "Poplíteo" },
    { y: 740, label: "Tobillo" }
  ],
  side: [
    { y: 400, label: "Cadera" },
    { y: 580, label: "Rodilla" },
    { y: 740, label: "Tobillo" }
  ]
};

function init() {
  drawView(currentView);
  fitToScreen();
  setupPanZoom();
  setupSearch();
  setupFilters();
  setupViewToggle();
  setupZoomButtons();

  // Close panel on background tap
  container.addEventListener("click", (e) => {
    if (e.target === container || e.target === svg) {
      infoPanel.classList.remove("open");
    }
  });
}

function drawView(view) {
  svg.setAttribute("viewBox", `0 0 ${SVG_W} ${SVG_H}`);
  svg.setAttribute("width", SVG_W);
  svg.setAttribute("height", SVG_H);
  svg.innerHTML = "";

  // Background
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  bg.setAttribute("width", SVG_W);
  bg.setAttribute("height", SVG_H);
  bg.setAttribute("fill", "transparent");
  svg.appendChild(bg);

  // Body outline
  const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
  outline.setAttribute("d", BODY_OUTLINES[view] || "");
  outline.setAttribute("fill", "rgba(255,255,255,0.03)");
  outline.setAttribute("stroke", "rgba(255,255,255,0.15)");
  outline.setAttribute("stroke-width", "1.2");
  outline.setAttribute("stroke-linejoin", "round");
  svg.appendChild(outline);

  // Reference lines
  (BODY_REFS[view] || []).forEach(ref => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 10);
    line.setAttribute("x2", 25);
    line.setAttribute("y1", ref.y);
    line.setAttribute("y2", ref.y);
    line.setAttribute("stroke", "rgba(255,255,255,0.1)");
    line.setAttribute("stroke-width", "0.5");
    svg.appendChild(line);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", 12);
    text.setAttribute("y", ref.y - 3);
    text.setAttribute("fill", "rgba(255,255,255,0.15)");
    text.setAttribute("font-size", "7");
    text.textContent = ref.label;
    svg.appendChild(text);
  });

  // Draw points
  const pts = allPoints.filter(p => p.views[view]);
  pts.forEach(p => {
    if (currentMeridian !== "all" && p.meridian !== currentMeridian) return;

    const [cx, cy] = p.views[view];
    const color = MERIDIAN_COLORS[p.meridian] || "#e94560";

    // Glow
    const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    glow.setAttribute("cx", cx);
    glow.setAttribute("cy", cy);
    glow.setAttribute("r", "8");
    glow.setAttribute("fill", color);
    glow.setAttribute("opacity", "0.15");
    svg.appendChild(glow);

    // Point
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "4");
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", "0.8");
    circle.setAttribute("class", "acu-point");
    circle.setAttribute("data-id", p.id);
    circle.addEventListener("click", (e) => {
      e.stopPropagation();
      showPointInfo(p);
    });
    svg.appendChild(circle);

    // Label
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", cx + 7);
    label.setAttribute("y", cy + 3);
    label.setAttribute("fill", "rgba(255,255,255,0.7)");
    label.setAttribute("font-size", "6");
    label.setAttribute("font-family", "system-ui, sans-serif");
    label.textContent = p.id;
    svg.appendChild(label);
  });
}

function showPointInfo(point) {
  document.getElementById("point-name").textContent = `${point.nameEs} (${point.name})`;
  document.getElementById("point-code").textContent = point.id;
  document.getElementById("point-meridian").textContent = MERIDIAN_NAMES[point.meridian] || point.meridian;
  document.getElementById("point-location").textContent = point.location;
  document.getElementById("point-indications").textContent = point.indications;
  document.getElementById("point-technique").textContent = point.technique;
  infoPanel.classList.add("open");

  // Highlight the point
  document.querySelectorAll(".acu-point").forEach(c => {
    c.setAttribute("stroke-width", c.dataset.id === point.id ? "2" : "0.8");
    c.setAttribute("r", c.dataset.id === point.id ? "6" : "4");
  });
}

function navigateToPoint(point) {
  // Switch view if needed
  const views = Object.keys(point.views);
  if (!views.includes(currentView)) {
    currentView = views[0];
    document.querySelectorAll(".view-toggle button").forEach(b => {
      b.classList.toggle("active", b.dataset.view === currentView);
    });
    drawView(currentView);
  }

  const [px, py] = point.views[currentView];
  const rect = container.getBoundingClientRect();

  scale = 2.5;
  panX = rect.width / 2 - px * scale;
  panY = rect.height / 2 - py * scale;
  applyTransform();
  showPointInfo(point);
}

// Pan & Zoom
function setupPanZoom() {
  let isDragging = false;
  let startX, startY;
  let lastDist = 0;

  container.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".search-bar") || e.target.closest(".zoom-controls")) return;
    isDragging = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    container.setPointerCapture(e.pointerId);
  });

  container.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    panX = e.clientX - startX;
    panY = e.clientY - startY;
    applyTransform();
  });

  container.addEventListener("pointerup", () => { isDragging = false; });
  container.addEventListener("pointercancel", () => { isDragging = false; });

  // Pinch zoom
  let touches = [];
  container.addEventListener("touchstart", (e) => {
    touches = [...e.touches];
    if (touches.length === 2) {
      lastDist = Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    }
  }, { passive: true });

  container.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const factor = dist / lastDist;
      zoomAt(midX, midY, factor);
      lastDist = dist;
    }
  }, { passive: false });

  // Mouse wheel zoom
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.9 : 1.1;
    zoomAt(e.clientX, e.clientY, factor);
  }, { passive: false });
}

function zoomAt(cx, cy, factor) {
  const rect = container.getBoundingClientRect();
  const x = cx - rect.left;
  const y = cy - rect.top;
  const newScale = Math.max(0.5, Math.min(8, scale * factor));
  const ratio = newScale / scale;
  panX = x - ratio * (x - panX);
  panY = y - ratio * (y - panY);
  scale = newScale;
  applyTransform();
}

function applyTransform() {
  svg.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
}

function fitToScreen() {
  const rect = container.getBoundingClientRect();
  const scaleX = rect.width / SVG_W;
  const scaleY = rect.height / SVG_H;
  scale = Math.min(scaleX, scaleY) * 0.92;
  panX = (rect.width - SVG_W * scale) / 2;
  panY = (rect.height - SVG_H * scale) / 2;
  applyTransform();
}

function setupZoomButtons() {
  document.getElementById("zoom-in").addEventListener("click", () => {
    const rect = container.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, 1.3);
  });
  document.getElementById("zoom-out").addEventListener("click", () => {
    const rect = container.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, 0.77);
  });
  document.getElementById("zoom-fit").addEventListener("click", fitToScreen);
}

function setupViewToggle() {
  document.querySelectorAll(".view-toggle button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentView = btn.dataset.view;
      document.querySelectorAll(".view-toggle button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      drawView(currentView);
      fitToScreen();
    });
  });
}

function setupFilters() {
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      currentMeridian = chip.dataset.meridian;
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      drawView(currentView);
    });
  });
}

function setupSearch() {
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase().trim();
    if (q.length < 2) {
      searchResults.classList.remove("visible");
      return;
    }

    const unique = new Map();
    ACUPOINTS.forEach(p => {
      const match = p.id.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.nameEs.toLowerCase().includes(q) ||
        p.indications.toLowerCase().includes(q) ||
        p.meridian.toLowerCase().includes(q);
      if (match && !unique.has(p.id)) unique.set(p.id, p);
    });

    const results = [...unique.values()].slice(0, 10);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="result-item" style="color:var(--text-muted)">Sin resultados</div>';
    } else {
      searchResults.innerHTML = results.map(p =>
        `<div class="result-item" data-id="${p.id}">
          <strong>${p.id}</strong> — ${p.nameEs} (${p.name})
          <div class="rid">${p.indications.substring(0, 60)}...</div>
        </div>`
      ).join("");

      searchResults.querySelectorAll(".result-item[data-id]").forEach(el => {
        el.addEventListener("click", () => {
          const pt = ACUPOINTS.find(p => p.id === el.dataset.id);
          if (pt) {
            navigateToPoint(pt);
            searchResults.classList.remove("visible");
            searchInput.value = "";
            searchInput.blur();
          }
        });
      });
    }
    searchResults.classList.add("visible");
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.length >= 2) searchResults.classList.add("visible");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar")) searchResults.classList.remove("visible");
  });
}

// Swipe to close panel
let panelStartY = 0;
infoPanel.addEventListener("touchstart", (e) => {
  panelStartY = e.touches[0].clientY;
}, { passive: true });
infoPanel.addEventListener("touchmove", (e) => {
  const dy = e.touches[0].clientY - panelStartY;
  if (dy > 50) infoPanel.classList.remove("open");
}, { passive: true });

window.addEventListener("resize", fitToScreen);
init();
