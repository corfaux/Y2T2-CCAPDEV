const currentUser =
  JSON.parse(sessionStorage.getItem("currentUser")) ||
  JSON.parse(sessionStorage.getItem("viewingStudent"));

const isViewOnly = sessionStorage.getItem("viewingStudent") !== null;
const adminBackBtn = document.getElementById("adminBackBtn");

// Return to admin page
if(isViewOnly && adminBackBtn){
    adminBackBtn.style.display = "inline-block";

    adminBackBtn.addEventListener("click", () => {
        sessionStorage.removeItem("viewingStudent");
        window.location.href = "reservation-management.html";
    });
}

// Load student data for admin
if(currentUser){

  document.getElementById("first-name").value = currentUser.firstName || "";
  document.getElementById("last-name").value = currentUser.lastName || "";
  document.getElementById("email-address").value = currentUser.email || "";
  document.getElementById("contact-number").value = currentUser.contact || "";
  document.getElementById("id-num").value = currentUser.idNumber || "";
  document.getElementById("college-dropdown").value = currentUser.college || "none";
}

if(isViewOnly){

  // Disable all inputs
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.disabled = true;
  });

  // Hide photo update button
  document.querySelector(".update-pic-btn").style.display = "none";
}

// Functionality for updating profile picture
let profilePic = document.querySelector(".profile-pic img");
let updatePhoto = document.querySelector(".profile-pic input");

updatePhoto.onchange = function() {
    profilePic.src = URL.createObjectURL(updatePhoto.files[0]);
};

// document.getElementById("logout-btn").addEventListener("onclick", function(event) {
//     const contactNumber = document.getElementById("contact-number").value;
//     const idNumber = document.getElementById("id-num").value;
//     const college = document.getElementById("college-dropdown").value;


// });

