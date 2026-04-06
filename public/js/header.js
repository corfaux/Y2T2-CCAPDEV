document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.getElementById("navLinks");
    const logoutBtn = document.getElementById("logout-btn");
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!navLinks) return;

    function renderHeader() {
         if (!currentUser) {
            navLinks.innerHTML = `
                <li><a href="about.html">About</a></li>
            `;

            if (logoutBtn) {
                logoutBtn.textContent = "Log In";
                logoutBtn.href = "index.html";
            }

            return;
        }

        if (currentUser.role === "admin") {
            navLinks.innerHTML = `
                <li><a href="about.html">About</a></li>
                <li><a href="reservation.html">Make a Reservation</a></li>
                <li><a href="reservation-management.html">Manage Reservations</a></li>
                <li><a href="lab-management.html">Manage Laboratories</a></li>
            `;
        } else {
            navLinks.innerHTML = `
                <li><a href="about.html">About</a></li>
                <li><a href="student-profile.html">View Profile</a></li>
                <li><a href="reservation.html">Make a Reservation</a></li>
            `;
        }
    }

    renderHeader();

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.clear();
        });
    }
});