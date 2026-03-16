const userData = {
    "nico_yazawa@dlsu.edu.ph": {
        password: "niconiconii",
        firstName: "Nico",
        lastName: "Yazawa",
        email: "nico_yazawa@dlsu.edu.ph",
        contactNumber: "091234567",
        idNumber: "12312036",
        college: "CLA",
        description: "Communication Arts - The greatest idol in the world!"
    },
    "maki_nishikino@dlsu.edu.ph": {
        password: "password",
        firstName: "Maki",
        lastName: "Nishikino",
        email: "maki_nishikino@dlsu.edu.ph",
        contactNumber: "091234567",
        idNumber: "12511068",
        college: "RVRCOB",
        description: "BS Accounting."
    },
    "char_aznable@dlsu.edu.ph": {
        password: "password",
        firstName: "Char",
        lastName: "Aznable",
        email: "char_aznable@dlsu.edu.ph",
        contactNumber: "091234567",
        idNumber: "12215555",
        college: "CCS",
        description: "BSMS Computer Science"
    }
}

const technicianCredentials = {
    "paul_placer@dlsu.edu.ph": "notyourpassword",
    "ashley_reyes@dlsu.edu.ph": "hungryaf1234"
}

const labData = [
  {
    id: 1,
    building: "Gokongwei",
    room: "GK303",
    capacity: 30,
    open: true
  },
  {
    id: 2,
    building: "Velasco",
    room: "VL204",
    capacity: 25,
    open: true
  },
  {
    id: 3,
    building: "Miguel",
    room: "MH101",
    capacity: 20,
    open: false
  }
];

const reservationData = [
  {
    id: 1,
    name: "Nico Yazawa",
    email: "nico_yazawa@dlsu.edu.ph",
    labId: 1,
    date: "2026-02-12",
    time: "9:00 AM",
    seats: 2,
    companions: "Maki Nishikino"
  },

  {
    id: 2,
    name: "Maki Nishikino",
    email: "maki_nishikino@dlsu.edu.ph",
    labId: 1,
    date: "2026-02-12",
    time: "9:00 AM",
    seats: 3,
    companions: ""
  },

  {
    id: 3,
    name: "Char Aznable",
    email: "char_aznable@dlsu.edu.ph",
    labId: 2,
    date: "2026-02-13",
    time: "1:30 PM",
    seats: 1,
    companions: ""
  },

  {
    id: 4,
    name: "Nico Yazawa",
    email: "nico_yazawa@dlsu.edu.ph",
    labId: 2,
    date: "2026-02-13",
    time: "2:00 PM",
    seats: 4,
    companions: "The Best School Idols"
  },

  {
    id: 5,
    name: "Maki Nishikino",
    email: "maki_nishikino@dlsu.edu.ph",
    labId: 1,
    date: "2026-02-14",
    time: "10:30 AM",
    seats: 2,
    companions: ""
  },

  {
    id: 6,
    name: "Char Aznable",
    email: "char_aznable@dlsu.edu.ph",
    labId: 1,
    date: "2026-02-14",
    time: "10:30 AM",
    seats: 5,
    companions: "Some Guy"
  }
];
if (!localStorage.getItem("labs")) {
  localStorage.setItem("labs", JSON.stringify(labData));
}

if (!localStorage.getItem("reservations")) {
  localStorage.setItem("reservations", JSON.stringify(reservationData));
}

// Sample time slot data (mirrors the MongoDB TimeSlots collection schema)
// Each slot represents an available booking interval.
const timeSlotData = (function() {
  const slots = [];
  let hour = 7;
  let minute = 30;
  let id = 1;

  // Generate 30-minute slots from 07:30 until 21:00
  while (hour < 21 || (hour === 21 && minute === 0)) {
    const startTime = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
    const totalMinutes = hour * 60 + minute + 30;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const endTime = String(endHour).padStart(2, "0") + ":" + String(endMinute).padStart(2, "0");

    slots.push({ id: id++, startTime, endTime });

    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
})();

// Persist time slots locally for quick access (simulating a DB collection)
if (!localStorage.getItem("timeSlots")) {
  localStorage.setItem("timeSlots", JSON.stringify(timeSlotData));
}
