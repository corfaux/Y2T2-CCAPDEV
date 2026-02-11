function login(event) {
    event.preventDefault();

    const emailAddress = document.getElementById("email-field").value;
    const password = document.getElementById("password-field").value;

    if(userLoginMode) {
        if(emailAddress in userData && password === userData[emailAddress].password) {
            sessionStorage.setItem("currentUser", JSON.stringify(userData[emailAddress]));
            window.location.href = ("student-profile.html");
        } else {
            window.location.reload();
        }
    } else {
        if(emailAddress in technicianCredentials && password === technicianCredentials[emailAddress]) {
            sessionStorage.setItem("currentTechnician", emailAddress);

            // TODO: change this to landing page for technician
            // window.location.href = ("manage-laboratories.html");
        } else {
            window.location.reload();
        }
    }
}

function register(event) {
    event.preventDefault();

    
}

function changeLoginMode(event) {
    const welcomeMsgHeader = document.querySelector(".welcome-message h2");
    const welcomeMsgPara = document.querySelector(".welcome-message p");

    if(userLoginMode) {
        welcomeMsgHeader.textContent = "Lab Technician Login";
        welcomeMsgPara.textContent = "Log in to manage users, reservations, and laboratories.";
        switchModeBtn.textContent = "User Login";
        userLoginMode = false;
    } else {
        welcomeMsgHeader.textContent = "Welcome, Lasallian!";
        welcomeMsgPara.textContent = "Use your DLSU email address to continue with LabSys!";
        switchModeBtn.textContent = "Lab Technician Login";
        userLoginMode = true;
    }
}


let userLoginMode = true;
const loginForm = document.querySelector(".login-pane form");
const switchModeBtn = document.getElementById("switch-mode-btn");

loginForm.addEventListener("submit", login);
switchModeBtn.addEventListener("click", changeLoginMode);