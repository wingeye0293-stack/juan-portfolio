// ===== 기본 설정 =====
const BOARD_SIZE = 770;
const GRID = 11;
const CELL = BOARD_SIZE / GRID;
const ISLAND = CELL;
const GAP = 12;
const TILE_BORDER = 1;

// ===== 상태값 (기본값) =====
let rotX = -18;
let rotZ = -24;
let scale = 1;
let is3D = true;

let iconSize = 42;      // 아이콘 기본 크기
let iconOpacity = 1.0;  // 아이콘 기본 투명도
let showNumbers = false;
let centerLogoSize = 365; // 중앙 로고 기본 크기

const dragState = {
  down: false,
  sx: 0,
  sy: 0,
  bx: rotX,
  bz: rotZ,
};

const wrapDeg = (d) => ((d % 360) + 360) % 360;

// ===== 데이터 정의 =====

// 회전 각도
function getRotation(num) {
  if (num === 1) return 135;
  if (num >= 2 && num <= 10) return 180;
  if (num === 11) return 225;
  if (num >= 12 && num <= 20) return 270;
  if (num === 21) return 315;
  if (num >= 22 && num <= 30) return 0;
  if (num === 31) return 45;
  if (num >= 32 && num <= 40) return 90;
  return 0;
}

// 구간 색상
const sections = [
  { name: "출발칸", color: "bg-yellow-200", range: [1, 1] },
  { name: "제주시 구간", color: "bg-green-300", range: [2, 20] },
  { name: "이벤트칸(경계)", color: "bg-yellow-200", range: [21, 21] },
  { name: "서귀포시 구간", color: "bg-orange-300", range: [22, 40] },
];

function getColor(num) {
  const s = sections.find((sec) => num >= sec.range[0] && num <= sec.range[1]);
  return s ? s.color : "bg-gray-100";
}

// 텍스트 박스 위치
function getLabelBoxClass(num) {
  if (num >= 2 && num <= 10)
    return "absolute top-1 left-1/2 -translate-x-1/2 text-center";
  if (num >= 22 && num <= 30)
    return "absolute bottom-1 left-1/2 -translate-x-1/2 text-center";
  return "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center";
}

// 테마(아이콘 종류)
function getTheme(n) {
  switch (n) {
    case 1:
      return "flag";
    case 2:
    case 4:
    case 8:
    case 9:
    case 13:
      return "beach";
    case 3:
    case 14:
    case 16:
    case 18:
    case 19:
      return "crater";
    case 5:
      return "garden";
    case 6:
    case 11:
    case 17:
      return "forest";
    case 7:
    case 20:
      return "mountain";
    case 10:
    case 15:
      return "coast";
    case 12:
      return "cave";
    case 21:
      return "flag";

    // 서귀포
    case 22:
    case 27:
    case 30:
    case 32:
    case 35:
    case 37:
    case 38:
      return "coast";
    case 23:
      return "estuary";
    case 24:
    case 29:
      return "observatory";
    case 25:
    case 26:
    case 31:
    case 28:
      return "coast";
    case 33:
      return "garden";
    case 34:
    case 36:
      return "crater";
    case 39:
    case 40:
      return "mountain";

    default:
      return "coast";
  }
}

// ===== A/B 버전 심볼 이미지 경로 =====
function getSymbolPath(num, theme) {
  const isSeogwipo = num >= 22 && num <= 40;
  const prefix = isSeogwipo ? "symbolB_" : "symbol_";
  return "images/" + prefix + theme + ".png";
}

