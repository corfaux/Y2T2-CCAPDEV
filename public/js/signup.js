const firstNameField = document.getElementById("first-name");
const firstNameError = document.querySelector("#first-name + .error");
const lastNameField = document.getElementById("last-name");
const lastNameError = document.querySelector("#last-name + .error");
const idField = document.getElementById("id");
const idError = document.querySelector("#id + .error");
const emailField = document.getElementById("email");
const emailError = document.querySelector("#email + .error");
const passwordField = document.getElementById("password");
const passwordError = document.querySelector("#password + .error");

document.querySelector(".signup-pane form").addEventListener("submit", async (e) => {
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
    // ID number validation: https://kroongho.livejournal.com/84664.html
    let isValidID = true;
    if(idField.value.length !== 8) {
        isValidID = false;
    } else {
        let sum = 0;
        for(let i = 8; i >= 1; i--) {
            sum += parseInt(idField.value.charAt(8 - i)) * i;
        }
        
        isValidID = sum % 11 === 0;
    }
    if(!idField.value || !isValidID) {
        invalidInput = true;
        idField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        idError.setAttribute("style", "visibility: visible");

        if(!idField.value) {
            idError.textContent = "Please enter your ID number.";
        } else {
            idError.textContent = "Invalid ID number.";
        }        
    }
    if(!emailField.value || !/^[^\s@]+@dlsu.edu.ph/.test(emailField.value)) {
        invalidInput = true;
        emailField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        emailError.setAttribute("style", "visibility: visible");

        if(!emailField.value) {
            emailError.textContent = "Please enter your DLSU email address.";
        } else {
            emailError.textContent = "Please enter a valid DLSU email address.";
        }
    }
    if(!passwordField.value || passwordField.value.length < 8) {
        invalidInput = true;
        passwordField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        passwordError.setAttribute("style", "visibility: visible");

        if(!passwordField.value) {
            passwordError.textContent = "Please enter a password.";
        } else {
            passwordError.textContent = "Password must be at least 8 characters.";
        }
    }

    if(invalidInput) {
        return;
    }

    const newUserData = {
        _id: idField.value,
        firstName: firstNameField.value,
        lastName: lastNameField.value,
        email: emailField.value,
        password: passwordField.value,
        contactNumber: "",
        college: "none",
        description: "",
        photo: "",
        role: "student"
    };
    
    try {
        const response = await fetch("http://localhost:3000/api/accounts/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUserData)
        });

        const result = await response.json();
        if(response.ok) {
            alert("Account created successfully!");
            window.location.href = "index.html";
        } else {
            alert(`Registration failed: ${result.message}`);

            // console.log("Errors:");
            // for(const error in result.errors) {
            //     console.log(`${error}: ${result.errors[error]}`);
            // }
        }
    } catch(err) {
        console.error("Signup error:", err);
        alert("Server error. Try again later.");
    }
});

// Clear error indicators after user tries to input again
firstNameField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    firstNameError.setAttribute("style", "visibility: hidden");
});
lastNameField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    lastNameError.setAttribute("style", "visibility: hidden");
});
idField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    idError.setAttribute("style", "visibility: hidden");
});
emailField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    emailError.setAttribute("style", "visibility: hidden");
});
passwordField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    passwordError.setAttribute("style", "visibility: hidden");
});

// Auto-capitalize input for first name and last name
firstNameField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
});
lastNameField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\b\w/g, (char) => char.toUpperCase());
});
// Only numbers allowed for input for ID number
idField.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/, "");
});