document.addEventListener("DOMContentLoaded", function () 
{
    const CLASS_HIDDEN = "hidden";
    const CLASS_SUCCESS = "success";
    const messageBox = document.getElementById("message");

    function showMessage(text, type = CLASS_SUCCESS)
    {
        messageBox.textContent = text;
        messageBox.className = type;
        messageBox.classList.remove(CLASS_HIDDEN);

        setTimeout(() => {
            messageBox.classList.add(CLASS_HIDDEN);
        }, 2500);
    }

    function renderUserTable(users)
    {
        const table = document.getElementById("user-list");
        table.innerHTML = "";

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    ${user.role !== 'admin' ? `
                        <button class="make-admin-btn" data-id="${user.id}">Make Admin</button>
                        <button class="delete-user-btn" data-id="${user.id}">Delete</button>
                    ` : `
                        <button class="remove-admin-btn" data-id="${user.id}">Remove Admin</button>
                    `}
                </td>
            `;
            table.appendChild(row);
        });

        attachUserButtonEvents();
    }

    function attachUserButtonEvents()
    {
        document.querySelectorAll(".make-admin-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                await fetch(`/api/users/${id}/role`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: "admin" })
                });

                showMessage("User promoted to admin");
                loadUsers();
            });
        });
        
        document.querySelectorAll(".remove-admin-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                await fetch(`/api/users/${id}/role`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role: "customer" })
                });

                showMessage("Admin demoted to customer");
                loadUsers();
            });
        });
        
        document.querySelectorAll(".delete-user-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.id;
                if(confirm("Are you sure you want to delete this user?")) {
                    await fetch(`/api/users/${id}`, { method: "DELETE" });
    
                    showMessage("User deleted");
                    loadUsers();
                }
            });
        });
    }

    function loadUsers() 
    {
        fetch("/api/users")
            .then(res => res.json())
            .then(renderUserTable);
    }

    loadUsers();
});