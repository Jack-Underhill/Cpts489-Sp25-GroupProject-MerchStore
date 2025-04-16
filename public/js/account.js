document.addEventListener("DOMContentLoaded", async () => {
    const profile = document.getElementById("profile-info");

    try {
        const res = await fetch("/api/current-user");
        const data = await res.json();

        if(!data.loggedIn || data.user?.role !== "customer") {
            window.location.href = "/pages/login.html";
            return;
        }

        profile.innerHTML = `<p>Username: ${data.user.email}</p>`;
    } catch (err) {
        console.error("Error verifying session:", err);
        window.location.href = "/pages/login.html";
    }
});