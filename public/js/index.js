document.querySelector(".login-pane form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email-field").value;
    const password = document.getElementById("password-field").value;

    try {
        const response = await fetch("http://localhost:3000/api/accounts/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if(!response.ok) {
            alert(data.message || "Login failed");
            return;
        }

        sessionStorage.setItem("currentUser", JSON.stringify(data));
        window.location.href = data.role === "student" ? // handle login modes
                               "student-profile.html" : "lab-management.html";
    } catch(err) {
        console.error("Login error:", err);
        alert("Server error. Try again later.");
    }
});