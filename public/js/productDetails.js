document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    if (!productId) {
        alert('No product ID provided.');
        return;
    }

    try {
        const response = await fetch(`/api/products/id/${productId}`);
        if (!response.ok) throw new Error('Product not found');

        const product = await response.json();

        document.getElementById("product-title").textContent = product.name;
        document.getElementById("main-image").src = product.imageUrl;
        document.getElementById("product-price").textContent = `$${product.price.toFixed(2)}`;
        document.getElementById("product-description").textContent = product.description;

        const attrList = document.getElementById("product-attributes");
        attrList.innerHTML = product.attributes.map(attr => `<li>${attr}</li>`).join('');

    } catch (err) {
        console.error(err);
        alert("Could not load product details.");
    }
});