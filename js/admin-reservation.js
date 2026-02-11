const startTime = 7.5;
const endTime = 18;
// Array to store matched queries
let searchMatches = [];
let expandedSlots = {};
// Persistent lab and reservation information (TO BE FIXED)
let labs = JSON.parse(localStorage.getItem("labs")) || [];
let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

/* Initialize */
function initReservationPage() {
  const today = new Date();
  const { monday, sunday } = getWeekBounds(today); // 1 week limit

  if (datePicker) {
    datePicker.min = monday.toISOString().split("T")[0];
    datePicker.max = sunday.toISOString().split("T")[0];
    datePicker.value = datePicker.min;
    dateDisplay.textContent = formatDateLong(datePicker.value);
  }

  renderLabsSelect();
  updateSchedule();
}

/* Ensures 1 week availability limit */
function getWeekBounds(date) {
  const d = new Date(date);
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

if (datePicker) {
  datePicker.addEventListener("change", () => {
    dateDisplay.textContent = formatDateLong(datePicker.value);
    updateSchedule();
  });
}

/* Selecting a lab */
function renderLabsSelect() {
  labSelect.innerHTML = "";
  // dynamically loads labs as options
  labs.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l.id;
    opt.textContent = `${l.building} ${l.room}`;
    labSelect.appendChild(opt);
  });
  if (labs.length > 0) labSelect.value = labs[0].id;
}

if (labSelect) {
  labSelect.addEventListener("change", () => {
    searchMatches = [];
    expandedSlots = {};
    updateSchedule();
  });
}

/* Loads timeslots */
function updateSchedule() {
  const selectedDate = datePicker.value;
  const labId = parseInt(labSelect.value);
  const lab = labs.find(l => l.id === labId); // Find the lab from the lab array with that id
  if (!lab) {
    scheduleBody.innerHTML = `<tr><td colspan="3">No laboratory available.</td></tr>`;
    capacityDisplay.textContent = "No lab selected";
    return;
  }
  // Get all reservations for this lab
  const labRes = reservations.filter(r =>
  r.labId === labId && r.date === selectedDate);
  capacityDisplay.innerHTML = lab.open
    ? `Lab Capacity: ${lab.capacity}`
    : `<span class="closed-lab">LAB CLOSED — Reservations Disabled</span>`;

  let html = "";
  // Load reservations per time slot
  capacityDisplay.innerHTML = lab.open
  for (let t = startTime; t < endTime; t += 0.5) {

    const timeStr = formatTime(t);
    const slot = labRes.filter(r => r.time === timeStr);
    const seatsUsed = slot.reduce((s, r) => s + r.seats, 0);

    let status = "slot-green";
    if (seatsUsed > 0) status = "slot-yellow";
    if (seatsUsed >= lab.capacity) status = "slot-red";

    const isExpanded = expandedSlots[timeStr];
    // Contents of each row
    html += `
      <tr data-time="${timeStr}">
        <td>
          <span class="toggle-indicator">
            ${isExpanded ? "-" : "+"}
          </span>
          ${timeStr}
        </td>
        <td class="${status}">
          ${seatsUsed}/${lab.capacity}
        </td>
        <td>
          ${isExpanded && lab.open ? renderReservations(slot) : ""}
        </td>
      </tr>
    `;
  }

  scheduleBody.innerHTML = html;
}

/* Toggle viewing reservations */
scheduleBody.addEventListener("click", e => {
  const toggle = e.target.closest(".toggle-indicator");
  if (!toggle) return;
  const row = toggle.closest("tr");
  const timeStr = row.dataset.time;
  expandedSlots[timeStr] = !expandedSlots[timeStr];
  updateSchedule();
});

/* Load reservations */
function renderReservations(slotReservations) {
  return slotReservations
    .map(r => `<div class="reservation-entry ${searchMatches.includes(r.id) ? "reservation-highlight" : ""}">
      <div class="reservation-info">
        <strong>${r.name}</strong><br>
        <small>${r.email}</small>
      </div>
      <div class="reservation-actions">
        <button class="view-reservation" data-id="${r.id}">View</button>
        <button class="cancel-reservation" data-id="${r.id}">Cancel</button>
      </div>
    </div>`)
    .join("");
}

/* Modal handling */
function openModal(contentHTML, footerHTML) {
  modalBody.innerHTML = contentHTML;
  modalFooter.innerHTML = footerHTML;
  modal.style.display = "flex";
}

function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
  modalFooter.innerHTML = "";
}

/* Edit reservations */
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

scheduleBody.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.classList.contains("view-reservation")) viewReservation(id);
  if (btn.classList.contains("cancel-reservation")) cancelReservation(id);
});

function viewReservation(id) {
  const r = reservations.find(x => x.id === id);
  openModal(`
    <h3>Reservation Details</h3>
    <p><strong>Name:</strong> ${r.name}</p>
    <p><strong>Email:</strong> ${r.email}</p>
    <p><strong>Time:</strong> ${r.time}</p>
    <p><strong>Seats:</strong> ${r.seats}</p>
    <p><strong>Companions:</strong> ${r.companions || "None"}</p>
  `, `<button onclick="closeModal()">Close</button>`);
}

function cancelReservation(id) {
  const r = reservations.find(res => res.id === id);
  const lab = labs.find(l => l.id === r.labId);

  openModal(`
    <h3>Cancel Reservation</h3>
    <p>Are you sure you want to cancel this reservation?</p>
    <p><strong>Name:</strong> ${r.name}</p>
    <p><strong>Laboratory:</strong> ${lab.building} ${lab.room}</p>
    <p><strong>Time:</strong> ${r.time}</p>
    <p><strong>Seats:</strong> ${r.seats}</p>
    <p style="color:#9b1c1c;"><strong>This action cannot be undone.</strong></p>
  `, `
    <button style="background:#9b1c1c;" id="confirmCancel" data-id="${id}">Cancel Reservation</button>
    <button onclick="closeModal()">Keep Reservation</button>
  `);
}

modalFooter.addEventListener("click", e => {
  if (e.target.id === "confirmCancel") {
    const id = parseInt(e.target.dataset.id);
    reservations = reservations.filter(r => r.id !== id);
    closeModal();
    saveData();
    updateSchedule();
  }
});

/* Search through reservations */
function searchReservations() {
  const query = reservationSearch.value.toLowerCase().trim();
  searchMatches = [];
  expandedSlots = {}; // In case the time slots are different

  if (!query) return updateSchedule();

  const labId = parseInt(labSelect.value);
  const matches = reservations.filter(r =>
    r.labId === labId &&
    (r.name.toLowerCase().includes(query) || r.email.toLowerCase().includes(query))
  );

  matches.forEach(r => {
    expandedSlots[r.time] = true;
    searchMatches.push(r.id);
  });

  updateSchedule();
}

function clearSearch() {
  reservationSearch.value = "";
  searchMatches = [];
  expandedSlots = {};
  updateSchedule();
}

reservationSearch.addEventListener("keydown", e => {
  if (e.key === "Enter") searchReservations();
  if (e.key === "Escape") clearSearch();
});

clearSearchBtn.addEventListener("click", clearSearch);

/* Persistent lab information */
function saveData() {
  localStorage.setItem("labs", JSON.stringify(labs));
  localStorage.setItem("reservations", JSON.stringify(reservations));
}

/* Util */
function formatTime(t) {
  const h = Math.floor(t);
  const m = t % 1 ? "30" : "00";
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

function formatDateLong(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

initReservationPage();