// ===== 라벨 텍스트 =====
const labels = {
  1: "START",
  2: "곽지해수욕장",
  3: "새별오름",
  4: "이호테우해수욕장",
  5: "한라수목원",
  6: "절물자연휴양림",
  7: "한라산국립공원",
  8: "삼양해수욕장",
  9: "함덕서우봉해변",
  10: "조천연대공원",
  11: "비자림",
  12: "만장굴",
  13: "월정리해변",
  14: "거문오름",
  15: "제주돌문화공원",
  16: "산굼부리",
  17: "사려니숲길",
  18: "따라비오름",
  19: "다랑쉬오름",
  20: "성산일출봉",
  21: "EVENT",
  22: "섭지코지",
  23: "쇠소깍",
  24: "하효항전망대",
  25: "정방폭포",
  26: "천지연폭포",
  27: "외돌개",
  28: "서귀포잠수함",
  29: "서귀포항전망",
  30: "중문색달해변",
  31: "천제연폭포",
  32: "대포주상절리대",
  33: "카멜리아힐",
  34: "군산오름",
  35: "논짓물해변",
  36: "하논분화구",
  37: "강정해안길",
  38: "용머리해안",
  39: "산방산",
  40: "송악산",
};

// 보드 외곽 위치
function getPos(num) {
  if (num >= 1 && num <= 11) return { row: 1, col: num };
  if (num >= 12 && num <= 21) return { row: num - 10, col: 11 };
  if (num >= 22 && num <= 31) return { row: 11, col: 32 - num };
  return { row: 42 - num, col: 1 };
}

// 섬 설정
const islands = [
  { key: "chuja", name: "추자도", anchor: 2, rotateDeg: 180 },
  { key: "biyang", name: "비양도", anchor: 3, rotateDeg: 180 },
  { key: "udo", name: "우도", anchor: 20, rotateDeg: 270 },
  { key: "beom", name: "범섬", anchor: 32, rotateDeg: 90 },
  { key: "gapa", name: "가파도", anchor: 40, rotateDeg: 90 },
  { key: "mara", name: "마라도", anchor: 39, rotateDeg: 90 },
];

function anchorSide(n) {
  if (n >= 1 && n <= 11) return "top";
  if (n >= 12 && n <= 21) return "right";
  if (n >= 22 && n <= 31) return "bottom";
  return "left";
}

function islandAbs(anchor) {
  const { row, col } = getPos(anchor);
  const side = anchorSide(anchor);
  const x0 = (col - 1) * CELL;
  const y0 = (row - 1) * CELL;

  if (side === "top")
    return { left: x0, top: y0 - ISLAND - GAP - TILE_BORDER, w: ISLAND, h: ISLAND };
  if (side === "right")
    return { left: x0 + CELL + GAP + TILE_BORDER, top: y0, w: ISLAND, h: ISLAND };
  if (side === "bottom")
    return { left: x0, top: y0 + ISLAND + GAP + TILE_BORDER, w: ISLAND, h: ISLAND };
  return { left: x0 - ISLAND - GAP - TILE_BORDER, top: y0, w: ISLAND, h: ISLAND };
}

