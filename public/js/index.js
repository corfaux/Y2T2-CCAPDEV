async function login(event) {
  event.preventDefault();

  const email = document.getElementById("email-field").value;
  const password = document.getElementById("password-field").value;

  // if (!userLoginMode) {
  //   // Technician login remains the same
  //   if(email in technicianCredentials && password === technicianCredentials[email]) {
  //     sessionStorage.setItem("currentTechnician", email);
  //     window.location.href = "lab-management.html";
  //   } else {
  //     alert("Incorrect technician credentials");
  //   }
  //   return;
  // }

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

    sessionStorage.setItem("currentUser", JSON.stringify(data));
    window.location.href = data.role === "student" ? "student-profile.html" : "lab-management.html";
  } catch (err) {
    console.error("Login error:", err);
    alert("Server error. Try again later.");
  }
}


document.querySelector(".login-pane form").addEventListener("submit", login);