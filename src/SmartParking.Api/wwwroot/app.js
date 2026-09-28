const STATUS_CYCLE = ["Available", "Occupied", "Reserved"];
const STATUS_LABEL = {
  Available: "Trống",
  Occupied: "Có xe",
  Reserved: "Đặt trước",
};

const board = document.getElementById("board");
const boardEmpty = document.getElementById("boardEmpty");
const lastUpdatedEl = document.getElementById("lastUpdated");
const connStatusEl = document.getElementById("connStatus");
const connLabelEl = connStatusEl.querySelector(".conn-label");

let slots = [];
let connection = null;

// ---------- Clock ----------

function tickClock() {
  const el = document.getElementById("clock");
  el.textContent = new Date().toLocaleTimeString("vi-VN", { hour12: false });
}
tickClock();
setInterval(tickClock, 1000);

// ---------- Data loading ----------

async function loadSlots() {
  try {
    const res = await fetch("/api/parking/slots");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    slots = await res.json();
    renderBoard();
    updateStats();
    setLastUpdated();
  } catch (err) {
    boardEmpty.textContent = "Không tải được dữ liệu chỗ đỗ. Kiểm tra lại API.";
    boardEmpty.style.display = "block";
    console.error("Failed to load slots", err);
  }
}

function setLastUpdated() {
  const now = new Date().toLocaleTimeString("vi-VN", { hour12: false });
  lastUpdatedEl.textContent = `Cập nhật lúc ${now}`;
}

// ---------- Rendering ----------

function zoneOf(code) {
  const match = /^[A-Za-z]+/.exec(code || "");
  return match ? match[0].toUpperCase() : "Khác";
}

function renderBoard() {
  if (!slots.length) {
    boardEmpty.style.display = "block";
    boardEmpty.textContent = "Chưa có chỗ đỗ nào trong hệ thống.";
    return;
  }
  boardEmpty.style.display = "none";

  const zones = new Map();
  for (const slot of slots) {
    const z = zoneOf(slot.code);
    if (!zones.has(z)) zones.set(z, []);
    zones.get(z).push(slot);
  }

  board.querySelectorAll(".zone-row").forEach((n) => n.remove());

  for (const [zoneName, zoneSlots] of zones) {
    const row = document.createElement("div");
    row.className = "zone-row";

    const label = document.createElement("div");
    label.className = "zone-label";
    label.textContent = `KHU ${zoneName}`;
    row.appendChild(label);

    const grid = document.createElement("div");
    grid.className = "zone-slots";

    for (const slot of zoneSlots) {
      grid.appendChild(renderSlot(slot));
    }

    row.appendChild(grid);
    board.appendChild(row);
  }
}

function renderSlot(slot) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "slot";
  btn.dataset.slotId = slot.id;
  btn.dataset.status = slot.status;
  btn.innerHTML = `
    <span class="slot-code">${slot.code}</span>
    <span class="slot-status">${STATUS_LABEL[slot.status] ?? slot.status}</span>
  `;
  btn.addEventListener("click", () => cycleStatus(slot));
  return btn;
}

function updateSlotElement(id, status) {
  const el = board.querySelector(`.slot[data-slot-id="${id}"]`);
  if (!el) return;
  el.dataset.status = status;
  el.querySelector(".slot-status").textContent = STATUS_LABEL[status] ?? status;
  el.classList.remove("just-updated");
  // restart the flash animation
  void el.offsetWidth;
  el.classList.add("just-updated");
}

function updateStats() {
  const total = slots.length;
  const count = (s) => slots.filter((x) => x.status === s).length;
  document.getElementById("statTotal").textContent = total;
  document.getElementById("statAvailable").textContent = count("Available");
  document.getElementById("statOccupied").textContent = count("Occupied");
  document.getElementById("statReserved").textContent = count("Reserved");
}

// ---------- Interaction: cycle a slot's status ----------

function cycleStatus(slot) {
  const currentIndex = STATUS_CYCLE.indexOf(slot.status);
  const next = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
  slot.status = next;

  updateSlotElement(slot.id, next);
  updateStats();
  setLastUpdated();

  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    connection.invoke("UpdateSlot", slot.id, next).catch((err) => {
      console.error("Failed to broadcast slot update", err);
    });
  }
}

// ---------- SignalR live sync ----------

const CONN_LABEL = {
  connecting: "Đang kết nối…",
  connected: "Đang cập nhật trực tiếp",
  disconnected: "Mất kết nối trực tiếp",
};

function setConnState(state) {
  connStatusEl.dataset.state = state;
  connLabelEl.textContent = CONN_LABEL[state] ?? state;
}

async function startSignalR() {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("/parkingHub")
    .withAutomaticReconnect()
    .build();

  connection.on("SlotUpdated", (slotId, status) => {
    const slot = slots.find((s) => s.id === slotId);
    if (slot) slot.status = status;
    updateSlotElement(slotId, status);
    updateStats();
    setLastUpdated();
  });

  connection.onreconnecting(() => setConnState("connecting"));
  connection.onreconnected(() => setConnState("connected"));
  connection.onclose(() => setConnState("disconnected"));

  try {
    setConnState("connecting");
    await connection.start();
    setConnState("connected");
  } catch (err) {
    console.error("SignalR connection failed", err);
    setConnState("disconnected");
  }
}

// ---------- Boot ----------

loadSlots();
startSignalR();