// ===== 보드 생성 =====
function buildBoard() {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  // 1~40 외곽 타일
  for (let i = 1; i <= 40; i++) {
    const { row, col } = getPos(i);
    const rotation = getRotation(i);
    const theme = getTheme(i);
    const labelText = labels[i];

    const tile = document.createElement("div");
    tile.dataset.idx = i;
    tile.className =
      "tile-3d relative border border-gray-300 flex items-center justify-center text-[10px] font-medium " +
      getColor(i);
    tile.style.gridColumnStart = col;
    tile.style.gridRowStart = row;

    // 아이콘
    const icon = document.createElement("img");
    icon.src = getSymbolPath(i, theme);
    icon.className =
      "tile-icon absolute left-1/2 top-1/2 object-contain pointer-events-none";
    icon.style.width = iconSize + "px";
    icon.style.height = iconSize + "px";
    icon.style.opacity = iconOpacity;
    icon.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    tile.appendChild(icon);

    // 텍스트
    if (labelText) {
      const labelBox = document.createElement("div");
      labelBox.className = getLabelBoxClass(i);

      if (i >= 12 && i <= 20) labelBox.style.left = "calc(50% + 19px)";
      else if (i >= 32 && i <= 40) labelBox.style.left = "calc(50% - 19px)";

      if (i === 1) {
        labelBox.style.left = "calc(50% - 13px)";
        labelBox.style.top = "calc(50% - 13px)";
      }
      if (i === 11) {
        labelBox.style.left = "calc(50% + 13px)";
        labelBox.style.top = "calc(50% - 13px)";
      }
      if (i === 21) {
        labelBox.style.left = "calc(50% + 13px)";
        labelBox.style.top = "calc(50% + 13px)";
      }
      if (i === 31) {
        labelBox.style.left = "calc(50% - 13px)";
        labelBox.style.top = "calc(50% + 13px)";
      }

      const inner = document.createElement("div");
      inner.className = "flex flex-col items-center text-center px-1";
      inner.style.transform = `rotate(${rotation}deg)`;

      const numSpan = document.createElement("div");
      numSpan.className =
        "tile-number font-semibold text-[10px]" + (showNumbers ? "" : " hidden");
      numSpan.textContent = i;

      const textSpan = document.createElement("div");
      textSpan.className = "text-[8px] leading-tight break-keep";
      textSpan.textContent = labelText;

      inner.appendChild(numSpan);
      inner.appendChild(textSpan);
      labelBox.appendChild(inner);
      tile.appendChild(labelBox);
    }

    grid.appendChild(tile);
  }

  // 중앙 9×9
  const center = document.createElement("div");
  center.className =
    "center-area pointer-events-none z-0 backdrop-blur-xl border-2 border-gray-300 flex items-center justify-center shadow-2xl rounded-xl";
  center.style.gridColumn = "2 / span 9";
  center.style.gridRow = "2 / span 9";

  const centerInner = document.createElement("div");
  centerInner.className = "relative w-full h-full flex items-center justify-center";

  const logo = document.createElement("img");
  logo.id = "center-logo";
  logo.src = "images/logo_jeju_marble.png";
  logo.className = "object-contain";
  logo.style.width = centerLogoSize + "px";
  logo.style.height = centerLogoSize + "px";

  centerInner.appendChild(logo);
  center.appendChild(centerInner);
  grid.appendChild(center);

  // 섬
  islands.forEach((is) => {
    const pos = islandAbs(is.anchor);
    const wrap = document.createElement("div");
    wrap.className = "absolute";
    wrap.style.left = pos.left + "px";
    wrap.style.top = pos.top + "px";
    wrap.style.width = pos.w + "px";
    wrap.style.height = pos.h + "px";
    wrap.style.zIndex = 5;

    const box = document.createElement("div");
    box.className =
      "island-3d relative w-full h-full bg-cyan-200 border-2 border-gray-400 rounded-md flex items-end justify-center text-[10px] text-gray-900";
    box.style.transform = `rotate(${is.rotateDeg}deg)`;

    const icon = document.createElement("img");
    icon.src = "images/symbol_island.png";
    icon.className =
      "island-icon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain";
    icon.style.width = iconSize + "px";
    icon.style.height = iconSize + "px";
    icon.style.opacity = iconOpacity;

    const label = document.createElement("span");
    label.textContent = is.name;
    label.className = "relative z-10 mb-1";

    box.appendChild(icon);
    box.appendChild(label);
    wrap.appendChild(box);
    grid.appendChild(wrap);
  });
}

// ===== 3D 제어 =====
function applyTransform() {
  const board = document.getElementById("board");
  if (!is3D) board.style.transform = "none";
  else board.style.transform = `rotateX(${rotX}deg) rotateZ(${rotZ}deg) scale(${scale})`;
}

