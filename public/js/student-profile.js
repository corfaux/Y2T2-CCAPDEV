const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://labsys-d4fk.onrender.com";

document.getElementById("logout-btn").addEventListener("click", async (e) => {
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

const firstNameField = document.getElementById("first-name");
const firstNameError = document.querySelector("#first-name + .error");
const lastNameField = document.getElementById("last-name");
const lastNameError = document.querySelector("#last-name + .error");
const contactNumberField = document.getElementById("contact-number");
const contactNumberError = document.querySelector("#contact-number + .error");

// Saving changes to profile details
profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Form validation
    let invalidInput = false;
    if(!firstNameField.value) {
        invalidInput = true;
        firstNameField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        firstNameError.setAttribute("style", "visibility: visible");
    }
    if(!lastNameField.value) {
        invalidInput = true;
        lastNameField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        lastNameError.setAttribute("style", "visibility: visible");
    }
    // Only check contact number if it is not empty
    if(contactNumberField.value && !/^09[0-9]{9}$/.test(contactNumberField.value)) {
        invalidInput = true;
        contactNumberField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        contactNumberError.setAttribute("style", "visibility: visible");
    }

    if(invalidInput) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/accounts/save-profile`, {
            method: "PATCH",
            credentials: "include",
            body: new FormData(profileForm)
        })

        if(response.ok) {
            alert("Account details saved.");

            saveProfileButton.disabled = true;
            initialSnapshot = new FormData(profileForm);
        } else {
            const result = await response.json(); // Placed here because backend sends 204 (no body) if success
            alert(`Could not save changes: ${result.message}`);

            // console.log("Errors:");
            // for(const error in result.errors) {
            //     console.log(`${error}: ${result.errors[error]}`);
            // }
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
        const _id = userToDisplay._id;
        const response = await fetch(`${BASE_URL}/api/accounts/${_id}`, {
            method: "DELETE",
            credentials: "include"
        });

        if(response.ok) {
            alert("Account successfully deleted.");
            
            sessionStorage.removeItem("currentUser"); 
            window.location.href = "index.html"; 
        } else {
            const result = await response.json(); // Placed here because backend sends 204 (no body) if success
            alert(`Could not delete account: ${result.message}`);
        }
    } catch(err) {
        console.error("Account deletion error:", err);
        alert("Server error. Try again later.");
    }
});


// Enable "save profile" button if user changes profile details
profileForm.addEventListener("input", checkFormDifferences);
profileForm.addEventListener("change", checkFormDifferences);

// Clear error indicators after user tries to input again
firstNameField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    firstNameError.setAttribute("style", "visibility: hidden");
});
lastNameField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    lastNameError.setAttribute("style", "visibility: hidden");
});
contactNumberField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    contactNumberError.setAttribute("style", "visibility: hidden");
});

// Auto-capitalize input for first name and last name
firstNameField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
});
lastNameField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
});
// Only numbers allowed for input for contact number
document.getElementById("contact-number").addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/, "");
});