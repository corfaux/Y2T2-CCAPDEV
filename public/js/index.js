const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://labsys-d4fk.onrender.com";

const emailField = document.getElementById("email-field");
const emailError = document.querySelector("#email-field + .error");
const passwordField = document.getElementById("password-field");
const passwordError = document.querySelector("#password-field + .error");
const rememberMeOption = document.getElementById("remember-me");

// No need to log in again if there is currently a session
document.addEventListener("DOMContentLoaded", async (e) => {
    try {
        const response = await fetch(`${BASE_URL}/api/accounts/check-session`, {
            method: "GET",
            credentials: "include"
        });

        if(response.ok) {
            const data = await response.json();

            window.location.href = data.role === "student" ?
                                    "student-profile.html" : "lab-management.html";
        }
    } catch(err) {
        console.error("Error checking session:", err);
    }
});

document.querySelector(".login-pane form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Form validation
    let invalidInput = false;
    if(!emailField.value) {
        invalidInput = true;
        emailField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        emailError.setAttribute("style", "visibility: visible");
    }
    if(!passwordField.value) {
        invalidInput = true;
        passwordField.setAttribute("style", "background-color: #ffeae8;  border: 2px solid #ce2c30;");
        passwordError.setAttribute("style", "visibility: visible");
    }

    if(invalidInput) {
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/api/accounts/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailField.value,
                password: passwordField.value,
                rememberMe: rememberMeOption.checked
            })
        });

        const data = await response.json();
        if(!response.ok) {
            alert(data.message || "Login failed.");

            // console.log("Errors:");
            // for(const error in result.errors) {
            //     console.log(`${error}: ${result.errors[error]}`);
            // }
            
            return;
        }

        sessionStorage.setItem("currentUser", JSON.stringify(data.account));
        window.location.href = data.account.role === "student" ? // handle login modes
                                "student-profile.html" : "lab-management.html";
    } catch(err) {
        console.error("Login error:", err);
        alert("Server error. Try again later.");
    }
});

// Clear error indicators after user tries to input again
emailField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    emailError.setAttribute("style", "visibility: hidden");
});
passwordField.addEventListener("focus", (e) => {
    e.target.setAttribute("style", "background-color: revert;  border: revert;");
    passwordError.setAttribute("style", "visibility: hidden");
});