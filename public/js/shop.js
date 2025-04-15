document.addEventListener("DOMContentLoaded", async function () {
    const summary = document.getElementById("shop-summary");
    const resultsContainer = document.getElementById("shop-results");

    try {
        const res = await fetch("/api/products");
        const products = await res.json();

        if(!Array.isArray(products) || products.length === 0) {
            resultsContainer.innerHTML = `<p>No products found.</p>`;
            return;
        }

        summary.textContent = `Showing ${products.length} products available:`;

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
