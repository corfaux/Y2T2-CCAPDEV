const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));


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

