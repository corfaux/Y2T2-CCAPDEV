const viewingStudent = JSON.parse(sessionStorage.getItem("viewingStudent"));
const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

const userToDisplay = viewingStudent || userToDisplay;
const isViewOnly = viewingStudent !== null;
const adminBackBtn = document.getElementById("adminBackBtn");

const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://labsys-d4fk.onrender.com";

// Return to admin page
if(isViewOnly && adminBackBtn) {
    adminBackBtn.style.display = "inline-block";

    adminBackBtn.addEventListener("click", () => {
        sessionStorage.removeItem("viewingStudent");
        window.location.href = "reservation-management.html";
    });
}

// Load user (student) data
if(userToDisplay) {
    // use _id if have it, fallback to idNumber
    localStorage.setItem("studentID", userToDisplay._id || userToDisplay.idNumber); 

    document.getElementById("first-name").value = userToDisplay.firstName || "";
    document.getElementById("last-name").value = userToDisplay.lastName || "";
    document.getElementById("email-address").value = userToDisplay.email || "";
    document.getElementById("contact-number").value = userToDisplay.contact || "";
    document.getElementById("id-num").value = userToDisplay.idNumber || "";
    document.getElementById("college-dropdown").value = userToDisplay.college || "none";
    document.getElementById("description").value = userToDisplay.description || "";
    document.querySelector(".profile-pic img").src = userToDisplay.photo || "images/default-profile-pic.jpg";
}

if(isViewOnly) {
    // Disable all inputs
    document.querySelectorAll("input, textarea, select").forEach(el => {
        el.disabled = true;
    });

    // Hide user-only buttons
    document.getElementById("delete-account-btn").style.display = "none";
    document.getElementById("update-pic-btn").style.display = "none";
    document.querySelector(".save-profile-btn").style.display = "none";
}


/******************** USER-ONLY FUNCTIONALITIES ********************/
// Functionality for updating profile picture
let profilePic = document.querySelector(".profile-pic img");
let updatePhoto = document.querySelector(".profile-pic input");

updatePhoto.onchange = () => {
    profilePic.src = URL.createObjectURL(updatePhoto.files[0]);
};

const profileForm = document.getElementById("profile-form");
const saveProfileButton = document.querySelector(".save-profile-btn");

let initialSnapshot = new FormData(profileForm);
const checkFormDifferences = () => {
    const currentSnapshot = new FormData(profileForm);
    let isChanged = false;

    for(let [key, currentValue] of currentSnapshot.entries()) {
        const initialValue = initialSnapshot.get(key);

        // Files need special treatment because they are Objects, not text
        if(currentValue instanceof File) {
            // If they picked a new file, its name won't be empty
            if(currentValue.name !== "") {
                isChanged = true;
                break;
            }
        } 
        // For standard text inputs (email, contactNumber, etc.)
        else if (currentValue !== initialValue) {
            isChanged = true;
            break; 
        }
    }

    saveProfileButton.disabled = !isChanged; 
};

// Enable "save profile" button if user changes profile details
profileForm.addEventListener("input", checkFormDifferences);
profileForm.addEventListener("change", checkFormDifferences);
profileForm.addEventListener("submit", async (e) => { // Saving changes to profile details
    e.preventDefault();

    try {
        const response = await fetch(`${BASE_URL}/api/accounts/save-profile`, {
            method: "POST",
            body: new FormData(profileForm)
        })

        const result = await response.json();
        if(response.ok) {
            alert("Account details saved.");

            saveProfileButton.disabled = true;
            initialSnapshot = new FormData(profileForm);

            // Update session storage (so no need to relogin, just restart page to see if changes saved)
            userToDisplay.firstName = document.getElementById("first-name").value;
            userToDisplay.lastName = document.getElementById("last-name").value;
            userToDisplay.email = document.getElementById("email-address").value;
            userToDisplay.contact = document.getElementById("contact-number").value;
            userToDisplay.idNumber = document.getElementById("id-num").value;
            userToDisplay.college = document.getElementById("college-dropdown").value;
            userToDisplay.description = document.getElementById("description").value;
            userToDisplay.photo = document.querySelector(".profile-pic img").src;

            sessionStorage.setItem("userToDisplay", JSON.stringify(userToDisplay));
        } else {
            alert(`Could not save changes: ${result.message}`);
        }
    } catch(err) {
        console.error("Saving error:", err);
        alert("Server error. Try again later.");
    }
});

// Account deletion by user
document.getElementById("delete-account-btn").addEventListener("click", async (e) => {
    if(!confirm("Are you sure you want to delete your account? This will also cancel all your current reservations.")) {
        return;
    }

    try {
        const email = JSON.parse(sessionStorage.getItem("userToDisplay")).email;
        const response = await fetch(`${BASE_URL}/api/accounts/${email}`, {
            method: "DELETE"
        });

        const result = await response.json();
        if(response.ok) {
            alert("Account successfully deleted.");
            
            sessionStorage.removeItem("userToDisplay"); 
            window.location.href = "index.html"; 
        } else {
            alert(`Could not delete account: ${result.message}`);
        }
    } catch(err) {
        console.error("Account deletion error:", err);
        alert("Server error. Try again later.");
    }
});