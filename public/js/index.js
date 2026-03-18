async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email-field").value;
  const password = document.getElementById("password-field").value;

  if (!userLoginMode) {
    // Technician login remains the same
    if(email in technicianCredentials && password === technicianCredentials[email]) {
      sessionStorage.setItem("currentTechnician", email);
      window.location.href = "lab-management.html";
    } else {
      alert("Incorrect technician credentials");
    }
    return;
  }

  // student login: call backend
  try {
    const res = await fetch("http://localhost:5000/api/accounts/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // save the full MongoDB object with _id
    sessionStorage.setItem("currentUser", JSON.stringify(data));

    // redirect to student profile
    window.location.href = "student-profile.html";
  } catch (err) {
    console.error("Login error:", err);
    alert("Server error. Try again later.");
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
