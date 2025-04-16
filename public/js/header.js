document.addEventListener("DOMContentLoaded", function () {
    fetch("/components/header.html")
        .then(response => response.text())
        .then(async (data) => {
            document.getElementById("header-placeholder").innerHTML = data;
            
            // Profile Button Logic
            const profileLink = document.getElementById("profile-link");

            try {
                const res = await fetch("/api/current-user");
                const data = await res.json();

                if(data.user.role === "admin") {
                    profileLink.setAttribute("href", "/admin/adminDashboard.html");
                } else if(data.user.role === "customer") {
                    profileLink.setAttribute("href", "/pages/account.html");
                } else {
                    profileLink.setAttribute("href", "/pages/login.html");
                }
            } catch (err) {
                console.error("Failed to determine user role:", err);
                
                if(profileLink) {
                    profileLink.setAttribute("href", "/pages/login.html");
                }
            }

            // Search Form Logic
            const searchForm = document.getElementById("header-search-form");
            const searchInput = document.getElementById("header-search-input");

            if (searchForm) {
                searchForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `/search?query=${encodeURIComponent(query)}`;
                    }
                });
            }
        })
        .catch(error => console.error("Error loading header:", error));
});