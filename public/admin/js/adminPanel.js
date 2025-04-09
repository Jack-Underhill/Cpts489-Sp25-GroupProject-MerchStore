document.addEventListener("DOMContentLoaded", function ()
{
    fetch("/public/admin/adminPanel.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("adminPanel-placeholder").innerHTML = data;

            adjustSidebarHeight();

            const content = document.querySelector('.admin-content');
            if(content) {
                contentObserver.observe(content);
            }
        })
        .catch(error => console.error("Error loading admin panel:", error));
});

function adjustSidebarHeight() {
    const sidebar = document.querySelector('.admin-sidebar');
    const content = document.querySelector('.admin-content');

    sidebar.style.height = 'auto';
    const contentHeight = content.getBoundingClientRect().height;

    if(contentHeight > 400) {
        sidebar.style.height = contentHeight + 'px';
    } else {
        sidebar.style.height = '400px';
    }
}

const contentObserver = new ResizeObserver(() => {
    adjustSidebarHeight();
}); 

window.addEventListener('load', adjustSidebarHeight);

window.addEventListener('resize', adjustSidebarHeight);