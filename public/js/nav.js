document.addEventListener("DOMContentLoaded", function ()
{
    fetch("/components/nav.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("nav-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading nav:", error));
});