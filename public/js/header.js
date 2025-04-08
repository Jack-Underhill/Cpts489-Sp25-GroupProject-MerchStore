document.addEventListener("DOMContentLoaded", function () {
    fetch("../components/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;

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
