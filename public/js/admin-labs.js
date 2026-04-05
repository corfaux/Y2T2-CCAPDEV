const buildingInput = document.getElementById("buildingInput");
const codeInput = document.getElementById("codeInput");
const roomInput = document.getElementById("roomInput");
const capacityInput = document.getElementById("capacityInput");
const addLabBtn = document.querySelector(".controls button");
const popUp = document.getElementById("popupMessage");
const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://labsys-d4fk.onrender.com";
let labs = [];

/* Initialize */
document.querySelector(".logout").addEventListener("click", async (e) => {
    try {
        const response = await fetch("/api/accounts/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        if(response.ok) {
            sessionStorage.clear()
            window.location.href = "/index.html";
        }
    } catch(err) {
        console.error("Error logging out:", err);
    }
});

async function initLabPage() {
  await fetchLabs();
}

async function fetchLabs() {
  try {
    const res = await fetch(`${BASE_URL}/api/labs`);
    labs = await res.json();
    renderLabs();
  } catch (err) {
    console.error(err);
    showpopUp("Failed to load labs");
  }
}


/* Load labs */
async function renderLabs() {
  labsTable.innerHTML = "";

  for (const l of labs) {
    const hasRes = await labHasReservations(l._id);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${l.buildingID?.name}</td>
      <td>${l.room}</td> <!--RoomNumber-->
      <td>${l.capacity}</td>
      <td><input type="checkbox" ${l.availability ? "checked" : ""} disabled></td>
      <td><button class="edit-lab" data-id="${l._id}">Edit</button></td>
      <td><button class="delete-lab ${hasRes ? "disabled-delete" : ""}" 
          data-id="${l._id}" ${hasRes ? "disabled" : ""}>✖</button></td>
    `;

    labsTable.appendChild(tr);
  }
}

/* Adding a lab */
addLabBtn.addEventListener("click", async () => {
  const buildingName = buildingInput.value.trim();
  const buildingCode = codeInput.value.trim();
  const room = buildingCode + roomInput.value.trim();
  const capacity = parseInt(capacityInput.value);

  if (!buildingName || !buildingCode || !room) {
    return showpopUp("All fields are required.");
  }

  if (Number.isNaN(capacity) || capacity <= 0) {
    return showpopUp("Capacity must be greater than 0.");
  }

  try {
    let building;

    // Try to fetch existing building
    const bRes = await fetch(`${BASE_URL}/api/buildings/code/${buildingCode}`);

    if (bRes.ok) {
      building = await bRes.json();
    } else {
      // Create building if not found
      const name = prompt("Enter building name:");

      if (!name) return showpopUp("Building name required");

      const createRes = await fetch(`${BASE_URL}/api/buildings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code: buildingCode })
      });

      if (!createRes.ok) {
        throw new Error("Failed to create building");
      }

      building = await createRes.json();
    }

    // Create lab
    const labRes = await fetch(`${BASE_URL}/api/labs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        buildingID: building._id,
        room,
        capacity
      })
    });

    if (!labRes.ok) throw new Error();

    showpopUp("Lab added successfully!");

    buildingInput.value = "";
    roomInput.value = "";
    capacityInput.value = "";

    fetchLabs();

  } catch (err) {
    console.error(err);
    showpopUp("Error adding lab");
  }
});

/* Edit/Delete labs */
labsTable.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;

  if (btn.classList.contains("edit-lab")) editLab(id);
  if (btn.classList.contains("delete-lab") && !btn.disabled) deleteLab(id);
});

/* Edit Popup */
function editLab(id) {
  const lab = labs.find(l => l._id === id);

  modalBody.innerHTML = `
    <h3>Edit Laboratory</h3>

    <p>
      <label>Building</label>
      <input value="${lab.buildingID?.name}" disabled>
    </p>

    <p>
      <label>Room</label>
      <input value="${lab.room}" disabled>
    </p>

    <p>
      <label>Capacity</label>
      <input id="editCapacity" type="number" value="${lab.capacity}">
    </p>

    <p>
      <label> <input type="checkbox" id="editOpen" ${lab.availability ? "checked" : ""}>
        Open
      </label>
    </p>
  `;

  modalFooter.innerHTML = `
  <button id="saveLabBtn" data-id="${id}">Save</button>
  <button id="cancelLabBtn" style="background:#9b1c1c;">Cancel</button>
  `;
  modal.style.display = "flex";
}

function deleteLab(id) {
  const lab = labs.find(l => l._id === id);

  const buildingName = lab?.buildingID?.name || "N/A";
  const room = lab?.room || "";

  modalBody.innerHTML = `
    <h3>Delete Laboratory</h3>
    <p>Are you sure you want to delete?</p>
    <br> <strong>  ${buildingName} ${room}</strong> <br><br>
    <p style="color:#9b1c1c;">This action cannot be undone.</p>
  `;

  modalFooter.innerHTML = `
    <div class="modal-footer">
      <button id="confirmDelete" data-id="${id}" class="btn-delete" style="background:#9b1c1c;">Delete</button>
      <button id="cancelDelete">Cancel</button>
    </div>
  `;

  modal.style.display = "flex";
}

// Handle modal footer clicks (Edit Save / Delete / Cancel)
modalFooter.addEventListener("click", async (e) => {

  // Save edits made
  if (e.target.id === "saveLabBtn") {
    const id = e.target.dataset.id;
    const capacity = parseInt(document.getElementById("editCapacity").value);
    const availability = document.getElementById("editOpen").checked;

    if (Number.isNaN(capacity) || capacity <= 0) {
      return showModalWarning("Capacity must be greater than 0.");
    }

    try {
      await fetch(`${BASE_URL}/api/labs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacity, availability })
      });

      closeModal();
      fetchLabs();
      showpopUp("Lab updated");

    } catch (err) {
      console.error(err);
      showModalWarning("Failed to edit lab.");
    }
  }

  // Cancel
  if (e.target.id === "cancelLabBtn" || e.target.id === "cancelDelete") {
    closeModal();
  }

  // Confirm
  if (e.target.id === "confirmDelete") {
    const id = e.target.dataset.id;

    try {
      await fetch(`${BASE_URL}/api/labs/${id}`, {
        method: "DELETE"
      });

      closeModal();
      fetchLabs();
      showpopUp("Lab deleted successfully");

    } catch (err) {
      console.error(err);
      showModalWarning("Failed to delete lab.");
    }
  }
});

function closeModal() {
  modal.style.display = "none";
  modalBody.innerHTML = "";
  modalFooter.innerHTML = "";
}

/* Utilities */
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

async function labHasReservations(labId) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const res = await fetch(`${BASE_URL}/api/reservations?labID=${labId}`);

    if (!res.ok) return false;

    const data = await res.json();
    return Array.isArray(data) && data.length > 0;

  } catch {
    return false;
  }
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

initLabPage();

