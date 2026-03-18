const roomGrid = document.getElementById("roomGrid");
const continueButton = document.getElementById("continueButton");

let selectedSlots = [];
const MAX_SLOTS = 6;

// list of buildings and the rooms inside each building
const buildingRooms = {
  GK: ["GK210", "GK211", "GK302A", "GK302B", "GK304B", "GK306A", 
    "GK306B", "GK404A", "GK404B"],
  LS: ["LS212", "LS229", "LS320", "LS335"],
  SJ: ["SJ212"],
  VL: ["VL103", "VL205", "VL206", "VL208A", "VL208B", "VL301", "VL310"],
  AG: ["AG1904"],
  C: ["C314"],
  Y: ["Y602"]
};

// actual class schedules used to block unavailable time slots in the reservation system
const classSchedule = {
  Monday: {
    AG1904: [
      { start: "07:30", end: "17:45" }
    ],
    C314: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "16:00" },
      { start: "18:00", end: "21:00" } 
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK211: [
      { start: "07:30", end: "09:00" },
      { start: "10:45", end: "12:15" }
    ],
    GK302A: [
      { start: "09:15", end: "12:30" }
    ],
    GK304B: [
      { start: "07:30", end: "17:45" }
    ],
    GK306A: [
      { start: "09:15", end: "10:45" },
      { start: "14:30", end: "16:00" }
    ],
    GK306B: [
      { start: "09:15", end: "10:45" },
      { start: "14:30", end: "16:00" }
    ],
    GK404A: [
      { start: "14:30", end: "17:45" }
    ],
    GK404B: [
      { start: "07:30", end: "17:45" }
    ],
    LS229: [
      { start: "09:15", end: "12:30" },
      { start: "14:30", end: "21:00" }
    ],
    LS320: [
      { start: "09:15", end: "12:30" },
      { start: "14:30", end: "21:00" }
    ],
    LS335: [
      { start: "07:30", end: "21:00" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL205: [
      { start: "07:30", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "21:00" }
    ],
    VL208A: [
      { start: "07:30", end: "17:45" }
    ],
    VL208B: [
      { start: "07:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    VL310: [
      { start: "07:30", end: "17:45" }
    ],
    Y602: [
      { start: "11:00", end: "14:15" }
    ] 
  },

  Tuesday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    C314: [
      { start: "07:30", end: "19:30" }
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK211: [
      { start: "09:15", end: "16:00" }
    ],
    GK302A: [
      { start: "12:45", end: "14:15" }
    ],
    GK302B: [
      { start: "12:45", end: "14:15" }
    ],
    GK304A: [
      { start: "12:45", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "19:30" }
    ],
    GK306A: [
      { start: "07:30", end: "10:45" }
    ],
    GK306B: [
      { start: "07:30", end: "10:45" }
    ],
    GK404A: [
      { start: "12:45", end: "16:00" }
    ],
    GK404B: [
      { start: "07:30", end: "17:45" }
    ],
    SJ212: [
      { start: "09:15", end: "14:15" },
      { start: "18:00", end: "19:30" }
    ],
    LS212: [
      { start: "11:00", end: "12:30" },
      { start: "14:30", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    LS229: [
      { start: "09:15", end: "21:00" }
    ],
    LS320: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    LS335: [
      { start: "07:30", end: "19:30" }
    ],
    VL103: [
      { start: "11:00", end: "17:45" }
    ],
    VL205: [
      { start: "11:00", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "10:45" },
      { start: "14:30", end: "17:45" }
    ],
    VL208A: [
      { start: "07:30", end: "17:45" }
    ],
    VL208B: [
      { start: "14:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    VL310: [
      { start: "11:00", end: "14:15" }
    ],
    Y602: [
      { start: "07:30", end: "16:00" }
    ] 
  },

  Wednesday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "10:45" }
    ],
    GK404B: [
      { start: "07:30", end: "10:45" }
    ],
    SJ212: [
      { start: "09:15", end: "12:30" }
    ],
    LS320: [
      { start: "09:15", end: "10:45" },
      { start: "19:45", end: "21:00" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL205: [
      { start: "11:00", end: "14:15" }
    ],
    VL206: [
      { start: "07:30", end: "14:15" }
    ],
    VL208A: [
      { start: "07:30", end: "14:15" }
    ],
    VL208B: [
      { start: "07:30", end: "14:15" }
    ],
    VL301: [
      { start: "07:30", end: "14:15" }
    ],
    VL310: [
      { start: "07:30", end: "14:15" }
    ]
  },

  Thursday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    C314: [
      { start: "09:15", end: "10:45" },
      { start: "12:45", end: "14:15" },
      { start: "16:15", end: "17:45" }
    ],
    GK210: [
      { start: "09:15", end: "10:45" },
      { start: "14:30", end: "17:45" }
    ],
    GK211: [
      { start: "09:15", end: "12:30" }
    ],
    GK302A: [
      { start: "07:30", end: "12:30" },
      { start: "14:30", end: "17:45" }
    ],
    GK302B: [
      { start: "09:15", end: "16:00" }
    ],
    GK304A: [
      { start: "07:30", end: "10:45" },
      { start: "14:30", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "14:15" }
    ],
    GK306A: [
      { start: "07:30", end: "09:00" },
      { start: "12:45", end: "16:00" }
    ],
    GK306B: [
      { start: "09:15", end: "16:00" }
    ],
    GK404A: [
      { start: "09:15", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    GK404B: [
      { start: "11:00", end: "12:30" }
    ],
    SJ212: [
      { start: "09:15", end: "12:30" }
    ],
    LS229: [
      { start: "09:15", end: "16:00" }
    ],
    LS320: [
      { start: "11:00", end: "12:30" }
    ],
    LS335: [
      { start: "07:30", end: "14:15" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL205: [
      { start: "07:30", end: "10:45" },
      { start: "14:30", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "17:45" }
    ],
    VL208A: [
      { start: "11:00", end: "17:45" }
    ],
    VL208B: [
      { start: "07:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    VL310: [
      { start: "07:30", end: "17:45" }
    ],
    Y602: [
      { start: "11:00", end: "14:15" }
    ] 
  },

  Friday: {
    AG1904: [
      { start: "07:30", end: "14:15" }
    ],
    C314: [
      { start: "07:30", end: "16:00" }
    ],
    GK210: [
      { start: "09:15", end: "12:30" },
      { start: "14:30", end: "16:00" },
      { start: "18:00", end: "19:30" }
    ],
    GK211: [
      { start: "09:15", end: "16:00" }
    ],
    GK302A: [
      { start: "09:15", end: "14:15" },
      { start: "16:15", end: "17:45" }
    ],
    GK302B: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "16:00" }
    ],
    GK304B: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "14:15" }
    ],
    GK306A: [
      { start: "09:15", end: "10:45" }
    ],
    GK306B: [
      { start: "09:15", end: "10:45" }
    ],
    GK404A: [
      { start: "07:30", end: "16:00" }
    ],
    GK404B: [
      { start: "09:15", end: "10:45" }
    ],
    SJ212: [
      { start: "11:00", end: "12:30" },
      { start: "14:30", end: "16:00" }
    ],
    LS212: [
      { start: "09:15", end: "12:30" }
    ],
    LS229: [
      { start: "09:15", end: "17:45" }
    ],
    LS335: [
      { start: "07:30", end: "10:45" },
      { start: "12:45", end: "14:15" }
    ],
    VL103: [
      { start: "07:30", end: "17:45" }
    ],
    VL206: [
      { start: "07:30", end: "17:45" }
    ],
    VL208A: [
      { start: "07:30", end: "17:45" }
    ],
    VL208B: [
      { start: "14:30", end: "17:45" }
    ],
    VL301: [
      { start: "07:30", end: "17:45" }
    ],
    Y602: [
      { start: "14:30", end: "16:00" }
    ] 
  },

  Saturday: {
    GK210: [
      { start: "09:15", end: "12:30" }
    ],
    GK211: [
      { start: "11:00", end: "14:30" }
    ],
    GK304B: [
      { start: "09:15", end: "12:30" }
    ],
    GK404A: [
      { start: "09:15", end: "12:30" }
    ],
    LS335: [
      { start: "12:45", end: "16:00" }
    ]
  }
}

// reference to the popup element used for warnings and messages
const popUp = document.getElementById("popupMessage");

// reference to the date input field
const dateInput = document.getElementById("reservationDate");

// get today’s date and current year
const today = new Date();
const year = today.getFullYear();

// set the earliest selectable date to today
dateInput.min = formatDate(today);

// set the latest selectable date to December 31 of the current year
const endOfYear = new Date(year, 11, 31);
dateInput.max = formatDate(endOfYear);

// show warning message if trying to book past 6 hours
function showPopUp(message) {
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

// convert a date object into YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// get monday of the week for a given date
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 means sunday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// check if selected date is within current bookable week
function isWithinBookingWindow(selectedDate) {
  const now = new Date();

  // nothing bookable if today is sunday
  if (now.getDay() === 0) return false;

  const weekStart = getMonday(now); // monday of current week
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 5); // saturday

  return selectedDate >= weekStart && selectedDate <= weekEnd;
} 

// hide the time slots container and disable the continue button
function hideAvailability() {
  document.querySelector(".timeslot-section").style.display = "none";
  continueButton.disabled = true;
}

// fetch booked slots for all rooms in a building on a given date
async function getBookedSlots(building, selectedDate) {
  const rooms = buildingRooms[building] || [];
  const allBookedSlotIds = [];

  for (const labID of rooms) {
    try {
      const res = await fetch(`http://localhost:5000/api/reservations?labID=${labID}&date=${formatDate(selectedDate)}`);
      if (!res.ok) {
        console.warn(`Failed to fetch reservations for ${labID}`);
        continue;
      }

      const bookings = await res.json();
      bookings.forEach(b => allBookedSlotIds.push(`${labID}_${b.startTime}_${b.endTime}`));
    } catch (err) {
      console.error(`Error fetching reservations for ${labID}:`, err);
    }
  }

  return allBookedSlotIds;
}

// convert a time string (HH:MM) into total minutes since midnight
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// check if a time slot is blocked based on an array of {start, end} ranges
function isSlotBlocked(slot, ranges) {
  const slotStart = timeToMinutes(typeof slot === "string" ? slot : slot.startTime);
  const slotEnd = timeToMinutes(typeof slot === "string" ? slot : slot.endTime);

  return ranges.some(range => {
    const start = timeToMinutes(range.start);
    const end = timeToMinutes(range.end);

    // overlap check: slot starts before range ends AND slot ends after range starts
    return slotStart < end && slotEnd > start;
  });
}

// handle selecting and deselecting time slots
function toggleSlot(room, slot, button) {
  const slotId = slot.id ?? slot._id ?? `${slot.startTime}-${slot.endTime}`;
  const existingIndex = selectedSlots.findIndex(s => s.room === room && s.slotId === slotId);

  if (existingIndex >= 0) {
    selectedSlots.splice(existingIndex, 1);
    button.classList.remove("selected");
  } else {
    if (selectedSlots.length >= MAX_SLOTS) {
      showPopUp("You can only reserve up to 3 hours (6 time slots).");
      return;
    }

    selectedSlots.push({
      room,
      slotId,
      startTime: slot.startTime,
      endTime: slot.endTime
    });

    button.classList.add("selected");
  }

  continueButton.disabled = selectedSlots.length === 0;
}

let timeSlots = [];

async function loadTimeSlots(building, selectedDate) {
  try {
    // always generate default slots (30-min intervals)
    timeSlots = generateDefaultTimeSlots();
  } catch (err) {
    console.error("Failed to generate time slots:", err);
    timeSlots = [];
  }
}

// if it fails to load from the backend, generate default 30-minute slots from 7:30 to 21:00
function generateDefaultTimeSlots() {
  const slots = [];
  let hour = 7;
  let minute = 30;
  let id = 1;

  while (hour < 21 || (hour === 21 && minute === 0)) {
    const startTime = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
    const totalMinutes = hour * 60 + minute + 30;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const endTime = String(endHour).padStart(2, "0") + ":" + String(endMinute).padStart(2, "0");

    // assign a temporary ID
    slots.push({_id: `fallback-${startTime}-${endTime}`, startTime, endTime});

    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
} 

// reference to the time header row
const timeHeader = document.getElementById("timeHeader");

// create the time header labels
function generateTimeHeader() {
  timeHeader.innerHTML = "<div></div>";

  timeSlots.forEach(slot => {
    const cell = document.createElement("div");
    cell.textContent = slot.startTime;
    timeHeader.appendChild(cell);
  });
}

// reference to the schedule grid
const scheduleGrid = document.getElementById("scheduleGrid");

// generate the schedule grid view for the selected building and date
async function generateSchedule(building, selectedDate) {
  scheduleGrid.innerHTML = "";
  selectedSlots = [];
  continueButton.disabled = true;

  const rooms = buildingRooms[building] || [];
  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  // fetch all booked slots for this building and date
  const bookedSlotIds = await getBookedSlots(building, selectedDate);

  rooms.forEach(room => {
    const row = document.createElement("div");
    row.classList.add("room-row");

    const label = document.createElement("div");
    label.classList.add("room-label");
    label.textContent = room;

    row.appendChild(label);

    // get class schedule for this room
    const roomSchedule = (classSchedule[dayName] && classSchedule[dayName][room]) || [];

    timeSlots.forEach(slot => {
      const cell = document.createElement("div");
      cell.classList.add("time-cell");
      cell.dataset.slotId = slot._id || slot.id;
      cell.dataset.startTime = slot.startTime;
      cell.dataset.endTime = slot.endTime;

      // mark cell as unavailable if blocked by class schedule
      if (bookedSlotIds.includes(`${room}_${slot.startTime}_${slot.endTime}`) || isSlotBlocked(slot, roomSchedule)) {
        cell.classList.add("unavailable");
      }

      // click to select/deselect slot
      cell.addEventListener("click", () => {
        if (!cell.classList.contains("unavailable")) 
          toggleSlot(room, slot, cell);
      });

      row.appendChild(cell);
    });

    scheduleGrid.appendChild(row);
  });
}

// handle clicking the "Show Availability" button
document.getElementById("showAvailability").addEventListener("click", async()=>{
  const building=document.getElementById("venueSelect").value;
  const dateValue=document.getElementById("reservationDate").value;
  if(!building || !dateValue) return;

  const selectedDate=new Date(dateValue);

  if(selectedDate.getDay()===0){
    showPopUp("Reservations are not allowed on Sundays.");
    hideAvailability(); return;
  }

  if(!isWithinBookingWindow(selectedDate)){
    showPopUp("You have reached the end of the bookable window.");
    hideAvailability(); return;
  }

  // Load time slots first
  await loadTimeSlots(building, selectedDate);

  document.querySelector(".timeslot-section").style.display="block";
  generateTimeHeader();
  generateSchedule(building, selectedDate);
});

let labMap = {};
async function loadLabsMap() {
  const res = await fetch("http://localhost:5000/api/labs");
  const labs = await res.json();
  labs.forEach(l => labMap[l.room] = l._id);
}

// save reservation data and move to the next page
continueButton.addEventListener("click", async () => {
  // const labID = document.getElementById("venueSelect").value;
  const date = document.getElementById("reservationDate").value;
  const seats = parseInt(document.getElementById("seatCount").value, 10);
  
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const studentID = currentUser?._id;
  if (!studentID) {
    showPopUp("Invalid student ID. Please log in again.");
    return;
  }

  for (const slot of selectedSlots) {
    try {
      if (!labMap[slot.room]) {
        showPopUp(`Lab ID not found for room ${slot.room}`);
        continue;
      }
      const res = await fetch("http://localhost:5000/api/slots/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labID: labMap[slot.room], //slot.room,
          studentID: studentID,  
          startTime: slot.startTime,
          endTime: slot.endTime,
          date,
          seats
        })
      });

      const text = await res.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.warn("Response is not valid JSON:", text);
        data = { message: "Server returned invalid response" };
      }

      if (!res.ok) showPopUp(data.message || "Failed to book slot");
    } catch (err) {
      console.error("Booking error:", err);
      showPopUp("Server error. Try again later.");
    }
  }

  // keep your redirect to the next page
  window.location.href = "details.html";
});

window.addEventListener("DOMContentLoaded", async () => {
   // fetch backend timeslots before rendering
   await loadLabsMap();
});
