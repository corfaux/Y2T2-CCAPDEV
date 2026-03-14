const buildingInput = document.getElementById("buildingInput");
const roomInput = document.getElementById("roomInput");
const capacityInput = document.getElementById("capacityInput");
const addLabBtn = document.querySelector(".controls button");
const popUp = document.getElementById("popupMessage");
// Persistent lab and reservation information (TO BE FIXED)
let labs = JSON.parse(localStorage.getItem("labs")) || [];
let reservations = JSON.parse(localStorage.getItem("reservations")) || [];

/* Initialize */
function initLabPage() {
  renderLabs();
}

/* Load labs */
function renderLabs() {
  labsTable.innerHTML = "";

  labs.forEach(l => {
    const hasRes = labHasReservations(l.id);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${l.building}</td>
      <td>${l.room}</td>
      <td>${l.capacity}</td>
      <td><input type="checkbox" ${l.open ? "checked" : ""} disabled></td>
      <td><button class="edit-lab" data-id="${l.id}">Edit</button></td>
      <td><button class="delete-lab ${hasRes ? "disabled-delete" : ""}" data-id="${l.id}" ${hasRes ? "disabled" : ""}>✖</button></td>
    `;
    labsTable.appendChild(tr);
  });
}

/* Adding a lab */
addLabBtn.addEventListener("click", () => {
  const building = buildingInput.value.trim();
  const room = roomInput.value.trim();
  const capacity = parseInt(capacityInput.value);
  // No building
  if (!building) {
    showpopUp("Please enter a building name.");
    return;
  }
  // No room number
  if (!room) {
    showpopUp("Please enter a room number.");
    return;
  }
  if (Number.isNaN(capacity) || capacity <= 0) return showpopUp("Capacity must be greater than 0.");

  // Prevent duplicates
  if (labs.some(l => l.building.toLowerCase() === building.toLowerCase() && l.room.toLowerCase() === room.toLowerCase())) {
    return alert(`A lab in ${building} ${room} already exists.`);
  }
  // Create a new lab element via math-ing a new ID
  const newId = labs.length ? Math.max(...labs.map(l => l.id)) + 1 : 1;
  labs.push({ id: newId, building, room, capacity, open: true });

  buildingInput.value = "";
  roomInput.value = "";
  capacityInput.value = "";

  saveData();
  renderLabs();
  showpopUp(`Lab ${building} ${room} added successfully!`);
});

function showpopUp(message) {
  popUp.textContent = message;
  popUp.classList.remove("hidden");
  popUp.classList.add("show");

  setTimeout(() => {
    popUp.classList.remove("show");
    setTimeout(() => {
      popUp.classList.add("hidden");
    }, 300);
  }, 3000);
}

/* Edit/Delete labs */
labsTable.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.classList.contains("edit-lab")) editLab(id);
  if (btn.classList.contains("delete-lab") && !btn.disabled) deleteLab(id);
});

function editLab(id) {
  const lab = labs.find(l => l.id === id);
  const reserved = reservedSeatsForLab(id);

  modalBody.innerHTML = `
    <h3>Edit Laboratory</h3>
    <p>
      <label>Building</label>
      <input value="${lab.building}" disabled>
    </p>
    <p>
      <label>Room</label>
      <input value="${lab.room}" disabled>
    </p>
    <p>
      <label>Capacity</label>
      <input id="editCapacity" type="number" value="${lab.capacity}" min="${reserved}">
    </p>
    <p>
      <label>
        <input type="checkbox" id="editOpen" ${lab.open ? "checked" : ""} ${reserved > 0 ? "disabled" : ""}>
        Open
      </label>
    </p>
    ${reserved > 0 ? `<small style="color:#9b1c1c;">Lab cannot be closed while reservations exist.</small>` : ""}
  `;

  modalFooter.innerHTML = `
    <button id="saveLabBtn" data-id="${id}">Save</button>
    <button style="background:#9b1c1c;" id="cancelLabBtn">Cancel</button>
  `;

  modal.style.display = "flex";
}

function deleteLab(id) {
  const lab = labs.find(l => l.id === id);

  modalBody.innerHTML = `
    <h3>Delete Laboratory</h3>
    <p>Are you sure you want to delete:</p>
    <strong>${lab.building} ${lab.room}</strong>
    <p style="color:#9b1c1c;">This action cannot be undone.</p>
  `;
  
  modalFooter.innerHTML = `
    <button style="background:#9b1c1c;" id="confirmDelete" data-id="${id}">Delete</button>
    <button id="cancelDelete">Cancel</button>
  `;

  modal.style.display = "flex";
}

/* Event handling modals*/
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

modalFooter.addEventListener("click", e => {
  // Save lab edits
  if (e.target.id === "saveLabBtn") {
    const id = parseInt(e.target.dataset.id);
    const editCapacity = parseInt(document.getElementById("editCapacity").value);
    const editOpen = document.getElementById("editOpen").checked;
    // Calculate max seats reserved in any slot
    const slotUsage = {};
    reservations
      .filter(r => r.labId === id)
      .forEach(res => {

        const key = `${res.date || "no-date"}-${res.time || "no-time"}`;

        if (!slotUsage[key]) {
          slotUsage[key] = 0;
        }

        slotUsage[key] += res.seats;
      });

    const reserved = Object.values(slotUsage)
      .reduce((max, seats) => seats > max ? seats : max, 0);
    if (Number.isNaN(editCapacity) || editCapacity < reserved) {
      return showModalWarning(`Capacity must be at least ${reserved}.`);
    }

    if (!editOpen && reserved > 0) {
      return showModalWarning("Cannot close a lab with existing reservations.");
    }

    const lab = labs.find(l => l.id === id);
    lab.capacity = editCapacity;
    lab.open = editOpen;

    closeModal();
    saveData();
    renderLabs();
    showpopUp(`Lab ${building} ${room} edited successfully!`);
  }

  // Cancel modal
  if (e.target.id === "cancelLabBtn" || e.target.id === "cancelDelete") {
    closeModal();
  }

  // Confirm deletion
  if (e.target.id === "confirmDelete") {
    const id = parseInt(e.target.dataset.id);
    labs = labs.filter(l => l.id !== id);
    closeModal();
    saveData();
    renderLabs();
    showpopUp(`Lab ${building} ${room} deleted.`);
  }
});

function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
  modalFooter.innerHTML = "";
  clearModalWarning();
}

/* Utilities */
function labHasReservations(labId) {
  return reservations.some(r => r.labId === labId);
}

function reservedSeatsForLab(labId) {
  return reservations
    .filter(r => r.labId === labId)
    .reduce((s, r) => s + r.seats, 0);
}

function showModalWarning(message) {
  let warn = document.getElementById("modalWarning");
  if (!warn) {
    warn = document.createElement("div");
    warn.id = "modalWarning";
    warn.className = "modal-warning";
    modalBody.prepend(warn);
  }
  warn.textContent = message;
}

function clearModalWarning() {
  const warn = document.getElementById("modalWarning");
  if (warn) warn.remove();
}

function saveData() {
  localStorage.setItem("labs", JSON.stringify(labs));
  localStorage.setItem("reservations", JSON.stringify(reservations));
}

initLabPage();

