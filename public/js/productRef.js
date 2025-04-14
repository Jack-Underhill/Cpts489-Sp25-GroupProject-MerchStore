document.addEventListener("DOMContentLoaded", async function () {
    const productImages = document.querySelectorAll(".product-ref");

    let products = [];
    try {
        const res = await fetch("/api/products");
        products = await res.json();
    } catch (err) {
        console.error("Failed to load products:", err);
        return;
    }

    productImages.forEach(img => {
        const filename = img.src.split("/").pop();

        const product = products.find(p => {
            const productImageName = p.imageUrl.split("/").pop();
            return productImageName === filename;
        });

        if(!product) return;

        const button = document.createElement("button");
        button.classList.add("product-card");
        button.setAttribute("onclick", `openProductPage('${product.id}')`);

        const title = document.createElement("span");
        title.classList.add("product-title");
        title.textContent = product.name;

        button.appendChild(img.cloneNode(true));
        button.appendChild(title);

        img.replaceWith(button);
    });
});

function openProductPage(productId) {
    window.location.href = `/pages/productDetails.html?product=${encodeURIComponent(productId)}`;
}
