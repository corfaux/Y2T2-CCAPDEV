const currentUser =
    JSON.parse(sessionStorage.getItem("currentUser")) ||
    JSON.parse(sessionStorage.getItem("viewingStudent"));

const isViewOnly = sessionStorage.getItem("viewingStudent") !== null;
const adminBackBtn = document.getElementById("adminBackBtn");

// Return to admin page
if(isViewOnly && adminBackBtn) {
    adminBackBtn.style.display = "inline-block";

    adminBackBtn.addEventListener("click", () => {
        sessionStorage.removeItem("viewingStudent");
        window.location.href = "reservation-management.html";
    });
}

// Load student data for admin
if(currentUser) {
    // use _id if have it, fallback to idNumber
    localStorage.setItem("studentID", currentUser._id || currentUser.idNumber); 

    document.getElementById("first-name").value = currentUser.firstName || "";
    document.getElementById("last-name").value = currentUser.lastName || "";
    document.getElementById("email-address").value = currentUser.email || "";
    document.getElementById("contact-number").value = currentUser.contact || "";
    document.getElementById("id-num").value = currentUser.idNumber || "";
    document.getElementById("college-dropdown").value = currentUser.college || "none";
    document.getElementById("description").value = currentUser.description || "";
}

if(isViewOnly) {
    // Disable all inputs
    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.disabled = true;
    });

    // Hide photo update button and delete account button
    document.getElementById("update-pic-btn").style.display = "none";
    document.getElementById("delete-account-btn").style.display = "none";
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

// Account deletion by user
document.getElementById("delete-account-btn").addEventListener("click", async function(event) {
    if(!confirm("Are you sure you want to delete your account? This will also cancel all your current reservations.")) {
        return;
    }

    try {
        const email = JSON.parse(sessionStorage.getItem("currentUser")).email;
        const res = await fetch(`http://localhost:5000/api/accounts/${email}`, {
            method: "DELETE"
        });

        const result = await res.json();
        if(res.ok) {
            alert("Account successfully deleted.");
            
            sessionStorage.removeItem("currentUser"); 
            window.location.href = "index.html"; 
        } else {
            alert(`Could not delete account: ${result.message}`);
        }
    } catch(err) {
        console.error("Account deletion error:", err);
        alert("Server error. Try again later.");
    }
});