function setup3DControls() {
  const board = document.getElementById("board");
  const wrapper = document.getElementById("board-wrapper");

  board.addEventListener("pointerdown", (e) => {
    board.setPointerCapture(e.pointerId);
    dragState.down = true;
    dragState.sx = e.clientX;
    dragState.sy = e.clientY;
    dragState.bx = rotX;
    dragState.bz = rotZ;
  });

  board.addEventListener("pointermove", (e) => {
    if (!dragState.down || !is3D) return;
    const dx = e.clientX - dragState.sx;
    const dy = e.clientY - dragState.sy;
    rotX = wrapDeg(dragState.bx - dy * 0.4);
    rotZ = wrapDeg(dragState.bz - dx * 0.4);
    applyTransform();
  });

  const endDrag = (e) => {
    dragState.down = false;
    try {
      board.releasePointerCapture(e.pointerId);
    } catch {}
  };
  board.addEventListener("pointerup", endDrag);
  board.addEventListener("pointercancel", endDrag);

  wrapper.addEventListener(
    "wheel",
    (e) => {
      if (!is3D) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      scale = Math.max(0.85, Math.min(1.35, scale + delta));
      applyTransform();
    },
    { passive: false }
  );
}

// ===== UI 컨트롤 =====
function setupUI() {
  const toggle3D = document.getElementById("toggle-3d");
  const iconSizeInput = document.getElementById("icon-size");
  const iconOpacityInput = document.getElementById("icon-opacity");
  const showNumbersInput = document.getElementById("show-numbers");
  const centerLogoInput = document.getElementById("center-logo-size");
  const toggleUIBtn = document.getElementById("toggle-ui");
  const uiPanel = document.getElementById("ui-panel");
  const footerText = document.getElementById("footer-text"); // 현재는 없음

  const iconSizeDisplay = document.getElementById("icon-size-display");
  const iconOpacityDisplay = document.getElementById("icon-opacity-display");
  const centerLogoDisplay = document.getElementById("center-logo-display");

  if (iconSizeDisplay) iconSizeDisplay.textContent = `(${iconSize}px)`;
  if (iconOpacityDisplay)
    iconOpacityDisplay.textContent = `(${iconOpacity.toFixed(2)})`;
  if (centerLogoDisplay)
    centerLogoDisplay.textContent = `(${centerLogoSize}px)`;

  toggle3D.addEventListener("click", () => {
    is3D = !is3D;
    toggle3D.textContent = is3D ? "3D 모드 끄기 (2D 보기)" : "3D 모드 켜기";
    applyTransform();
  });

  iconSizeInput.addEventListener("input", (e) => {
    iconSize = Number(e.target.value);
    document
      .querySelectorAll(".tile-icon, .island-icon")
      .forEach((img) => {
        img.style.width = iconSize + "px";
        img.style.height = iconSize + "px";
      });
    if (iconSizeDisplay) iconSizeDisplay.textContent = `(${iconSize}px)`;
  });

  iconOpacityInput.addEventListener("input", (e) => {
    iconOpacity = Number(e.target.value);
    document
      .querySelectorAll(".tile-icon, .island-icon")
      .forEach((img) => {
        img.style.opacity = iconOpacity;
      });
    if (iconOpacityDisplay)
      iconOpacityDisplay.textContent = `(${iconOpacity.toFixed(2)})`;
  });

  showNumbersInput.addEventListener("change", (e) => {
    showNumbers = e.target.checked;
    document.querySelectorAll(".tile-number").forEach((el) => {
      el.classList.toggle("hidden", !showNumbers);
    });
  });

  centerLogoInput.addEventListener("input", (e) => {
    centerLogoSize = Number(e.target.value);
    const logo = document.getElementById("center-logo");
    if (logo) {
      logo.style.width = centerLogoSize + "px";
      logo.style.height = centerLogoSize + "px";
    }
    if (centerLogoDisplay)
      centerLogoDisplay.textContent = `(${centerLogoSize}px)`;
  });

  toggleUIBtn.addEventListener("click", () => {
    const hidden = uiPanel.classList.toggle("hidden");
    if (footerText) footerText.classList.toggle("hidden", hidden);
    toggleUIBtn.textContent = hidden ? "UI 보이기" : "UI 숨기기";
  });
}

// ===== 초기화 =====
document.addEventListener("DOMContentLoaded", () => {
  buildBoard();
  applyTransform();
  setup3DControls();
  setupUI();
});
