document.addEventListener("DOMContentLoaded", async () => {
    const handleLogout = async () => {
        try {
            const res = await fetch("/api/logout", { method: "POST" });
            if(res.ok) {
                window.location.href = "/pages/login.html";
            } else {
                alert("Logout failed.");
            }
        } catch (err) {
            console.error("Logout error:", err);
            alert("An error occurred during logout.");
        }
    };

    const logoutCustomer = document.getElementById("logout-customer");
    if(logoutCustomer) logoutCustomer.addEventListener("click", handleLogout);

    const observeAdminLogout = () => {
        const logoutAdmin = document.getElementById("logout-admin");
        if(logoutAdmin) {
            logoutAdmin.addEventListener("click", handleLogout);
            return true;
        }
    };

    if(!observeAdminLogout()) {
        const observer = new MutationObserver(() => {
            if(observeAdminLogout()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
});