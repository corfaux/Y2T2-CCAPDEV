const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://labsys-d4fk.onrender.com";

document.querySelector(".signup-pane form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUserData = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email-field").value,
        password: document.getElementById("password-field").value,
        contactNumber: "",
        idNumber: "",
        college: "none",
        description: "",
        photo: "",
        role: "student"
    };
    
    try {
        const response = await fetch(`${BASE_URL}/api/accounts/signup`, {
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
        }
    } catch(err) {
        console.error("Signup error:", err);
        alert("Server error. Try again later.");
    }
});