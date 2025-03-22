document.addEventListener("DOMContentLoaded", function ()
{
    fetch("../components/templateStyles.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("styles-placeholder").innerHTML = data;
        })
        .catch(error => console.error("Error loading templateStyles:", error));
});