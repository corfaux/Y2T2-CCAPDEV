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


// generate time slot buttons for each room based on the selected date
function generateTimeSlots(selectedDate) {
  roomGrid.innerHTML = "";
  selectedSlots = [];
  continueButton.disabled = true;

  const building = document.getElementById("venueSelect").value;
  const rooms = buildingRooms[building] || [];
  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  rooms.forEach(room => {
    const row = document.createElement("div");
    row.classList.add("room-row");

    // room label on the left of each row
    const label = document.createElement("div");
    label.classList.add("room-label");
    label.textContent = room;

    // container for the time slot buttons
    const slotsContainer = document.createElement("div");
    slotsContainer.classList.add("room-slots");

    let hour = 7;
    let minute = 30;

    // get the class schedule for this room on the selected day (if any)
    const roomSchedule = (classSchedule[dayName] && classSchedule[dayName][room]) || [];

    // create 30-minute interval time slots from 7:30 to 21:00
    for (let i = 0; i < 28; i++) {
      const timeStr =
        String(hour).padStart(2, "0") + ":" +
        String(minute).padStart(2, "0");

      const button = document.createElement("button");
      button.textContent = timeStr;
      button.classList.add("timeslot");

      // disable slot if it is occupied by a class or falls within a blocked time range
      if (isTimeBlocked(timeStr, roomSchedule)) {
        button.disabled = true;
        button.classList.add("occupied");
      }

      // select/deselect slot on click, with a maximum of 6 slots (3 hours)
      button.addEventListener("click", () =>
        toggleSlot(button, `${room} ${timeStr}`)
      );

      slotsContainer.appendChild(button);

      // move forward by 30 minutes
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }

    row.appendChild(label);
    row.appendChild(slotsContainer);
    roomGrid.appendChild(row);
  });
}

// convert a time string (HH:MM) into total minutes since midnight
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// check if a time string is blocked based on an array of {start, end} ranges
function isTimeBlocked(timeStr, ranges) {
  const minutes = timeToMinutes(timeStr);
  return ranges.some(range => {
    const start = timeToMinutes(range.start);
    const end = timeToMinutes(range.end);
    return minutes >= start && minutes < end;
  });
}

// handle selecting and deselecting time slots
function toggleSlot(button, value) {
  if (selectedSlots.includes(value)) {
    selectedSlots = selectedSlots.filter(v => v !== value);
    button.classList.remove("selected");
  } else {
    if (selectedSlots.length >= MAX_SLOTS) {
      showpopUp("You can only reserve up to 3 hours (6 time slots).");
      return;
    }

    selectedSlots.push(value);
    button.classList.add("selected");
  }

  continueButton.disabled = selectedSlots.length === 0;
}

// generate a list of all possible time labels (07:30 to 21:00)
const timeSlots = [];
let hour = 7;
let minute = 30;

while (hour < 21 || (hour === 21 && minute === 0)) { // stop at 21:00
  const timeStr = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
  timeSlots.push(timeStr);

  minute += 30;
  if (minute === 60) {
    minute = 0;
    hour++;
  }
}

// reference to the time header row
const timeHeader = document.getElementById("timeHeader");

// create the time header labels
function generateTimeHeader() {
  timeHeader.innerHTML = "<div></div>"; // empty corner

  timeSlots.forEach(time => {
    const cell = document.createElement("div");
    cell.textContent = time;
    timeHeader.appendChild(cell);
  });
}

// reference to the schedule grid
const scheduleGrid = document.getElementById("scheduleGrid");

// generate the schedule grid view for the selected building and date
function generateSchedule(building, selectedDate) {
  scheduleGrid.innerHTML = "";
  selectedSlots = [];
  continueButton.disabled = true;

  const rooms = buildingRooms[building] || [];
  const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" });

  rooms.forEach(room => {
    const row = document.createElement("div");
    row.classList.add("room-row");

    const label = document.createElement("div");
    label.classList.add("room-label");
    label.textContent = room;

    row.appendChild(label);

    const roomSchedule = (classSchedule[dayName] && classSchedule[dayName][room]) || [];

    timeSlots.forEach(time => {
      const cell = document.createElement("div");
      cell.classList.add("time-cell");

      // mark cell as unavailable if blocked by class schedule
      if (isTimeBlocked(time, roomSchedule)) {
        cell.classList.add("unavailable");
      }

      cell.addEventListener("click", () => {
        if (cell.classList.contains("unavailable")) return;

        const value = `${room} ${time}`;

        if (selectedSlots.includes(value)) {
          selectedSlots = selectedSlots.filter(v => v !== value);
          cell.classList.remove("selected");
        } else {
          if (selectedSlots.length >= MAX_SLOTS) {
            showpopUp("You can only reserve up to 3 hours (6 slots).");
            return;
          }

          selectedSlots.push(value);
          cell.classList.add("selected");
        }

        continueButton.disabled = selectedSlots.length === 0;
      });

      row.appendChild(cell);
    });

    scheduleGrid.appendChild(row);
  });
}

// handle clicking the "Show Availability" button
document.getElementById("showAvailability").addEventListener("click", () => {
  const building = document.getElementById("venueSelect").value;
  const dateValue = document.getElementById("reservationDate").value;

  // stop if building or date is missing
  if (!building || !dateValue) return;

  const selectedDate = new Date(dateValue);

  // do not allow reservations on sundays
  if (selectedDate.getDay() === 0) {
    showpopUp("Reservations are not allowed on Sundays.");
    hideAvailability();
    return;
  }

  // do not allow dates outside the booking week
  if (!isWithinBookingWindow(selectedDate)) {
    showpopUp("You have reached the end of the bookable window. No availability will be shown past this point.");
    hideAvailability();
    return;
  }

  // all checks passed = show available time slots
  document.querySelector(".timeslot-section").style.display = "block";

  generateTimeHeader();
  generateSchedule(building, selectedDate);
  generateTimeSlots(selectedDate);
});

// save reservation data and move to the next page
continueButton.addEventListener("click", () => {
  localStorage.setItem("selectedSlots", JSON.stringify(selectedSlots));
  localStorage.setItem("venue", document.getElementById("venueSelect").value);
  localStorage.setItem("date", document.getElementById("reservationDate").value);
  localStorage.setItem("seats", document.getElementById("seatCount").value);

  window.location.href = "details.html";
});
