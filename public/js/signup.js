async function signup(event) {
    event.preventDefault();

    const newUserData = {
        firstName: document.getElementById("first-name").value,
        lastName: document.getElementById("last-name").value,
        email: document.getElementById("email-field").value,
        password: document.getElementById("password-field").value,
        contactNumber: "",
        idNumber: "",
        college: "none",
        description: "",
        role: "student"
    };
    
    try {
        const res = await fetch("http://localhost:5000/api/accounts/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUserData)
        });

        const result = await res.json();
        if(res.ok) {
            alert("Account created successfully!");
            window.location.href = "index.html";
        } else {
            alert(`Registration failed: ${result.message}`);
        }
    } catch(err) {
        console.error("Signup error:", err);
        alert("Server error. Try again later.");
    }
}


document.querySelector(".signup-pane form").addEventListener("submit", signup);