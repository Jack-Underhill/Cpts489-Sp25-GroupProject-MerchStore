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

        const addToCartBtn = document.querySelector(".product-info button");
        if (addToCartBtn) {
            addToCartBtn.addEventListener("click", async () => {
                const res = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productId, quantity: 1 })
                });

                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                } else {
                    alert(data.error || "Failed to add to cart.");
                }
            });
        }

    } catch (err) {
        console.error(err);
        alert("Could not load product details.");
    }
});
