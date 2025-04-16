document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query")?.toLowerCase() || "";

    const summary = document.getElementById("search-summary");
    const resultsContainer = document.getElementById("search-results");

    if (!query) {
        summary.textContent = "No search query provided.";
        return;
    }

    summary.textContent = `Search results for "${query}"...`;

    try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        const products = await res.json();

        if(!Array.isArray(products) || products.length === 0) {
            resultsContainer.innerHTML = `<p>No products found.</p>`;
            return;
        }

        summary.textContent = `Showing ${products.length} result(s) for "${query}":`;

        resultsContainer.innerHTML = "";
        resultsContainer.classList.add("search-results-grid");

        products.forEach(product => {
            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <img src="${product.imageUrl}" class="product-image" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
            `;

            card.addEventListener("click", function () {
                window.location.href = `/pages/productDetails.html?product=${encodeURIComponent(product.id)}`;
            });
            
            resultsContainer.appendChild(card);
        });
    } catch (err) {
        console.error('Error fetching product:', err);
        summary.textContent = "An error occured while searching";
    }
});
