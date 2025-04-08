document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query")?.toLowerCase() || "";

    const summary = document.getElementById("search-summary");
    const resultsContainer = document.getElementById("search-results");

    if (!query) {
        summary.textContent = "No search query provided.";
        return;
    }

    summary.textContent = `Search results for "${query}"`;
});
