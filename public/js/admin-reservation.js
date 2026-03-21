const startTime = 7.5;
const endTime = 18;
// Array to store matched queries
let searchMatches = [];
let expandedSlots = {};
let labs = [];
let reservations = [];

/* Initialize */

async function fetchLabs() {
  const res = await fetch('http://localhost:3000/api/labs');
  labs = await res.json();
  renderLabsSelect();
  updateSchedule();
}

async function fetchReservations(labId, date) {
  const res = await fetch(`http://localhost:3000/api/slots/reservations?labID=${labId}&date=${date}`)
  reservations = await res.json();
}

function initReservationPage() {
  const today = new Date();
  const { monday, sunday } = getWeekBounds(today);

  datePicker.min = monday.toISOString().split("T")[0];
  datePicker.max = sunday.toISOString().split("T")[0];
  datePicker.value = datePicker.min;

  dateDisplay.textContent = formatDateLong(datePicker.value);

  fetchLabs();
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

  labs.forEach(l => {
    const opt = document.createElement("option");
    opt.value = l._id;
    const buildingName = l.buildingID?.name;
    const roomCode = `${l.room}`;
    opt.textContent = `${buildingName} ${roomCode}`;
    labSelect.appendChild(opt);
  });

  if (labs.length > 0) labSelect.value = labs[0]._id;
}

if (labSelect) {
  labSelect.addEventListener("change", () => {
    searchMatches = [];
    expandedSlots = {};
    updateSchedule();
  });
}

/* Loads timeslots */
async function updateSchedule() {
  const selectedDate = datePicker.value;
  const labId = labSelect.value;

  await fetchReservations(labId, selectedDate);
  const lab = labs.find(l => l._id === labId);

  if (!lab) {
    scheduleBody.innerHTML = `<tr><td colspan="3">No laboratory available.</td></tr>`;
    capacityDisplay.textContent = "No lab selected";
    return;
  }
  capacityDisplay.innerHTML = lab.availability
    ? `Lab Capacity: ${lab.capacity}`
    : `<span class="closed-lab">LAB CLOSED — Reservations Disabled</span>`;

  let html = "";
  // Load reservations per time slot
  for (let t = startTime; t < endTime; t += 0.5) {

    const timeStr = formatTime(t);
    const slot = reservations.filter(r => normalizeTime(r.startTime) === timeStr);
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
          ${isExpanded && lab.availability ? renderReservations(slot) : ""}
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
    .map(r => `<div class="reservation-entry ${searchMatches.includes(r._id) ? "reservation-highlight" : ""}">
      <div class="reservation-info">
        <strong>${r.studentID.firstName} ${r.studentID.lastName}</strong><br>
        <small>${r.studentID.email}</small>
      </div>
      <div class="reservation-actions">
        <button class="view-reservation" data-id="${r._id}">View</button>
        <button class="cancel-reservation" data-id="${r._id}">Cancel</button>
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
  const id = btn.dataset.id;
  if (btn.classList.contains("view-reservation")) viewReservation(id);
  if (btn.classList.contains("cancel-reservation")) cancelReservation(id);
});

function viewReservation(id) {
  const r = reservations.find(res => res._id === id);
  let companions = "None";

  if (r.additionalStudents && r.additionalStudents.length > 0) {
    companions = r.additionalStudents.join(", ");
  }

  openModal(`
    <h3>Reservation Details</h3>
    <p><strong>Name:</strong> ${r.studentID.firstName} ${r.studentID.lastName}</p>
    <p><strong>Email:</strong> ${r.studentID.email}</p>
    <p><strong>Time:</strong> ${r.startTime} - ${r.endTime}</p>
    <p><strong>Seats:</strong> ${r.seats}</p>
    <p><strong>Companions:</strong> ${companions}</p>`, 
    `<button id="viewStudentProfile" data-id="${r.studentID._id}">View Profile </button>    
    <button onclick="closeModal()">Close</button>`);
}

async function cancelReservation(id) {
  const r = reservations.find(res => res._id === id);
  const lab = r.labID;
  let companions = "None";

  if (r.additionalStudents && r.additionalStudents.length > 0) {
    companions = r.additionalStudents.join(", ");
  }
  
  openModal(`
    <h3>Cancel Reservation</h3>
    <p>Are you sure you want to cancel this reservation?</p>
    <p><strong>Name:</strong> ${r.studentID.firstName} ${r.studentID.lastName}</p>
    <p><strong>Laboratory:</strong> ${lab.buildingID?.name} ${lab.room}</p>
    <p><strong>Time:</strong> ${r.startTime} - ${r.endTime}</p>
    <p><strong>Seats:</strong> ${r.seats}</p>
    <p><strong>Companions:</strong> ${companions}</p>
    <p style="color:#9b1c1c;"><strong>This action cannot be undone.</strong></p>
  `, `
    <button style="background:#9b1c1c;" id="confirmCancel" data-id="${id}">Cancel Reservation</button>
    <button onclick="closeModal()">Keep Reservation</button>
  `);
}

modalFooter.addEventListener("click", async (e) => {
  if (e.target.id === "confirmCancel") {
    const id = e.target.dataset.id;

    await fetch(`http://localhost:3000/api/slots/reservations/${id}`, {
      method: "DELETE"
    });

    closeModal();
    updateSchedule();
  }
  if (e.target.id === "viewStudentProfile") {
    const id = e.target.dataset.id;
    sessionStorage.setItem("viewStudentID", id);
    window.location.href = "student-profile.html";
  }
});

/* Search through reservations */
function searchReservations() {
  const query = reservationSearch.value.toLowerCase().trim();
  searchMatches = [];
  expandedSlots = {}; // In case the time slots are different

  if (!query) return updateSchedule();

  const matches = reservations.filter(r =>
    (r.studentID.firstName + " " + r.studentID.lastName).toLowerCase().includes(query) ||
    r.studentID.email.toLowerCase().includes(query)
  );

  matches.forEach(r => {
    expandedSlots[r.startTime] = true;
    searchMatches.push(r._id);
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

/* Util */
function formatTime(t) {
  const h = Math.floor(t);
  const m = t % 1 ? "30" : "00";
  return `${h % 12 || 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

function formatDateLong(d) {
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// TO FIX
function normalizeTime(time) {
  if (time.includes("AM") || time.includes("PM")) return time;

  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;

  return `${formattedHour}:${m} ${suffix}`;
}

initReservationPage();

