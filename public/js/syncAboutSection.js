document.addEventListener("DOMContentLoaded", function ()
{
    fetch("/pages/about.html")
        .then(res => res.text())
        .then(html => {
            const temp = document.createElement("div");
            temp.innerHTML = html;

            const aboutPara = temp.querySelector(".about-merch");
            const placeholder = document.getElementById("about-placeholder");

            if(aboutPara && placeholder) {
                placeholder.appendChild(aboutPara.cloneNode(true));
            }
        })
        .catch(error => console.error("Failed to load about section in home page:", error));
});