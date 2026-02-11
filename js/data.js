const userData = {
    "nico_yazawa@dlsu.edu.ph": {
        password: "niconiconii",
        firstName: "Nico",
        lastName: "Yazawa",
        email: "nico_yazawa@dlsu.edu.ph",
        contactNumber: "091234567",
        idNumber: "12312036",
        college: "CLA",
        description: ""
    },
    "maki_nishikino@dlsu.edu.ph": {
        password: "password",
        firstName: "Maki",
        lastName: "Nishikino",
        email: "maki_nishikino@dlsu.edu.ph",
        contactNumber: "091234567",
        idNumber: "12511068",
        college: "RVRCOB",
        description: ""
    },
    "char_aznable@dlsu.edu.ph": {
        password: "password",
        firstName: "Char",
        lastName: "Aznable",
        email: "char_aznable@dlsu.edu.ph",
        contactNumber: "091234567",
        idNumber: "12215555",
        college: "CCS",
        description: ""
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

if(!localStorage.getItem("users")){
    localStorage.setItem("users", JSON.stringify(userData));
}

if (!localStorage.getItem("labs")) {
  localStorage.setItem("labs", JSON.stringify(labData));
}

if (!localStorage.getItem("reservations")) {
  localStorage.setItem("reservations", JSON.stringify(reservationData));
}
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(userData));
}


